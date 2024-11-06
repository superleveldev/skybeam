import { inngest } from '../../client';
import { env } from '../../../env';
import { db } from '../../../server/db';
import {
  transformCreativeS3ForPresigned,
  getPresignedUrl,
  uploadToS3,
} from '../../../../src/server/s3';
import {
  CreateJobCommand,
  CreateJobCommandInput,
  GetJobCommand,
  GetJobCommandInput,
  MediaConvertClient,
  OutputGroupDetail,
} from '@aws-sdk/client-mediaconvert';
import { creatives } from '@limelight/shared-drizzle';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';
import { del, put } from '@vercel/blob';
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { eq } from 'drizzle-orm';
import { NonRetriableError } from 'inngest';

function createMediaConvertClient(): MediaConvertClient {
  return new MediaConvertClient({
    region: env.AWS_REGION,
    credentials: awsCredentialsProvider({ roleArn: env.AWS_ROLE_ARN }),
    endpoint: `https://mediaconvert.${env.AWS_REGION}.amazonaws.com`,
  });
}

export const creativeCreated = inngest.createFunction(
  {
    id: 'creatives-creative-created',
  },
  { event: 'creatives/creative.created' },
  async ({ event, step }) => {
    const { id, video } = event.data;
    const { downloadUrl, pathname, url } = video;

    let creative = await step.run(
      'Find the creative in the database',
      async () => {
        const creatives = await db.query.creatives.findMany({
          where: (creatives, { eq }) => {
            return eq(creatives.id, id);
          },
        });
        if (!creatives.length || !creatives[0].id) {
          throw new NonRetriableError(
            'Unable to find creative in the database',
          );
        }
        return creatives[0];
      },
    );

    const filePath = await step.run(
      'Upload the file to cloud storage',
      async () => {
        const videoResp = await fetch(downloadUrl);
        const videoBlob = await videoResp.blob();
        const file = await videoBlob.arrayBuffer();

        const response = await uploadToS3(
          file as StreamingBlobPayloadInputTypes,
          pathname,
        );
        return response;
      },
    );

    const updatedCreatives = await step.run(
      'Update the filePath of the creative',
      async () => {
        return db
          .update(creatives)
          .set({ filePath })
          .where(eq(creatives.id, id))
          .returning();
      },
    );

    creative = updatedCreatives[0];
    const inputPath = creative.filePath;
    if (!inputPath) {
      throw new NonRetriableError('Creative is not stored in cloud storage');
    }
    const outputPath = `${inputPath.slice(
      0,
      inputPath.lastIndexOf('/'),
    )}/transcodes/`;

    const jobId = await step.run('Transcode creative', async () => {
      const mediaConvertClient = createMediaConvertClient();

      const params: CreateJobCommandInput = {
        Role: env.AWS_MEDIA_CONVERTER_ROLE_ARN,
        Settings: {
          Inputs: [
            {
              FileInput: inputPath as string,
              AudioSelectors: {
                'Audio Selector 1': {
                  DefaultSelection: 'DEFAULT',
                },
              },
            },
          ],
          OutputGroups: [
            // MP4 Output Group
            {
              Name: 'MP4_Group',
              Outputs: [
                {
                  NameModifier: '_MP4',
                  ContainerSettings: {
                    Container: 'MP4',
                  },
                  VideoDescription: {
                    CodecSettings: {
                      Codec: 'H_264',
                      H264Settings: {
                        RateControlMode: 'QVBR',
                        SceneChangeDetect: 'ENABLED',
                        QualityTuningLevel: 'SINGLE_PASS',
                        FramerateControl: 'SPECIFIED',
                        FramerateNumerator: 30,
                        FramerateDenominator: 1,
                        GopSize: 90,
                        GopSizeUnits: 'FRAMES',
                        MaxBitrate: 5000000,
                        MinIInterval: 0,
                        NumberBFramesBetweenReferenceFrames: 2,
                      },
                    },
                  },
                  AudioDescriptions: [
                    {
                      AudioTypeControl: 'FOLLOW_INPUT',
                      CodecSettings: {
                        Codec: 'AAC',
                        AacSettings: {
                          Bitrate: 256000, // Updated bitrate
                          SampleRate: 96000,
                          CodingMode: 'CODING_MODE_2_0',
                        },
                      },
                    },
                  ],
                },
              ],
              OutputGroupSettings: {
                Type: 'FILE_GROUP_SETTINGS',
                FileGroupSettings: {
                  Destination: `${outputPath}/mp4/`,
                },
              },
            },
            // Thumbnail Output Group
            {
              Name: 'Thumbnail_Group',
              Outputs: [
                {
                  NameModifier: '_Thumbnail',
                  ContainerSettings: {
                    Container: 'RAW',
                  },
                  VideoDescription: {
                    CodecSettings: {
                      Codec: 'FRAME_CAPTURE',
                      FrameCaptureSettings: {
                        FramerateNumerator: 1,
                        FramerateDenominator: 1,
                        MaxCaptures: 1, // Capture only one frame
                      },
                    },
                  },
                },
              ],
              OutputGroupSettings: {
                Type: 'FILE_GROUP_SETTINGS',
                FileGroupSettings: {
                  Destination: `${outputPath}/thumbnails/`,
                },
              },
            },
          ],
          TimecodeConfig: {
            Source: 'EMBEDDED',
          },
        },
        // Queue: 'STRING_VALUE', // optional, if you use a specific queue
      };

      try {
        const command = new CreateJobCommand(params);
        const data = await mediaConvertClient.send(command);
        if (data.Job) {
          return data.Job?.Id;
        }
      } catch (e) {
        let message = '';
        if (typeof e === 'string') {
          message = e;
        } else if (e instanceof Error) {
          message = e.message;
        }
        throw new Error(
          `Something went wrong with the transcoding - ${message}`,
        );
      }
    });

    if (jobId) {
      const job = await step.invoke('Wait for transcoding to be successful', {
        function: creativeTranscoded,
        data: {
          jobId: jobId,
        },
      });

      if (job.status == 'COMPLETE') {
        await step.run('Update creative in database', async () => {
          const outputDetails = job.details[0].OutputDetails || [];
          const transcodedVideoDetails = outputDetails[0];
          const durationMS = transcodedVideoDetails?.DurationInMs;
          const resolutionWidth =
            transcodedVideoDetails?.VideoDetails?.WidthInPx;
          const resolutionHeight =
            transcodedVideoDetails?.VideoDetails?.HeightInPx;

          return db
            .update(creatives)
            .set({
              transcodedPath: outputPath,
              durationMS,
              resolutionWidth,
              resolutionHeight,
            })
            .where(eq(creatives.id, id))
            .returning();
        });

        await step.run('Delete the video in Vercel', async () => {
          await del(url);
        });

        const previewLocation = transformCreativeS3ForPresigned(
          outputPath,
          'thumbnails/creative_Thumbnail.0000000.jpg',
        );

        const presignedUrl = await step.run(
          'Get presigned URL for preview',
          async () => {
            return await getPresignedUrl(previewLocation, 300);
          },
        );

        const picture = await step.run(
          'Save preview image to Vercel',
          async () => {
            const previewImage = await fetch(presignedUrl).then((res) =>
              res.blob(),
            );
            return await put(previewLocation, previewImage, {
              access: 'public',
            });
          },
        );

        await step.run('Save the preview URL in database', async () => {
          return await db
            .update(creatives)
            .set({ previewUrl: picture.url })
            .where(eq(creatives.id, id))
            .returning();
        });
      } else {
        console.log(
          `Something went wrong with the transcoding process - ${job.status}`,
        );
        throw new Error('Something went wrong with the transcoding process');
      }
    } else {
      throw new Error('Something went wrong with the transcoding process');
    }
  },
);

type CreativeTranscodedType = {
  status: string | undefined;
  details: OutputGroupDetail[];
};

export const creativeTranscoded = inngest.createFunction(
  {
    id: 'creatives-creative-transcoded',
    throttle: {
      limit: 1,
      period: '30s',
      key: 'event.data.jobId',
    },
  },
  { event: 'creatives/creative.transcoded' },
  async ({ event, step }): Promise<CreativeTranscodedType> => {
    const { jobId } = event.data;
    const mediaConvertClient = createMediaConvertClient();

    await step.sleep('Wait between transcoding', '30s');

    const response = await step.run(
      'Check the status of a transcoding job',
      async () => {
        const params: GetJobCommandInput = {
          Id: jobId,
        };
        const command = new GetJobCommand(params);
        const response = await mediaConvertClient.send(command);

        const invalidStatuses = ['SUBMITTED', 'PROGRESSING'];
        if (!invalidStatuses.includes(response.Job?.Status || 'SUBMITTED')) {
          return response;
        } else {
          throw new Error('Media is not finished transcoding');
        }
      },
    );

    return {
      status: response.Job?.Status,
      details: response.Job?.OutputGroupDetails || [],
    };
  },
);

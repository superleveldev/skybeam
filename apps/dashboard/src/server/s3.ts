import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { awsCredentialsProvider } from '@vercel/functions/oidc';
import { env } from '../env';
import { StreamingBlobPayloadInputTypes } from '@smithy/types';

function createS3Client(): S3Client {
  const s3Configuration: S3ClientConfig = {
    region: env.AWS_REGION,
    credentials: awsCredentialsProvider({ roleArn: env.AWS_ROLE_ARN }),
  };
  return new S3Client(s3Configuration);
}

export function transformCreativeS3ForPresigned(
  path: string,
  resource: string,
): string {
  return path.replace(`s3://${env.AWS_S3_BUCKET_NAME}/`, '') + resource;
}

export async function getPresignedUrl(
  key: string,
  expiresInSeconds: number,
): Promise<string> {
  const s3Client = createS3Client();
  const bucket = env.AWS_S3_BUCKET_NAME;
  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return await getSignedUrl(s3Client, getCommand, {
    expiresIn: expiresInSeconds,
  });
}

export async function uploadToS3(
  body: StreamingBlobPayloadInputTypes,
  key: string,
): Promise<string> {
  const s3Client = createS3Client();
  const bucket = env.AWS_S3_BUCKET_NAME;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
  });
  try {
    const response = await s3Client.send(command);
    if (response.$metadata.httpStatusCode == 200) {
      return `s3://${bucket}/${key}`;
    } else {
      throw new Error('Something went wrong with file upload');
    }
  } catch (e) {
    let message = '';
    if (typeof e === 'string') {
      message = e;
    } else if (e instanceof Error) {
      message = e.message;
    }
    console.log(message);
    throw new Error('Something went wrong with file upload');
  }
}

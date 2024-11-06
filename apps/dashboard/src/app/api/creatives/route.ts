import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

import { addMinutes } from 'date-fns';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { db } from '../../../../src/server/db';

import { inngest } from '../../../inngest/client';
import { advertisers, creatives } from '@limelight/shared-drizzle';

const MAX_FILE_SIZE = 5000000000; // 5GB
const ACCEPTED_VIDEO_FORMATS = ['video/mp4', 'video/quicktime'];

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const video = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, creativeId) => {
        if (auth().orgId && creativeId) {
          const result = await db
            .select()
            .from(creatives)
            .innerJoin(advertisers, eq(creatives.advertiserId, advertisers.id))
            .where(
              and(
                eq(creatives.id, creativeId),
                eq(advertisers.clerkOrganizationId, auth().orgId as string),
              ),
            );

          if (result[0].creatives.id) {
            const now = new Date();
            return {
              allowedContentTypes: ACCEPTED_VIDEO_FORMATS,
              maximumSizeInBytes: MAX_FILE_SIZE,
              validUntil: addMinutes(now, 1).getTime(),
              tokenPayload: JSON.stringify({
                creativeId,
              }),
            };
          } else {
            throw new Error('Something went wrong');
          }
        } else {
          throw new Error('Something went wrong');
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        await inngest.send({
          name: 'creatives/creative.created',
          data: {
            id: JSON.parse(tokenPayload as string).creativeId as string,
            video: blob,
          },
        });
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }, // The webhook will retry 5 times waiting for a 200
    );
  }
}

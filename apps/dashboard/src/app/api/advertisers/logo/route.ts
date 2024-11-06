import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

import { addMinutes } from 'date-fns';
import { auth } from '@clerk/nextjs/server';

const MAX_FILE_SIZE = 4000000; // 4MB
const ACCEPTED_LOGO_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const video = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname) => {
        if (auth().orgId) {
          const now = new Date();
          return {
            allowedContentTypes: ACCEPTED_LOGO_TYPES,
            maximumSizeInBytes: MAX_FILE_SIZE,
            validUntil: addMinutes(now, 1).getTime(),
          };
        } else {
          throw new Error('Something went wrong');
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log(`Logo updated - ${blob.url}`);
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

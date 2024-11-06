import { type PutBlobResult } from '@vercel/blob';

type CreativeCreated = {
  data: {
    id: string;
    video: PutBlobResult;
  };
};

type CreativeTranscoded = {
  data: {
    jobId: string;
  };
};

export type CreativeEvents = {
  'creatives/creative.created': CreativeCreated;
  'creatives/creative.transcoded': CreativeTranscoded;
};

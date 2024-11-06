export type PostHogWebhookEvents = {
  'posthog/webhook.received': {
    data: {
      event: {
        uuid: string; // The unique ID of the event
        event: string; // The event name (e.g. $pageview)
        distinct_id: string; // The distinct_id of the identity that created the event
        properties: Record<string, any>;
        timestamp: string;
        url: string; // A URL to view it in PostHog
      };
      person?: {
        id: string; // The unique UUID of the Person
        uuid: string; // The UUID of the Person associated with the distinct_id of the event
        name: string; // Configured based on your "Display name" property in PostHog
        url: string; // A URL to view it in PostHog
        properties: Record<string, any>;
      };
      groups?: {
        [id: string]: {
          id: string;
          type: string;
          index: number;
          url: string; // A URL to view it in PostHog
          properties: Record<string, any>;
        };
      };
      project: {
        id: number; // The ID of the PostHog project
        name: string; // The name of the PostHog project
        url: string; // A URL to view it in PostHog
      };
      source?: {
        name: string; // The name of the source (typically the destination name)
        url: string; // A URL to view it in PostHog
      };
    };
  };
};

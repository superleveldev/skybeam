'use client';

import React, { useEffect } from 'react';

import { queryClient } from '@limelight/shared-utils/clients/react-query-client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/nextjs';
import { env } from '../env';
import posthog from 'posthog-js';
import { usePathname, useSearchParams } from 'next/navigation';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import { IntercomProvider } from 'react-use-intercom';

if (typeof window !== 'undefined') {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY ?? '', {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    ui_host: 'https://us.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
    capture_pageleave: true, // Enable automatic pageleave capture
  });
}

function PageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const postHogClient = usePostHog();

  // Track pageviews
  useEffect(() => {
    if (pathname && postHogClient) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      postHogClient.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, postHogClient]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <IntercomProvider appId={env.NEXT_PUBLIC_INTERCOM_APP_ID} autoBoot>
        <PageView />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </IntercomProvider>
    </PostHogProvider>
  );
}

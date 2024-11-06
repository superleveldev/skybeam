'use client';

import React, { useEffect } from 'react';

import { queryClient } from '@limelight/shared-utils/clients/react-query-client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider, useOrganization, useUser } from '@clerk/nextjs';
import { env } from '../env';
import posthog from 'posthog-js';
import { usePathname, useSearchParams } from 'next/navigation';
import { IntercomProvider, useIntercom } from 'react-use-intercom';
import { PostHogProvider, usePostHog } from 'posthog-js/react';

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

const UserChange = () => {
  const { user } = useUser();
  const { organization } = useOrganization();
  const { update } = useIntercom();

  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user?.primaryEmailAddress?.emailAddress ?? null,
        name: user.fullName,
        activeOrgId: organization?.id ?? null,
      });
      update({
        email: user.primaryEmailAddress?.emailAddress ?? undefined,
        userId: user.id,
        name: user.fullName ?? undefined,
        createdAt: user.createdAt
          ? Math.floor(user.createdAt.getTime() / 1000)
          : undefined,
      });
    }
  }, [user, organization]);

  useEffect(() => {
    if (organization) {
      posthog.group('organization', organization.id, {
        name: organization.name,
      });
    }
  }, [organization]);

  return null;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <PostHogProvider client={posthog}>
        <IntercomProvider appId={env.NEXT_PUBLIC_INTERCOM_APP_ID} autoBoot>
          <PageView />
          <UserChange />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </IntercomProvider>
      </PostHogProvider>
    </ClerkProvider>
  );
}

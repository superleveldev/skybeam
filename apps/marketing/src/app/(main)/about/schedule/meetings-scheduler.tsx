'use client';
import { useEffect } from 'react';

export const MeetingsScheduler = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js';
    script.type = 'text/javascript';
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  return (
    <div
      data-test-hubspot-meeting-component
      className="meetings-iframe-container min-w-full"
      data-src="https://meetings.hubspot.com/jberman5?embed=true"
    />
  );
};

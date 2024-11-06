'use client';
import Script from 'next/script';

export default function SkybeamPixel() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  return (
    <>
      <Script id="skybeam-pixel" strategy="afterInteractive">
        {`
          (function(e,n,t){e["$$d2cxFn"]=t;e[t]=e[t]||function(){(e[t].q=e[t].q||[]).push(arguments)};var c=n.getElementsByTagName("script")[0],o=n.createElement("script");o.async=true;o.src="https://analytics-sm.com/js/v1/beacon.js";c.parentNode.insertBefore(o,c)})(window,document,"sm_beacon");
          sm_beacon('setup', 'beacon', '430d0c5d-c8ae-4eab-8cc1-c1c7216a18d8');
          sm_beacon('setup', 'user_tracking', true);
          sm_beacon('send', 'pageview');
        `}
      </Script>
    </>
  );
}

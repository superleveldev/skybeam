'use client';
import Script from 'next/script';

export default function LinkedInPixel() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }
  return (
    <>
      <Script id="linkedin-insight-tag" strategy="afterInteractive">
        {`
            _linkedin_partner_id = "7812505";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
      </Script>
      <Script id="linkedin-analytics" strategy="afterInteractive">
        {`
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=7812505&fmt=gif"
        />
      </noscript>
    </>
  );
}

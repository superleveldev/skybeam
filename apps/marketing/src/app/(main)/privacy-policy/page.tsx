import Link from 'next/link';

export const generateMetadata = () => ({
  title: 'Privacy Policy',
  description:
    '🛡️ Your privacy matters! Read how Skybeam protects and manages your data to keep you secure while using our services',
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_MARKETING_URL}/social-share.png`,
        width: 1200,
        height: 630,
        alt: 'Skybeam: CTV & Streaming TV Advertising Platform',
      },
    ],
  },
});

import { ReactComponent as PrivacyEmailSVG } from '../../../../public/privacy-email.svg';

export default async function PrivacyPolicyPage() {
  return (
    <div data-section="privacy-policy-section">
      <div className="flex-col gap-y-2 px-[152px] bg-[#0067ff] bg-no-repeat bg-cover bg-[url('/bg-beams.png')] desktop:bg-[url('/bg-beams-large.png')] desktop:bg-cover flex justify-center pt-32 pb-8 pl-6 pr-10 tablet:pb-12 tablet:pt-48 laptop:pt-64 laptop:pb-24 desktop:pl-36 desktop:justify-start">
        <div className="flex flex-col gap-y-2 w-full max-w-full tablet:max-w-[518px] laptop:max-w-[880px] desktop:max-w-[1248px]">
          <h1 className="text-white">Privacy Policy</h1>
          <p className="text-white text-[0.875rem] leading-normal tablet:text-base laptop:text-[1.225rem]">
            Last Updated: November 2, 2024
          </p>
        </div>
      </div>
      <div className="flex justify-center bg-white py-8 px-4 tablet:px-6 laptop:py-16 laptop:px-10 laptop:pr-[152px] desktop:pl-36">
        <div className="text-[#364152] text-[0.875rem] leading-normal w-full max-w-full tablet:max-w-[568px] tablet:text-base laptop:max-w-[768px] laptop:text-[1.125rem] desktop:max-w-[756px]">
          <p>
            Skybeam™ (“Skybeam” or "we" or "us"), a division of Simulmedia Inc.,
            provides advertisers and advertising agencies with a technology
            platform that helps them plan, buy, and measure digital media
            advertising across websites, apps, and digital video content
            (collectively “Digital Properties”) on various devices like phones,
            TVs, tablets etc. This advertising is shown to potential consumers
            i.e. you, of goods and services provided by these advertisers.
          </p>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Overview
          </p>
          <p>
            <br />
            Skybeam's platform allows advertisers to manage digital ad campaigns
            across several channels (e.g. websites, apps, smart TVs) and helps
            ensure ads are relevant to you (the “consumer”) while measuring the
            ad campaign’s performance. Our technology uses data associated with
            online and offline behavior to devices that may be linked to the
            same person or household, thereby improving ad targeting and
            limiting how often someone sees the same ad.
            <br />
            <br />
            <br />
          </p>
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            How We Collect Data
          </p>
          <br />
          <p>
            Skybeam collects data in various ways to provide and enhance our
            services. This section outlines the methods through which we gather
            information:
          </p>
          <ul className="list-disc pl-10">
            <li>
              <p>
                Non-Platform Data: this is data collected about you when you
                interact with us in order to use our Services. These
                interactions, include, but are not limited to, the following:
              </p>
              <ul className="list-disc pl-10">
                <li>
                  <p>Physical and Digital Interactions</p>
                  <ul className="list-[circle] pl-5">
                    <li>
                      <p>
                        Physical Interactions: We may collect your name, address
                        and contact information when you provide it to us during
                        in-person interactions, such as handing us your business
                        card or engaging with our representatives at events.
                      </p>
                    </li>
                    <li>
                      <p>
                        Digital Interactions: We collect name, address and
                        contact information when you interact with us online.
                        This includes when you visit our Site, connect with us
                        on platforms like LinkedIn, register for our products or
                        services, or send us emails regarding our offerings.
                      </p>
                    </li>
                  </ul>
                </li>
                <li>
                  <p>
                    Skybeam Account Registration: When you register for a
                    Skybeam account, we collect personal information necessary
                    to set up and maintain your account, such as your name,
                    email address, and any additional details you choose to
                    provide us.
                  </p>
                </li>
                <li>
                  <p>Site Visits</p>
                  <ul className="list-[circle] pl-5">
                    <li>
                      <p>
                        When you visit our Site, we automatically collect
                        certain information about your device and usage
                        patterns. This may include your IP address (Internet
                        Protocol address), browser type, operating system, pages
                        viewed, and the dates and times of your visits.
                      </p>
                    </li>
                    <li>
                      <p>
                        We utilize cookies and similar tracking technologies to
                        recognize your browser or device. These small data files
                        help enhance your experience and allow us to deliver
                        personalized content. You can manage your cookie
                        preferences through your browser settings.
                      </p>
                    </li>
                  </ul>
                </li>
                <li>
                  <p>
                    Inquiries and Contact: If you reach out to us with
                    inquiries, for Site, Platform or Skybeam support, or for
                    other reasons, we collect the information you provide, such
                    as your name, contact details, and the content of your
                    message.
                  </p>
                </li>
              </ul>
            </li>
            <li>
              <p>
                Platform Data: Skybeam collects pseudonymous and de-identified
                data. Pseudonymous data means data that does not directly
                identify you or your household but may be linked to your device
                or household. De-identified data means data that in any way
                cannot be linked to your or your household. Here’s what we
                collect:
              </p>
              <ul className="list-[circle] pl-5">
                <li>
                  <p>
                    Cookie and device identifiers: Unique identifiers from your
                    browser or device.
                  </p>
                </li>
                <li>
                  <p>
                    IP Address: A unique numerical label assigned to each device
                    connected to the internet which enables us to understand the
                    uniqueness of a device and household.
                  </p>
                </li>
                <li>
                  <p>
                    Internet Browsing or television viewing history: Based on ad
                    impressions and interactions with websites, apps, streaming
                    platforms, television devices or television programming etc.
                  </p>
                </li>
                <li>
                  <p>
                    Device information: Browser type, manufacturer, version, and
                    settings.
                  </p>
                </li>
                <li>
                  <p>
                    Location data: Based on IP address or general location data
                    if available.
                  </p>
                </li>
                <li>
                  <p>Interest data: Inferred from your browsing activity.</p>
                </li>
                <li>
                  <p>
                    Hashed email addresses or phone numbers: Used for anonymous
                    matching and targeting of relevant advertising to you.
                  </p>
                </li>
              </ul>
            </li>
            <li>
              <p>
                This Platform data is pseudonymous and de-identified, and
                collected by us in order to provide our Services to our clients.
                Such data is collected in the following ways:
              </p>
              <ul className="list-[circle] pl-5">
                <li>
                  <p>
                    Ad Requests: We receive data from Digital
                    Properties—including websites, apps, and smart TVs—that
                    request advertisements to be displayed. This data may
                    include device information, browser details, location data,
                    and other parameters necessary for ad delivery.
                  </p>
                </li>
                <li>
                  <p>
                    Media Consumption: we receive pseudonymous data from Digital
                    Properties, device manufacturers, and from advertisers about
                    your interactions with their websites, apps and devices.
                    This assists us in campaign planning and delivering relevant
                    advertising and measuring the impact of ad campaigns.
                  </p>
                </li>
                <li>
                  <p>
                    Cookies and Pixels: We use cookies and pixel tags to
                    recognize browsers and devices over time across Digital
                    Properties or through our clients' apps and websites. This
                    assists in delivering relevant advertising and measuring
                    campaign effectiveness.
                  </p>
                </li>
                <li>
                  <p>
                    Client Data Uploads: Advertisers or their partners may
                    upload data to our platform, which can include audience
                    lists or other information necessary for ad targeting and
                    optimization.
                  </p>
                </li>
                <li>
                  <p>
                    Ad Delivery and Performance: When ads are displayed, we
                    collect data on their performance, such as impressions,
                    clicks, conversions, and other engagement metrics. This
                    information helps us and our clients assess and improve
                    advertising campaigns.
                  </p>
                </li>
                <li>
                  <p>
                    Other Anonymized and De-Identified Data from vendors: We
                    collect and use pseudonymized and de-identified data to
                    purchase and optimize advertising campaigns on behalf of our
                    clients. This data does not directly identify individuals
                    and is used solely for analytical and optimization purposes.
                  </p>
                </li>
              </ul>
            </li>
            <li>
              Regional Considerations: Skybeam currently does not collect or
              process data from residents of the European Union (EU). For
              residents of California, please refer to our California Privacy
              Rights section for more information.
            </li>
          </ul>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Why We Collect Data
          </p>
          <br />
          <p>Skybeam processes Platform Data for the following purposes:</p>
          <ul className="list-disc pl-10">
            <li>
              <p>Personalizing ads: To make ads more relevant to users.</p>
            </li>
            <li>
              <p>Ad delivery: To deliver ads efficiently across devices.</p>
            </li>
            <li>
              <p>
                Frequency control: To limit how often users see the same ad.
              </p>
            </li>
            <li>
              <p>
                Ad effectiveness: To measure how well ads perform (e.g., whether
                a user clicked on an ad or visited a website).
              </p>
            </li>
            <li>
              <p>
                Reporting: To provide feedback to advertisers on campaign
                success.
              </p>
            </li>
            <li>
              <p>
                Device linking: To associate related devices (like a phone and a
                TV in the same household).
              </p>
            </li>
            <li>
              <p>Fraud prevention: To detect and prevent invalid activity.</p>
            </li>
          </ul>
          <br />
          <p>Skybeam processes Non-Platform Data for the following purposes:</p>
          <ul className="list-disc pl-10">
            <li>
              <p>Communications</p>
              <ul className="list-[circle] pl-5">
                <li>
                  <p>
                    Marketing Communications: You may also receive marketing
                    materials and updates about our products and services. You
                    can opt out of these communications at any time by following
                    the unsubscribe instructions in the emails or by contacting
                    us directly.
                  </p>
                </li>
                <li>
                  <p>
                    Essential Updates: By registering and creating an account,
                    you consent to receive essential communications related to
                    your account and our services. These updates are crucial for
                    account maintenance. To stop receiving them, you may delete
                    your account.
                  </p>
                </li>
              </ul>
            </li>
          </ul>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Data Sharing and Disclosure
          </p>
          <br />
          <p>We may share your data:</p>
          <ul className="list-disc pl-10">
            <li>
              <p>
                With Clients i.e. Advertisers and their Advertising Agencies: To
                help improve their advertising campaigns, in order to show users
                more relevant advertising and manage the number of ads users
                see.
              </p>
            </li>
            <li>
              <p>
                With service providers: vendors who assist in delivering our
                services to our Clients.
              </p>
            </li>
            <li>
              <p>
                With governmental agencies: For legal reasons, if required by
                law or to protect Skybeam’s rights.
              </p>
            </li>
          </ul>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Storage, Security and Data Retention
          </p>
          <br />
          <p className="text-[0.875rem] leading-normal font-bold tablet:text-[1.125rem]">
            Storage
          </p>
          <p>
            We store all client and end-user data, including any personally
            identifiable information (PII), in secure databases with
            industry-standard encryption and hashing mechanisms.
          </p>
          <br />
          <p className="text-[0.875rem] leading-normal font-bold tablet:text-[1.125rem]">
            Security
          </p>
          <p>
            Our platform is designed with rigorous security measures to protect
            all collected data. We employ encryption, hashing, and other
            industry standard practices to secure personal data, and take
            commercially reasonable efforts to ensure that data is safeguarded
            from unauthorized access, alteration, loss or theft. Our security
            protocols undergo periodic reviews and updates to stay compliant
            with industry standards and regulatory requirements.
          </p>
          <br />
          <p className="text-[0.875rem] leading-normal font-bold tablet:text-[1.125rem]">
            Data Retention and Deletion
          </p>
          <p>
            We retain Platform Data, which is pseudonymized and de-identified,
            indefinitely in order to provide our Services. We retain the right
            to delete any data at our discretion, particularly to manage storage
            needs or other operational considerations. In the event that data
            deletion becomes necessary, we will ensure it is carried out
            securely and in compliance with all relevant regulations.
          </p>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Your Choices
          </p>
          <br />
          <p>
            For all Platform Data, Skybeam cannot determine whether it maintains
            data on any specific household or individual because all the data it
            collects is pseudonymized or de-identified. However, you can visit
            the following websites to determine whether our Data Vendors have
            information related to you and opt out if desired:
          </p>
          <ul className="list-disc pl-10">
            <li>
              <Link
                className="underline"
                href="https://www.vizio.com/en/terms/privacy-policy/ads-and-privacy-faq"
              >
                <p>Vizio Services, LLC</p>
              </Link>
            </li>
            <li>
              <Link
                className="underline"
                href="https://vault.pactsafe.io/s/23140eac-7498-4f19-be3f-1f9c88ca59a7/legal.html#privacy-policy"
              >
                <p>TiVo Corporation</p>
              </Link>
            </li>
            <li>
              <p>
                Google{' '}
                <Link className="underline" href="https://privacy.google.com/">
                  Customer Info Page
                </Link>{' '}
                |{' '}
                <Link
                  className="underline"
                  href="http://www.google.com/policies/technologies/ads"
                >
                  Opt-Out Page
                </Link>
              </p>
            </li>
            <li>
              <p>
                Experian{' '}
                <Link
                  className="underline"
                  href="http://www.experian.com/marketing-services/marketing-services.html"
                >
                  Customer Info Page
                </Link>{' '}
                |{' '}
                <Link
                  className="underline"
                  href="http://www.experian.com/privacy/opting_out.html"
                >
                  Opt-Out Page
                </Link>
              </p>
            </li>
            <li>
              <p>
                Adobe{' '}
                <Link
                  className="underline"
                  href="http://www.adobe.com/privacy/analytics.html"
                >
                  Customer Info Page
                </Link>{' '}
                |{' '}
                <Link
                  className="underline"
                  href="http://www.adobe.com/privacy/opt-out.html"
                >
                  Opt-Out Page
                </Link>
              </p>
            </li>
            <li>
              <p>
                LiveRamp{' '}
                <Link
                  className="underline"
                  href="https://liveramp.com/privacy/"
                >
                  Customer Info Page
                </Link>{' '}
                |{' '}
                <Link
                  className="underline"
                  href="https://liveramp.com/opt_out/"
                >
                  Opt-Out Page
                </Link>
              </p>
            </li>
            <li>
              <p>
                Transunion (and its affiliates){' '}
                <Link
                  className="underline"
                  href="https://www.transunion.com/consumer-privacy"
                >
                  Customer Info Page | Opt-Out Page
                </Link>
              </p>
            </li>
          </ul>
          <br />
          <p>
            For Internet Connected TVs. Many connected TVs and related devices
            offer a choice mechanism for you to opt-out. To find out more,
            including device-specific instructions, please visit{' '}
            <Link
              className="underline"
              href="https://www.networkadvertising.org/internet-connected-tv-choices/."
            >
              https://www.networkadvertising.org/internet-connected-tv-choices/.
            </Link>
            <br />
            <br />
            Industry opt-out pages. The online advertising industry provides
            websites from which you may set a third-party cookie indicating your
            desire to opt out of interest-based advertising from the Trade Desk
            and other companies that participate in industry self-regulatory
            programs. The US-based opt out pages are{' '}
            <Link className="underline" href="www.aboutads.info/choices">
              www.aboutads.info/choices
            </Link>{' '}
            and{' '}
            <Link
              className="underline"
              href="www.networkadvertising.org/choices"
            >
              www.networkadvertising.org/choices
            </Link>
            <br />
            <br />
            If you opt out of data collection through these Data Vendors,
            Skybeam will no longer receive de-identified (or any other) data
            about your household from these providers.
            <br />
            <br />
            If your household is not part of these vendors' data, or if you opt
            out, Skybeam will not receive information related to your household
            from these vendors.
          </p>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Compliance with Data Protection and Privacy Laws
          </p>
          <br />
          <p>
            We are committed to compliance with applicable data protection laws,
            including the the California Consumer Privacy Act (CCPA), and the
            Children's Online Privacy Protection Act (COPPA). We do not collect
            or process any data or personal information of residents of the E.U.
          </p>

          <br />
          <br />
          <p className="text-[0.875rem] leading-normal font-bold tablet:text-[1.125rem]">
            COPPA
          </p>
          <p>
            Our platform is not intended for children under the age of 13, and
            we do not knowingly collect or store personal information from
            children. Should we become aware that we have inadvertently
            collected data from children, we will promptly take measures to
            delete such data in compliance with COPPA regulations.
          </p>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            California Privacy Rights (CCPA)
          </p>
          <br />
          <p>
            The California Consumer Privacy Act or "CCPA" (California Civil Code
            Section 1798.100 et seq.) applies to the collection, use, and
            disclosure of "personal information" collected from California
            residents (as those terms are defined by the CCPA). CCPA Personal
            Information (CCPA PI) is defined by California law as information
            that identifies, relates to, describes, is capable of being
            associated with, or could reasonably be linked, directly or
            indirectly, with California consumers or households. The CCPA
            requires us to disclose to California consumers the categories of
            personal information (as defined in the CCPA) we collect, our
            business and commercial purposes for collecting, using, or selling
            such personal information, the categories of sources from which we
            collect personal information, the categories of personal information
            we have disclosed or sold for a business or commercial purpose in
            the preceding 12 months, and the categories third parties with whom
            we share personal information. We have provided these disclosures
            below.
            <br />
            <br />
            If you are a California consumer as defined by the CCPA, you may
            have the right to: (i) request access to your personal information
            and request additional details about our information practices, (ii)
            request deletion of your personal information, (iii) opt out of the
            "sale" of your personal information (as that term is defined by the
            CCPA), and (iv) to not be discriminated against for exercising any
            of your rights under the CCPA.
            <br />
            <br />
            Your options regarding the personal information we collect or
            receive about you are described below. Please note that if you wish
            to exercise any of your rights with any of Simulmedia’s clients, you
            must make your request directly to those Simulmedia clients or
            Digital Properties, based on information and procedures that they
            supply. Simulmedia clients own the Platform Data that they maintain
            in the Platform. Simulmedia does not control how those clients use
            Platform Data.
            <br />
            <br />
          </p>
          <p className="text-[0.875rem] leading-normal font-bold tablet:text-[1.125rem]">
            Authorized Agents
          </p>
          <p>
            You may designate an authorized agent to submit a CCPA request on
            your behalf. To do so, you will need to provide the agent with
            written permission, and we may ask for proof of your identity before
            fulfilling the request.
          </p>
          <br />
          <p className="text-[0.875rem] leading-normal font-bold tablet:text-[1.125rem]">
            How to Exercise Your Rights
          </p>
          <p>
            To exercise any of your rights under the CCPA, you may submit a
            Request: Contact us at privacy@skybeam.io. Please include the action
            you need for us to take along with your request.
          </p>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Changes to This Policy
          </p>
          <br />
          <p>
            We may update this privacy policy from time to time. Any changes
            will be posted on our website with the updated effective date.
          </p>
          <br />
          <br />
          <p className="text-[1.125rem] leading-normal tablet:text-[1.5rem] laptop:text-[2.25rem]">
            Contact Us
          </p>
          <p>
            If you have any questions about this policy or your data, please
            contact us at:
            <br />
            Attn: Skybeam Privacy
            <br />
            Simulmedia
            <br />
            401 Park Avenue South, 11th Floor, New York, NY 10016
            <br />
          </p>
          <p className="flex items-center gap-x-2">
            Email: <PrivacyEmailSVG className="mt-[3px]" />
          </p>

          <br />
        </div>
      </div>
    </div>
  );
}

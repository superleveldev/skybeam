import { cn } from '@limelight/shared-utils/classnames/cn';

import { ReactComponent as SupportEmailSVG } from '../../../../public/support-email.svg';
import styles from './page.module.css';

export const generateMetadata = () => ({
  title: 'Terms of Services',
  description: 'Get all the details on Skybeam’s Terms of Services',
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

export default async function TermsOfServicesPage() {
  return (
    <div data-section="terms-of-services-section">
      <div
        className={cn(
          styles.headerContainer,
          'flex flex-col gap-y-2 pt-[260px] px-[152px] pb-[120px] bg-[#0067ff] bg-no-repeat bg-cover bg-[url("/bg-beams.png")] desktop:bg-[url("/bg-beams-large.png")] desktop:bg-cover',
        )}
      >
        <h1 className={styles.title}>Terms of Services</h1>
        <p
          data-test-last-updated-date
          className={cn(styles.subtitle, 'text-white')}
        >
          Last Updated: November 2, 2024
        </p>
      </div>
      <div
        data-test-text-area
        className={cn(
          styles.textContainer,
          'py-[64px] px-[152px] bg-white flex justify-center',
        )}
      >
        <div className={cn(styles.textContent, 'max-w-[756px]')}>
          <p>
            These Terms of Services ("ToS") govern the website located at
            www.skybeam.io ("Site") wherein Simulmedia, Inc. ("Simulmedia",
            "Company", "us", "our", and "we") makes its Skybeam Platform (
            "Skybeam" or the “Platform”) available to you, the individual as
            identified during the registration process and the entity that you
            represent (“you”). The Company and you are collectively referred to
            as the Parties (or each individually a “Party”).
            <br />
            <br />
            Certain features of the Site or Skybeam may be subject to additional
            guidelines, terms, or rules, which will be posted on the Site in
            connection with such features or in additional written contracts and
            unless specifically stated herein the Terms of Services apply to
            both Site listed above. All such additional terms, guidelines, and
            rules are incorporated by reference into these Terms.
            <br />
            <br />
            Skybeam permits you to manage and purchase digital ad campaigns
            across several channels (e.g. websites, apps, smart TVs) and helps
            ensure ads are relevant to your customers while measuring and
            optimizing the ad campaign’s performance (“Services”).
            <br />
            <br />
            THESE TERMS OF SERVICES ("TERMS") SET FORTH THE LEGALLY BINDING
            TERMS AND CONDITIONS THAT GOVERN YOUR USE OF THE SITE AND OUR
            SERVICES. BY ACCESSING THE SITE, SKYBEAM OR USING THE SERVICES, YOU
            ARE ACCEPTING THESE TERMS (ON BEHALF OF YOURSELF AND/OR THE ENTITY
            THAT YOU REPRESENT), AND YOU REPRESENT AND WARRANT THAT YOU HAVE THE
            RIGHT, AUTHORITY, AND CAPACITY TO ENTER INTO THESE TERMS (ON BEHALF
            OF YOURSELF AND/OR THE ENTITY THAT YOU REPRESENT). YOU MAY NOT
            ACCESS THE SITE, SKYBEAM OR USE THE SERVICES OR ACCEPT THE TERMS IF
            YOU ARE NOT AT LEAST 18 YEARS OLD. IF YOU DO NOT AGREE WITH ALL OF
            THE PROVISIONS OF THESE TERMS, DO NOT ACCESS THE SITE, SKYBEAM
            AND/OR USE THE SERVICES.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Agreement</p>
          <p>
            <br />
            By registering and using Skybeam, you agree to these ToS. You also
            warrant that you are authorized to buy ads for the business(es) or
            advertiser(s) you represent, as specified during registration. If
            you are using the Platform on behalf of a third party or business,
            including as an employee of such a third party of business, or as an
            ad agency representing a third-party business, you confirm that you
            are authorized to do so and to bind that third party or business to
            these terms. In this event, Simulmedia may hold you responsible for
            violations of this ToS by that business or third party, or hold the
            third party responsible for violations of this ToS by you, and
            "you," "your" and "party" will also refer and apply to that business
            or third party.
            <br />
            <br />
            <br />
          </p>
          <p className={styles.termsTitle}>Services Overview</p>
          <br />
          <p>
            Skybeam provides you tools for planning, buying, measuring, and
            analyzing video ad inventory. The Platform offers options for
            automated campaign optimization to improve performance. You are
            solely responsible for the content, accuracy, and compliance of all
            ads and any associated links or used in your campaigns. All ads,
            links, and services or products advertised must comply with all
            Applicable Laws, as defined herein.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>License</p>
          <br />
          <p className={styles.termsSubtitle}>
            Access to the Site, Skybeam and use of the Services:
          </p>
          <p>
            Subject to these Terms, Company grants you a non-transferable,
            non-exclusive, revocable, limited license to use the Services and
            access the Site or Sybeam solely as described herein. You agree to
            access the Site or Skybeam solely to use the Services. We reserve
            the right to monitor your access and use of the Site, Skbeam and/or
            Services.
            <br />
            <br />
          </p>
          <p className={styles.termsSubtitle}>Certain Restrictions:</p>
          <p>
            The rights granted to you in these Terms are subject to the
            following restrictions: (a) you shall not license, sell, rent,
            lease, transfer, assign, distribute, host, or otherwise commercially
            exploit the Site, Skybeam or Services, whether in whole or in part,
            or any content displayed on the Site, Skybeam or Services; (b) you
            shall not modify, make derivative works of, disassemble, reverse
            compile or reverse engineer any part of the Site, Skybeam or
            Services; (c) you shall not access the Site, Skybeam or use the
            Services in order to build a similar or competitive website,
            product, or Services; and (d) except as expressly stated herein, no
            part of the Site, Skybeam or Services may be copied, reproduced,
            distributed, republished, downloaded, displayed, posted or
            transmitted in any form or by any means. Unless otherwise indicated,
            any future release, update, or other addition to functionality of
            the Site or Skybeam shall be subject to these Terms. All copyright
            and other proprietary notices on the Site or Skybeam (or on any
            content displayed on the Site, Skybeam or Services) must be retained
            on all copies thereof. Company has not agreed to and does not agree
            to treat as confidential any suggestion or idea provided by you (any
            "Feedback"), and nothing in this Agreement or in the parties’
            dealings arising out of or related to this Agreement will restrict
            Company’s right to use, profit from, disclose, publish, or otherwise
            exploit any Feedback, without compensation to you.
            <br />
            <br />
          </p>
          <p className={styles.termsSubtitle}>
            Modification or termination of account:
          </p>
          <p>
            Company reserves the right, at any time, to modify, suspend, or
            discontinue the Site, Skybeam and/or Services or your access (in
            whole or in part) with or without notice to you. You agree that the
            Company will not be liable to you or to any third party for any
            modification, suspension, or discontinuation of the Site, Skybeam or
            Services or any part thereof. IF ANY MODIFICATION IS UNACCEPTABLE TO
            YOU, YOUR ONLY RECOURSE IS TO TERMINATE YOUR USE OF THE SERVICES.
            YOUR CONTINUED USE OF THE SITE, SKYBEAM OR SERVICES FOLLOWING A
            MODIFICATION WILL CONSTITUTE BINDING ACCEPTANCE.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Account Responsibility</p>
          <br />
          <p>
            When creating an account, you represent that you are authorized to
            work on behalf of the company that you have identified. You also
            represent that you are able and authorized to work on behalf of the
            companies/services/products related to the creatives that you wish
            to display.
          </p>
          <br />
          <p>
            You are responsible for all actions and transactions that occur
            through your account, including all ad purchases, charges, and
            compliance with these ToS. Simulmedia reserves the right to share
            account-related information with any third party or business you
            identify as responsible for managing the account. If that business
            indicates that you are no longer authorized to act on its behalf,
            Simulmedia may revoke your access to the account.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Ad Review and Rejection</p>
          <br />
          <p className={styles.termsSubtitle}>Ad Review Process:</p>
          <p>
            Simulmedia and its publishers who use Simulmedia to monetize their
            advertising inventory reserve the right to review, approve, or
            reject any ad at their discretion and for any reason. Ads will
            undergo an internal review process to ensure they meet Simulmedia's
            policies and applicable legal and industry standards. Ads may be
            rejected for non-compliance with these standards or for any reason
            deemed appropriate by Simulmedia or its publishers.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Ad Rejection and Resubmission:</p>
          <p>
            If your ad is rejected, Simulmedia will provide a reason for
            rejection, and you will have the option to revise and resubmit the
            ad for further review. However, Simulmedia retains the right to
            reject any ad at any time without the obligation to provide a
            detailed explanation.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Support or Maintenance</p>
          <br />
          <p>
            You acknowledge and agree that the Company will have no obligation
            to provide you with any support or maintenance in connection with
            the Site, Skybeam or Services. The Company may, upon request,
            provide technical support in its sole discretion to enable operation
            of the Services.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Ownership</p>
          <br />
          <p>
            You acknowledge that all the intellectual property rights, including
            copyrights, patents, trademarks, and trade secrets and other
            proprietary rights, in the Site, Skybeam or Services and its content
            are owned by Company or Company’s suppliers. Neither these Terms
            (nor your access to the Site, Skybeam or Services) transfers to you
            or any third party any rights, title or interest in or to such
            intellectual property rights, except for the limited access rights
            expressly set forth in Section 3.1. Company and its affiliates, and
            suppliers reserve all rights not granted in these Terms. There are
            no implied licenses granted under these Terms.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Prohibited Content</p>
          <br />
          <p className={styles.termsSubtitle}>Illegal Products or Services:</p>
          <p>
            Ads that promote illegal products, services, or activities are
            strictly prohibited. Ads must comply with all applicable local,
            state, federal, and international laws.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Discrimination:</p>
          <p>
            Ads must not promote or enable discrimination based on race, color,
            religion, gender, age, disability, sexual orientation, or national
            origin. Discriminatory content in ad messaging or targeting
            parameters is not permitted.
          </p>
          <br />
          <p className={styles.termsSubtitle}>
            Offensive or Inappropriate Content:
          </p>
          <p>
            Ads that contain offensive, vulgar, or violent content will be
            rejected. This includes content that is hateful, sexually
            suggestive, or otherwise harmful.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Fees, Payments, and Cancellation</p>
          <br />
          <p className={styles.termsSubtitle}>Fees and Charges:</p>
          <p>
            All your purchases are final, unless media is unavailable or your
            campaign is rejected. You agree to pay all fees as outlined during
            the campaign creation process. Fees may be charged on a
            per-impression, per-click, or other performance-based pricing
            models. Payments will be processed periodically against your account
            balance, and all unpaid amounts will accrue finance charges at 1.5%
            per month or the highest rate allowed by law.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Direct Payment by Advertisers:</p>
          <p>
            If you are an ad agency acting on behalf of an advertiser, and
            Simulmedia does not receive payment from you for services rendered,
            Simulmedia reserves the right to collect payment directly from the
            advertiser. In such cases, you agree to cooperate fully with
            Simulmedia in facilitating these payments from the advertiser.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Credits:</p>
          <p>
            If any unspent balance remains at the conclusion of a campaign, the
            account will be issued a credit equal to the unspent amount. This
            credit may be applied toward future campaigns on Skybeam within 12
            months from issuance of the credit. Credits are non-refundable,
            non-transferrable and may not be redeemed for cash. Credits are
            non-transferable
          </p>
          <br />
          <p className={styles.termsSubtitle}>Dispute Resolution:</p>
          <p>
            Any disputes regarding billing must be submitted in writing within
            10 days of the billing cycle in question. Simulmedia will review
            such claims and, if validated, issue appropriate credits or
            adjustments.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Data Use and Privacy</p>
          <br />
          <p>
            By using the Platform, you grant Simulmedia and its affiliates a
            worldwide, royalty-free license to use, modify, and distribute your
            ads for the purposes of your campaign’s ad performance, fraud
            detection, testing, and optimization. Additionally, you also grant
            Simulmedia and its affiliates a worldwide, royalty-free license to
            use any data or information generated from your advertising
            campaign, including but not limited to performance metrics, site
            pixel data, audience insights, and engagement data, for the purpose
            of improving and enhancing the Site , Skybeam or Services.
          </p>
          <br />
          <p>
            Simulmedia will use industry-standard security measures to protect
            data processed through its Platform. You are responsible for
            ensuring your own compliance with privacy laws, including obtaining
            necessary consent for any data collection activities related to your
            ads. Our Privacy Policy is listed here Skybeam Privacy Policy.
          </p>
          <br />
          <p className={styles.termsSubtitle}>
            Prohibited Use of Sensitive Data for Targeting:
          </p>
          <p>
            As a Customer, you agree not to use or target ads based on any
            "Sensitive Data," which includes information related to racial or
            ethnic origin, political opinions, religious or philosophical
            beliefs, trade union membership, genetic data, biometric data used
            for identification, health data, data concerning a person’s sex life
            or sexual orientation, or any other data classified as sensitive
            under applicable privacy regulations (including GDPR and CCPA). The
            use of Sensitive Data for targeting purposes is strictly prohibited
            on the Platform.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Disclaimer of Warranties</p>
          <br />
          <p>
            Simulmedia provides the Platform "as is" without warranties of any
            kind. Simulmedia does not guarantee the availability of inventory,
            the accuracy of targeting information, or the performance of
            campaigns. You assume all risks associated with using the Platform.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Limitation of Liability</p>
          <br />
          <p>
            Neither Party shall be liable for any indirect, incidental, or
            consequential damages. Simulmedia's liability for any claim arising
            from your use of the Platform is limited to the greater of USD $100
            or five times the total fees paid in the month preceding the event
            giving rise to the claim.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Miscellaneous</p>
          <br />
          <p className={styles.termsSubtitle}>Waiver of Jury Trial.</p>
          <p>
            THE PARTIES HEREBY WAIVE THEIR CONSTITUTIONAL AND STATUTORY RIGHTS
            TO HAVE A JURY TRIAL.
          </p>
          <br />
          <p className={styles.termsSubtitle}>
            Waiver of Class or Consolidated Actions.
          </p>
          <p>
            ALL CLAIMS AND DISPUTES WITHIN THE SCOPE OF THESE TERMS LITIGATED ON
            AN INDIVIDUAL BASIS AND NOT ON A CLASS BASIS, AND CLAIMS OF MORE
            THAN ONE CUSTOMER OR USER LITIGATED JOINTLY OR CONSOLIDATED WITH
            THOSE OF ANY OTHER CUSTOMER OR USER.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Confidentiality.</p>
          <p>
            The parties agree to maintain confidentiality unless otherwise
            required by law. Further, you agree that all non-public information
            that we provide regarding the Site, Skybeam and/or Services,
            including without limitation, our pricing, marketing methodology,
            and business processes, is our proprietary confidential information.
            You agree to use this confidential information only for purposes of
            exercising your rights under these Terms. This paragraph shall not
            prevent a party from submitting to a court of law any information
            necessary to enforce this Agreement, to enforce an arbitration
            award, or to seek injunctive or equitable relief.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Severability.</p>
          <p>
            If any part or parts of these Terms are found under the law to be
            invalid or unenforceable by a court of competent jurisdiction, then
            such specific part or parts shall be of no force and effect and
            shall be severed and the remainder of the Terms shall continue in
            full force and effect.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Assignment.</p>
          <p>
            You shall not assign this Agreement or any right or interest under
            this Agreement, nor delegate any work or obligation to be performed
            under this Agreement, without prior written consent of Simulmedia.
            Any attempted assignment or delegation in contravention of this
            Section shall be void and ineffective.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Emergency Equitable Relief.</p>
          <p>
            Notwithstanding the foregoing, either party may seek emergency
            equitable relief before a state or federal court.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Courts.</p>
          <p>
            The parties hereby agree to submit to the personal jurisdiction of
            the courts located within New York County, New York, for such
            purpose.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Export.</p>
          <p>
            The Site, Skybeam or Services may be subject to U.S. export control
            laws and may be subject to export or import regulations in other
            countries. You agree not to export, reexport, or transfer, directly
            or indirectly, any U.S. technical data acquired from Company, or any
            products utilizing such data, in violation of the United States
            export laws or regulations.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Disclosures.</p>
          <p>
            Company is located at the address in Section 16. If you are a
            California resident, you may report complaints to the Complaint
            Assistance Unit of the Division of Consumer Product of the
            California Department of Consumer Affairs by contacting them in
            writing at 400 R Street, Sacramento, CA 95814, or by telephone at
            (800) 952-5210.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Electronic Communications.</p>
          <p>
            The communications between you and Company use electronic means,
            whether you use the Site, Skybeam or Services or send us emails, or
            whether Company posts notices on the Site, Skybeam or communicates
            with you via email. For contractual purposes, you (a) consent to
            receive communications from Company in an electronic form; and (b)
            agree that all terms and conditions, agreements, notices,
            disclosures, and other communications that Company provides to you
            electronically satisfy any legal requirement that such
            communications would satisfy if it be in a hard copy writing. The
            foregoing does not affect your non-waivable rights.
          </p>
          <br />
          <p className={styles.termsSubtitle}>Force Majeure.</p>
          <p>
            As a supplementary part to Services disclaimer stated above, the
            Company gives no operational guarantees in case of delay or losses
            caused by force-majeure.
          </p>
          <br />
          <p>
            We will not be liable for delays, failure in performance or
            interruption of the Site,Skybeam or Services which result directly
            or indirectly from any cause or condition beyond our reasonable
            control, including any delay or failure due to any act of God, act
            of civil or military authorities, acts of terrorists, civil
            disturbance, war, strike or other labor dispute, fire, interruption
            in telecommunications or Internet Services or network provider
            Services, failure of equipment and / or software, pandemic or
            national or worldwide health emergency, other catastrophes or any
            other occurrence which is beyond our reasonable control and will not
            affect the validity and enforceability of any remaining provisions.
          </p>
          <br />
          <p>
            We will not be liable for delays, failure in performance or
            interruption of the Websites which result directly or indirectly
            from any cause or condition beyond our reasonable control, including
            any delay or failure due to any act of God, act of civil or military
            authorities, acts of terrorists, civil disturbance, war, strike or
            other labor dispute, fire, interruption in telecommunications or
            Internet Services or network provider Services, failure of equipment
            and / or software, pandemic or national or worldwide health
            emergency, other catastrophes or any other occurrence which is
            beyond our reasonable control and will not affect the validity and
            enforceability of any remaining provisions.
          </p>
          <br />
          <br />
          <p>
            These ToS constitute the entire agreement between the Parties with
            respect to the use of Simulmedia’s Platform. Simulmedia reserves the
            right to modify these terms at any time, with notice provided
            through the Platform or email. Continued use of the Platform
            following any modifications indicates acceptance of the updated
            terms.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Copyright/Trademark Information</p>
          <br />
          <p>
            All trademarks, logos and Services marks (Marks) displayed on the
            Site and Skybeam are our property or the property of other third
            parties. You are not permitted to use these Marks without our prior
            written consent of such third-party which may own the Marks.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Changes</p>
          <br />
          <p>
            These Terms are subject to occasional revision, and if we make any
            substantial changes, we may notify you by prominently posting notice
            of the changes on our Site. Any changes to these Terms will be
            effective immediately upon notice. Continued use of our Site,
            Skybeam or Services following notice of such changes shall indicate
            your acknowledgment of such changes and agreement to be bound by the
            terms and conditions of such changes.
          </p>
          <br />
          <br />
          <p className={styles.termsTitle}>Contact Information</p>
          <br />
          <p>Address: 401 Park Avenue South,</p>
          <p>11th Floor</p>
          <p>New York, New York 10016</p>
          <p className="flex items-center gap-x-2">
            Email: <SupportEmailSVG className="mt-[3px]" />
          </p>
          <br />
          <br />
          <p className={styles.termsSubtitle}>
            By registering for and using the Platform or Skybeam or Site, you
            agree to these ToS
          </p>
          <br />
        </div>
      </div>
    </div>
  );
}

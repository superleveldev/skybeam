import Link from 'next/link';
import { Accordion } from '../../../../../app/_components/faq';

const data = [
  {
    title: "Is there a sign-up fee to access Skybeam's TV Ads Manager?",
    content:
      'No, our platform is free to access and you can start creating your first TV campaign within minutes of signing up.',
    isOpenByDefault: true,
  },
  {
    title: 'What payment methods does Skybeam accept?',
    content: (
      <span>
        Skybeam accepts both credit card and Automated Clearing House (ACH)
        payments for your campaigns. To learn more about campaign budgeting and
        optimization, visit our{' '}
        <Link className="underline" href="https://help.skybeam.io/en/">
          Help Center
        </Link>
      </span>
    ),
  },
  {
    title: "What's the minimum campaign spend on Skybeam?",
    content:
      'To ensure optimal campaign performance, we recommend a minimum daily budget of $50 per day or a minimum lifetime budget of $500 for the entire campaign duration.',
  },
  {
    title: 'How can I distribute my budget across targeting groups?',
    content:
      'When running multiple targeting groups, you can set an overall campaign budget and then distribute specific amounts to each targeting group within your campaign. This gives you complete control over your campaign spending strategy.',
  },
  {
    title: 'What happens if my payment fails?',
    content:
      'If a payment fails, your active campaigns will be temporarily paused while our system automatically attempts to process the payment again. You will be notified when the payment fails so you can add another payment method to your account. Your campaigns will resume automatically once the payment is successful.',
  },
];

export const FAQ = () => {
  return (
    <div className="flex justify-center py-14 px-4">
      <div className="w-full max-w-full flex flex-col items-center gap-y-10 tablet:gap-y-16 tablet:max-w-[520px] laptop:max-w-[880px] desktop:max-w-[71rem]">
        <div className="flex flex-col gap-y-5 items-center text-center tablet:max-w-[456px] laptop:max-w-[768px]">
          <h3
            data-test-faq-section-title
            className="w-full max-w-full text-[2rem] leading-none text-[#0A0A0A] tablet:text-[3.125rem] desktop:text-6xl"
          >
            Frequently Asked Questions
          </h3>
          <p className="text-base leading-normal text-[#737C8B] tablet:text-[20px]">
            Your guide to pricing and billing
          </p>
        </div>
        <div className="max-w-[48rem] w-full">
          <Accordion
            data-test-faq-dropdown-item
            data={data}
            titleStyles="text-[#0A0A0A]"
            contentStyles="text-[#737C8B]"
          />
        </div>
      </div>
    </div>
  );
};

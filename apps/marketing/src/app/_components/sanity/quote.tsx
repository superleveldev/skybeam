import React from 'react';
import { QuoteProps } from './types';

export default function Quote({ data }: { data: QuoteProps }) {
  return (
    <blockquote className="mt-6 mb-2 mx-6 tablet:mb-[-8px] laptop:mb-[-40px] desktop:mx-auto desktop:px-[152px] desktop:max-w-[1440px]">
      <div className="bg-[#F4F6FF] py-6 rounded-2xl tablet:p-12 laptop:px-[4.5rem] laptop:py-16 desktop:px-48">
        <div className="mx-auto flex w-full items-start flex-col tablet:gap-y-6 laptop:flex-row">
          {/* Align items to the start */}
          <div className="mr-4 pl-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 46 35"
              fill="none"
              className="w-[33px] tablet:w-[45px] desktop:w-[55px]"
            >
              <path
                d="M10.2 0H19.482L11.424 16.422H17.748V34.17H0V18.666L10.2 0ZM35.802 0H45.084L37.026 16.422H43.35V34.17H25.602V18.666L35.802 0Z"
                fill="#00152A"
              />
            </svg>
          </div>
          <div className="flex px-6 flex-col">
            <p className="mb-4 text-lg italic text-[1.5] text-[#00152A] leading-[1.5]">
              {data.quoteText}
            </p>
            <p className="font-semibold text-[#00152A] text-[1.125rem] leading-[1.5]">
              {data.author}
            </p>
          </div>
        </div>
      </div>
    </blockquote>
  );
}

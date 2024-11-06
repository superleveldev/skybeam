import RangeNumber from './range-number';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@limelight/shared-ui-kit/ui/tooltip';
import RangeTitle from './range-title';

type Range = {
  lower_end: number;
  higher_end: number;
};
type ForecastResultsProps = {
  estimatedAudienceSize?: Range;
  forecastedImpressions?: Range;
  websiteVisits?: Range;
  incrementalClicks?: {
    search: Range;
    social: Range;
  };
};

export default function ForecastResults({
  estimatedAudienceSize,
  forecastedImpressions,
  websiteVisits,
  incrementalClicks,
}: ForecastResultsProps) {
  return (
    <div className="bg-[#FAFAF5] rounded-2xl px-4 py-8 grid gap-4 grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-3">
      <div className="tablet:col-span-1 flex flex-col items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <RangeTitle>Estimated Audience Size</RangeTitle>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              className="bg-black text-white p-3 rounded-lg shadow-md max-w-xs text-sm"
            >
              <p>
                The estimated number of unique viewers who could potentially see
                your ad at least once during the campaign.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <RangeNumber
          from={estimatedAudienceSize?.lower_end ?? 0}
          to={estimatedAudienceSize?.higher_end ?? 0}
        />
      </div>

      <div className="tablet:col-span-1 flex flex-col items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <RangeTitle>Forecasted Impressions</RangeTitle>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              className="bg-black text-white p-3 rounded-lg shadow-md max-w-xs text-sm"
            >
              <p>
                The total number of times your ad is expected to be displayed in
                a month, including repeat views by the same viewers.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <RangeNumber
          from={forecastedImpressions?.lower_end ?? 0}
          to={forecastedImpressions?.higher_end ?? 0}
        />
      </div>

      <div className="tablet:col-span-2 laptop:col-span-1 flex flex-col items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger type="button">
              <RangeTitle>Website Visits</RangeTitle>
            </TooltipTrigger>
            <TooltipContent
              align="start"
              className="bg-black text-white p-3 rounded-lg shadow-md max-w-xs text-sm"
            >
              <p>
                The estimated number of users who will visit your website after
                being exposed to the CTV ad campaign.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <RangeNumber
          from={websiteVisits?.lower_end ?? 0}
          to={websiteVisits?.higher_end ?? 0}
        />
      </div>

      <div className="flex flex-col tablet:flex-row tablet:col-span-2 laptop:col-span-3 justify-center gap-4 laptop:gap-[60px]">
        <div className="flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button">
                <RangeTitle>Incremental Clicks (Search)</RangeTitle>
              </TooltipTrigger>
              <TooltipContent
                align="start"
                className="bg-black text-white p-3 rounded-lg shadow-md max-w-xs text-sm"
              >
                <p>
                  The estimated additional number of clicks on your paid search
                  ads resulting from the halo effect of your CTV ad campaign.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <RangeNumber
            from={incrementalClicks?.search?.lower_end ?? 0}
            to={incrementalClicks?.search?.higher_end ?? 0}
          />
        </div>

        <div className="flex flex-col items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button">
                <RangeTitle>Incremental Clicks (Social)</RangeTitle>
              </TooltipTrigger>
              <TooltipContent
                align="start"
                className="bg-black text-white p-3 rounded-lg shadow-md max-w-xs text-sm"
              >
                <p>
                  The projected increase in clicks on your paid social media ads
                  attributed to the halo effect of your CTV ad campaign.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <RangeNumber
            from={incrementalClicks?.social?.lower_end ?? 0}
            to={incrementalClicks?.social?.higher_end ?? 0}
          />
        </div>
      </div>
    </div>
  );
}

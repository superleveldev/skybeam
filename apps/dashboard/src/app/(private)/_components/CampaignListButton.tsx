'use client';

import { Button } from '@limelight/shared-ui-kit/ui/button';
import { cn } from '@limelight/shared-utils/index';
import { goToCampaignList } from '../../../server/actions';
import { MouseEvent, ComponentProps } from 'react';

export default function CampaignListButton(
  props: ComponentProps<typeof Button>,
) {
  const { children, className, onClick: _onClick, ...rest } = props;
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    _onClick?.(e);
    goToCampaignList();
  };
  return (
    <Button
      onClick={onClick}
      className={cn(className, 'hover:no-underline')}
      type="button"
      variant="link"
      {...rest}
    >
      {children}
    </Button>
  );
}

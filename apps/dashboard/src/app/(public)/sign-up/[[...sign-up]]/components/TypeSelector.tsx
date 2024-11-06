'use client';

import { ClerkLoaded } from '@clerk/nextjs';
import {
  RadioGroup,
  RadioGroupItem,
} from '@limelight/shared-ui-kit/ui/radio-group';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function TypeSelector({ value }: { value: string }) {
  const router = useRouter();
  const path = usePathname();
  const [top, setTop] = useState(-100);
  const [left, setLeft] = useState(-100);
  const typeRef = useRef<HTMLDivElement>(null);
  const [placed, setPlaced] = useState(false);

  function getHeight() {
    if (typeof document !== 'undefined') {
      const nameInput = document.querySelector('.cl-formFieldRow__name');
      const nameInputBottom = nameInput?.getBoundingClientRect().bottom;
      const nameInputLeft = document
        .querySelector('.cl-card')
        ?.getBoundingClientRect().left;
      setTop((prev) => (nameInputBottom ? nameInputBottom + 20 : prev));
      setLeft((prev) => (nameInputLeft ? nameInputLeft + 20 : prev));
      setPlaced(true);
    }
  }

  useEffect(() => {
    window.addEventListener('resize', getHeight);
    return () => {
      window.removeEventListener('resize', getHeight);
    };
  }, []);

  useEffect(() => {
    setTimeout(getHeight, 200);
  }, [typeRef.current, path]);

  if (path !== '/sign-up') {
    return null;
  }

  const handleTypeChange = (type: string) => {
    router.push(`/sign-up?type=${type}`);
  };

  return (
    <ClerkLoaded>
      <div
        className={`flex gap-2 flex-col absolute w-full items-center`}
        style={{
          top: `${top}px`,
          left: `${left + 20}px`,
          width: `calc(100% - ${left}px - 20px)`,
        }}
        ref={typeRef}
      >
        <div className="w-full flex flex-col gap-2">
          <label htmlFor="type" className="text-sm font-medium">
            Type
          </label>
          <RadioGroup name="type" onValueChange={handleTypeChange}>
            <div className="flex gap-2 items-center">
              <RadioGroupItem value="agency" checked={value === 'agency'}>
                Agency
              </RadioGroupItem>
              <label className="text-sm">Agency</label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem
                value="advertiser"
                checked={value === 'advertiser'}
              >
                Agency
              </RadioGroupItem>
              <label className="text-sm">Advertiser</label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </ClerkLoaded>
  );
}

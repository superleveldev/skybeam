'use client';

import { Children, HTMLAttributes } from 'react';
import { useState } from 'react';

interface ShowAllButtonProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function ShowAllButton({ children }: ShowAllButtonProps) {
  const [showAll, setShowAll] = useState(false);
  const childrenArray = Children.toArray(children);
  return (
    <>
      <span>{showAll ? children : childrenArray.slice(0, 4)}</span>
      {childrenArray.length > 4 ? (
        <span
          className="ml-1 text-primary text-sm"
          onClick={() => setShowAll(!showAll)}
          role="button"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </span>
      ) : null}
    </>
  );
}

'use client';
import React, { ReactNode, useState } from 'react';
import { CirclePlus, CircleMinus } from 'lucide-react';

import { cn } from '@limelight/shared-utils/classnames/cn';

//TODO remove css modules
import styles from './faq.module.css';

interface AccordionItemsProps {
  title: string;
  content: ReactNode;
  titleStyles?: string;
  contentStyles?: string;
  isOpenByDefault?: boolean;
}

interface AccordionProps {
  data: AccordionItemsProps[];
  titleStyles?: string;
  contentStyles?: string;
}

const AccordionItem: React.FC<AccordionItemsProps> = (props) => {
  const {
    title,
    content,
    isOpenByDefault = false,
    titleStyles,
    contentStyles,
  } = props;

  const [isOpen, setIsOpen] = useState(isOpenByDefault);

  const toggleItem = () => setIsOpen((prevState) => !prevState);

  return (
    <div className="flex flex-col gap-y-2">
      <div
        data-test-faq-dropdown-item
        className="flex justify-between"
        onClick={toggleItem}
      >
        <p className={cn(styles.faqAccordionTitle, 'text-white', titleStyles)}>
          {title}
        </p>
        <div className="w-[24px] h-[24px]">
          {isOpen ? (
            <CircleMinus className={styles.faqAccordionIcon} />
          ) : (
            <CirclePlus className={styles.faqAccordionIcon} />
          )}
        </div>
      </div>
      <div
        data-test-faq-dropdown-text
        className={cn(
          styles.faqAccordionContent,
          'text-[#eaecf0]',
          { [styles.open]: isOpen },
          contentStyles,
        )}
      >
        {content}
      </div>
    </div>
  );
};

export const Accordion: React.FC<AccordionProps> = (props) => {
  const { data, titleStyles, contentStyles } = props;
  return (
    <div className="flex flex-col gap-y-8">
      {data.map((item, index) => (
        <AccordionItem
          key={index}
          titleStyles={titleStyles}
          contentStyles={contentStyles}
          title={item.title}
          content={item.content}
          isOpenByDefault={item.isOpenByDefault}
        />
      ))}
    </div>
  );
};

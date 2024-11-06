/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  import { FunctionComponent, SVGProps } from 'react';

  export const ReactComponent: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  // eslint-disable-next-line import/no-default-export
  export default src;
}

type IconComponent = ForwardRefExoticComponent<
  Omit<
    SVGProps<SVGSVGElement> & {
      title?: string;
    },
    'ref'
  > &
    RefAttributes<SVGSVGElement>
>;

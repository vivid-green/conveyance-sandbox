import * as React from 'react';

declare class MDBAutocompleteV5 extends React.Component<
  {
    data?: string[] | object;
    dataKey?: boolean;
    disabled?: boolean;
    className?: string;
    clear?: boolean;
    clearClass?: string;
    labelClass?: string;
    icon?: string;
    iconBrand?: boolean;
    iconLight?: boolean;
    iconRegular?: boolean;
    iconSize?: 'lg' | '1x' | '2x' | '3x' | '4x' | '5x' | '6x' | '7x' | '8x' | '9x' | '10x';
    iconClassName?: string;
    placeholder?: string;
    valueDefault?: string;
    getValue?: (value: string) => void;
    [rest: string]: any;
  },
  any
> {}

export default MDBAutocompleteV5;

import * as React from 'react';

declare const MDBSelectOptionV5: React.FunctionComponent<{
  checked?: boolean;
  disabled?: boolean;
  focusShadow?: string;
  focusBackgroundColor?: string;
  icon?: string;
  isFocused?: boolean;
  multiple?: boolean;
  selectAllClassName?: string;
  separator?: boolean;
  text?: object | string;
  value?: string;
  selectOption?: () => void;
  [rest: string]: any;
}>;

export default MDBSelectOptionV5;

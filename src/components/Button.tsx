import React from 'react';
import { Button as RadixButton, ButtonProps as RadixButtonProps } from '@radix-ui/themes';

export interface ButtonProps extends RadixButtonProps {
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <RadixButton {...props}>
      {children}
    </RadixButton>
  );
};

export default Button;
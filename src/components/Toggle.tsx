import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { addButtonColour } from './Button';

interface ToggleProps extends ButtonHTMLAttributes<any> {
  pressed: boolean;
  className?: string;
  colour?: string;
  children?: ReactNode | undefined;

  onClick: () => void;
}

function Toggle({ pressed, className, colour, children, onClick, ...props }: ToggleProps) {
  let classes = addButtonColour(colour, className);

  if (pressed) {
    classes += ' pressed';
  }

  return (
    <button {...props} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export default Toggle;

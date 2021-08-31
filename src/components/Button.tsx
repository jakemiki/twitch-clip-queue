import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<any> {
  className?: string;
  colour?: string;
  children?: ReactNode | undefined;

  onClick: () => void;
}

export const addButtonColour = (colour: string | undefined, classes: string | undefined) => {
  classes = (classes || '') + ' ';

  switch (colour) {
    case 'red':
      return classes + 'bg-red-500 border-red-700 hover:bg-red-400 hover:border-red-500';
    case 'green':
      return classes + 'bg-green-500 border-green-700 hover:bg-green-400 hover:border-green-500';
    case 'yellow':
      return classes + 'bg-yellow-500 border-yellow-700 hover:bg-yellow-400 hover:border-yellow-500';
  }

  return classes + 'bg-purple-500 border-purple-700 hover:bg-purple-400 hover:border-purple-500';
};

function Button({ className, colour, children, onClick, ...props }: ButtonProps) {
  let classes = addButtonColour(colour, className);

  return (
    <button {...props} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;

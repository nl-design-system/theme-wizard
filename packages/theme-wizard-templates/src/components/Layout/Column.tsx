import clsx from 'clsx';
import React, { type HTMLAttributes, type PropsWithChildren } from 'react';
import './styles.css';

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  cols?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const Column = ({ children, className, cols = 12, ...rest }: PropsWithChildren<ColumnProps>) => {
  const clampedCols = clamp(cols, 1, 12);

  return (
    <div className={clsx('clippy-col', `clippy-col-${clampedCols}`, className)} {...rest}>
      {children}
    </div>
  );
};

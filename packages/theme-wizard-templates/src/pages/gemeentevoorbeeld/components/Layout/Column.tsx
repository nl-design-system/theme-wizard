import React, { type FC, type HTMLAttributes, type PropsWithChildren } from 'react';
import './styles.css';

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  cols?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const Column: FC<PropsWithChildren<ColumnProps>> = ({ children, className, cols = 12, style, ...rest }) => {
  const clampedCols = clamp(cols, 1, 12);
  const spanClass = `clippy-col-${clampedCols}`;
  const classes = ['clippy-col', spanClass, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} {...rest}>
      {children}
    </div>
  );
};

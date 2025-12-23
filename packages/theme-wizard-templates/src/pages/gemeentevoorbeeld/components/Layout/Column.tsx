import React, { type FC, type HTMLAttributes, type PropsWithChildren } from 'react';
import './styles.css';

export interface ColumnProps extends HTMLAttributes<HTMLDivElement> {
  cols?: number;
}

export const Column: FC<PropsWithChildren<ColumnProps>> = ({ children, className, cols = 12, style, ...rest }) => {
  const safeCols = Math.min(12, Math.max(1, cols));
  const spanClass = `col-${safeCols}`;
  const classes = ['col', spanClass, className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={style} {...rest}>
      {children}
    </div>
  );
};

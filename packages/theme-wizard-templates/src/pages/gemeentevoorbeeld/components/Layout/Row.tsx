import clsx from 'clsx';
import React, { type FC, type CSSProperties, type HTMLAttributes, type PropsWithChildren } from 'react';
import './styles.css';

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  align?: CSSProperties['alignItems'];
  columnGap?: CSSProperties['columnGap'];
  rowGap?: CSSProperties['rowGap'];
  gap?: CSSProperties['columnGap'];
  justify?: CSSProperties['justifyContent'];
  fullHeight?: boolean;
  reverseOnSmallScreen?: boolean;
}

export const Row: FC<PropsWithChildren<RowProps>> = ({
  align,
  children,
  className,
  columnGap,
  fullHeight,
  gap,
  justify,
  reverseOnSmallScreen,
  rowGap,
  style,
  ...rest
}) => {
  const classes = clsx(
    className,
    'clippy-row',
    {
      fullHeight: 'clippy-row--full-height',
      reverseOnSmallScreen: 'clippy-row--reverse-small',
    },
  );

  const rowStyle: CSSProperties = {
    alignItems: align,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: justify,
    ...style,
  };

  const effectiveColumnGap = columnGap ?? gap;

  if (effectiveColumnGap) {
    (rowStyle as CSSProperties & { '--clippy-row-column-gap'?: CSSProperties['columnGap'] })[
      '--clippy-row-column-gap'
    ] = effectiveColumnGap;
  }

  if (rowGap) {
    (rowStyle as CSSProperties & { '--clippy-row-row-gap'?: CSSProperties['rowGap'] })['--clippy-row-row-gap'] = rowGap;
  }

  return (
    <div className={classes} style={rowStyle} {...rest}>
      {children}
    </div>
  );
};

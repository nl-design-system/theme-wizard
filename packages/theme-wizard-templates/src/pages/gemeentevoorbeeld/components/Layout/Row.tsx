import type { CSSProperties, FC, HTMLAttributes, PropsWithChildren } from 'react';
import './styles.css';

export interface RowProps extends HTMLAttributes<HTMLDivElement> {
  align?: CSSProperties['alignItems'];
  columnGap?: CSSProperties['columnGap'];
  rowGap?: CSSProperties['rowGap'];
  gap?: CSSProperties['columnGap'];
  justify?: CSSProperties['justifyContent'];
  fullHeight?: boolean;
}

export const Row: FC<PropsWithChildren<RowProps>> = ({
  align,
  children,
  className,
  columnGap,
  fullHeight,
  gap,
  justify,
  rowGap,
  style,
  ...rest
}) => {
  const classes = ['row', fullHeight && 'row--full-height', className].filter(Boolean).join(' ');

  const rowStyle: CSSProperties = {
    alignItems: align,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: justify,
    ...style,
  };

  const effectiveColumnGap = columnGap ?? gap;

  if (effectiveColumnGap) {
    (rowStyle as CSSProperties & { '--row-column-gap'?: CSSProperties['columnGap'] })['--row-column-gap'] =
      effectiveColumnGap;
  }

  if (rowGap) {
    (rowStyle as CSSProperties & { '--row-row-gap'?: CSSProperties['rowGap'] })['--row-row-gap'] = rowGap;
  }

  return (
    <div className={classes} style={rowStyle} {...rest}>
      {children}
    </div>
  );
};

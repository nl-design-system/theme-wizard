import {
  Heading,
  headingLevels,
  type HeadingLevel,
  type HeadingProps,
} from '@nl-design-system-candidate/heading-react';
import { Fragment } from 'react';

const sampleText = 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.';

export const HeadingAllLevels = ({ children, ...props }: Omit<HeadingProps, 'level'>) => (
  <div
    style={{
      alignItems: 'baseline',
      display: 'grid',
      gap: '0.5rem 1rem',
      gridTemplateColumns: 'max-content 1fr',
    }}
  >
    {headingLevels.map((level: HeadingLevel) => (
      <Fragment key={level}>
        <strong style={{ fontFamily: 'monospace', opacity: 0.5 }}>h{level}</strong>
        <Heading {...props} level={level}>
          {children ?? sampleText}
        </Heading>
      </Fragment>
    ))}
  </div>
);

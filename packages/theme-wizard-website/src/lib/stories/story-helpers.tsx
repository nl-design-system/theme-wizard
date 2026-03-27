import { type ReactNode } from 'react';

export type WizardStep = {
  order: number;
  stepTitle: string;
};

export const storySampleText = 'Op brute wĳze ving de schooljuf de quasi-kalme lynx.';


export const WizardPreviewSection = ({ children, label }: { children: ReactNode; label: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <strong style={{ fontSize: '0.875rem' }}>{label}</strong>
    {children}
  </div>
);

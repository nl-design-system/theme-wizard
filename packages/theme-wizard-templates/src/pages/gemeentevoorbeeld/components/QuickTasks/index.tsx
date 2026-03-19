import '@amsterdam/design-system-css/dist/visually-hidden/visually-hidden.css';
import { Link } from '@nl-design-system-candidate/link-react';
import { Icon } from '@utrecht/component-library-react';
import React, { type ReactElement } from 'react';
import type { QuickTask } from './types';
import { Column, Row } from '../Layout';

export interface QuickTasksProps {
  tasks: QuickTask[];
}

type IconName = 'afval-scheiden' | 'melding-klacht' | 'nummerbord' | 'paspoort' | 'verhuizen' | 'werken';

const ICON_COMPONENTS: Record<IconName, ReactElement> = {
  'afval-scheiden': React.createElement('utrecht-icon-afval-scheiden', { suppressHydrationWarning: true }),
  'melding-klacht': React.createElement('utrecht-icon-melding-klacht', { suppressHydrationWarning: true }),
  nummerbord: React.createElement('utrecht-icon-nummerbord', { suppressHydrationWarning: true }),
  paspoort: React.createElement('utrecht-icon-paspoort', { suppressHydrationWarning: true }),
  verhuizen: React.createElement('utrecht-icon-verhuizen', { suppressHydrationWarning: true }),
  werken: React.createElement('utrecht-icon-werken', { suppressHydrationWarning: true }),
};

const renderIcon = (iconName: string): JSX.Element | null => {
  const icon = ICON_COMPONENTS[iconName as IconName];
  return icon ?? null;
};

const QuickTasks = ({ tasks }: QuickTasksProps) => (
  <nav className="clippy-top-tasks">
    <Row columnGap="var(--basis-space-column-xl)" fullHeight justify="flex-start" rowGap="var(--basis-space-row-xl)">
      {tasks.map((task) => (
        <Column key={`${task.href}-${task.title}`} cols={4}>
          <Link
            href={task.href}
            className="utrecht-button utrecht-button--subtle utrecht-accordion__button clippy-voorbeeld__link"
          >
            <Icon>{renderIcon(task.icon)}</Icon>

            <span>{task.title}</span>
          </Link>
        </Column>
      ))}
    </Row>
  </nav>
);

export default QuickTasks;

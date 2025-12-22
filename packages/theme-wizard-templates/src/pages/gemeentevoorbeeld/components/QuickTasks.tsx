import type { FC, ReactElement } from 'react';
import { Card } from '@amsterdam/design-system-react';
import { Icon } from '@utrecht/component-library-react';
import { Heading4 } from '@utrecht/component-library-react/dist/css-module';
import {
  UtrechtIconPaspoort,
  UtrechtIconMeldingKlacht,
  UtrechtIconVerhuizen,
  UtrechtIconWerken,
  UtrechtIconNummerbord,
  UtrechtIconAfvalScheiden,
} from '@utrecht/web-component-library-react';
import type { QuickTask } from '../types';
import { Column, Row } from './Layout';

export interface QuickTasksProps {
  tasks: QuickTask[];
}

type IconName = 'afval-scheiden' | 'melding-klacht' | 'nummerbord' | 'paspoort' | 'verhuizen' | 'werken';

const ICON_COMPONENTS: Record<IconName, ReactElement> = {
  'afval-scheiden': <UtrechtIconAfvalScheiden />,
  'melding-klacht': <UtrechtIconMeldingKlacht />,
  nummerbord: <UtrechtIconNummerbord />,
  paspoort: <UtrechtIconPaspoort />,
  verhuizen: <UtrechtIconVerhuizen />,
  werken: <UtrechtIconWerken />,
};

const renderIcon = (iconName: string): JSX.Element | null => {
  const icon = ICON_COMPONENTS[iconName as IconName];
  return icon ?? null;
};

const QuickTasks: FC<QuickTasksProps> = ({ tasks }) => (
  <nav aria-label="Snelle taken">
    <Row columnGap="var(--basis-space-column-xl)" fullHeight justify="flex-start" rowGap="var(--basis-space-row-md)">
      {tasks.map((task) => (
        <Column key={`${task.href}-${task.title}`} cols={4}>
          <Card.Link className="voorbeeld__link voorbeeld__link--task" href={task.href}>
            <Icon>{renderIcon(task.icon)}</Icon>

            <Heading4>{task.title}</Heading4>
          </Card.Link>
        </Column>
      ))}
    </Row>
  </nav>
);

export default QuickTasks;

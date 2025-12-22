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
import { Column, Row } from './Layout';

interface QuickTask {
  href: string;
  title: string;
  icon: string;
}

interface QuickTasksProps {
  tasks: QuickTask[];
}

const ICON_COMPONENTS: Record<string, ReactElement> = {
  'afval-scheiden': <UtrechtIconAfvalScheiden />,
  'melding-klacht': <UtrechtIconMeldingKlacht />,
  nummerbord: <UtrechtIconNummerbord />,
  paspoort: <UtrechtIconPaspoort />,
  verhuizen: <UtrechtIconVerhuizen />,
  werken: <UtrechtIconWerken />,
};

const renderIcon = (iconName: string): ReactElement | null => ICON_COMPONENTS[iconName] ?? null;

const QuickTasks: FC<QuickTasksProps> = ({ tasks }) => (
  <nav aria-label="Snelle taken">
    <Row columnGap="var(--basis-space-column-xl)" rowGap="var(--basis-space-row-md)" justify="flex-start" fullHeight>
      {tasks.map((task, index) => (
        <Column key={`${task.href}-${task.title}-${index}`} cols={4}>
          <Card.Link href={task.href} className="voorbeeld__link voorbeeld__link--task">
            <Icon>{renderIcon(task.icon)}</Icon>
            <Heading4>{task.title}</Heading4>
          </Card.Link>
        </Column>
      ))}
    </Row>
  </nav>
);

export default QuickTasks;

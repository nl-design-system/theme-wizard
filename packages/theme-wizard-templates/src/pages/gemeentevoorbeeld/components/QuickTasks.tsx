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
  <nav className="voorbeeld-toptask__nav" aria-label="Snelle taken">
    {tasks.map((task, index) => (
      <Card.Link key={`${task.href}-${task.title}-${index}`} href={task.href} className="voorbeeld-toptask__link">
        <Icon>{renderIcon(task.icon)}</Icon>
        <span className="voorbeeld-toptask__title">
          <Heading4>{task.title}</Heading4>
        </span>
      </Card.Link>
    ))}
  </nav>
);

export default QuickTasks;

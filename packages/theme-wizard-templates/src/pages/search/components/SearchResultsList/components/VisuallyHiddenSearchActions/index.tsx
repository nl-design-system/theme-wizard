import { Link } from '@nl-design-system-candidate/link-react';
import './styles.css';

export const VisuallyHiddenSearchActions = () => (
  <ul aria-label="Zoekacties" className='clippy--search-actions'>
    <li>
      <Link href="#search-query">Opnieuw zoeken</Link>
    </li>

    <li>
      <Link href="#filters">Filters aanpassen</Link>
    </li>

    <li>
      <Link href="/sitemap.xml">Naar de sitemap</Link>
    </li>
  </ul>
)
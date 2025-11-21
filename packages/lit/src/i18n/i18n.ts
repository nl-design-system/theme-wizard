import rosetta from 'rosetta';
import { nl, en } from './messages';

const i18n = rosetta({ nl, en });
i18n.locale('nl');
i18n.set('nl', nl);
i18n.set('en', en);

export default i18n;

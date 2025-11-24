import rosetta from 'rosetta';
import { en, nl } from './messages';

const i18n = rosetta({ en, nl });
i18n.locale('nl');
i18n.set('nl', nl);
i18n.set('en', en);

export default i18n;

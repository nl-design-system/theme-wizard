type PresetOption = {
  description?: string;
  name: string;
  previewStyle?: string;
  tokens: unknown;
};

type PresetGroup = {
  description?: string;
  id: string;
  name: string;
  options: PresetOption[];
  type: string;
};

type PresetStep = {
  id: string;
  title: string;
  intro?: string;
  groups: PresetGroup[];
};

type OverviewComponent = {
  id: string;
  title: string;
  description: string;
};

type OverviewCategory = {
  key: string;
  label: string;
  components: OverviewComponent[];
};

type DrawerData = {
  presetStepsByComponent: Record<string, PresetStep[]>;
  overview: {
    supportedIds: string[];
    categories: OverviewCategory[];
  };
};

type TemplatePresetRequestDetail = {
  componentId: string;
  lead?: boolean;
};

type DrawerView = 'steps' | 'presets' | 'overview';

type DrawerState = {
  view: DrawerView;
  componentId: string;
  stepId: string | null;
};

const dataElementId = 'template-preset-groups';
const drawerId = 'template-preset-drawer';
const drawerOpenClass = 'template-preset-drawer-open';

const readDrawerData = (): DrawerData => {
  const dataElement = document.getElementById(dataElementId);
  const empty: DrawerData = {
    overview: { categories: [], supportedIds: [] },
    presetStepsByComponent: {},
  };
  if (!dataElement?.textContent) return empty;

  try {
    const parsed = JSON.parse(dataElement.textContent);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : empty;
  } catch {
    return empty;
  }
};

const componentLabel = (componentId: string, data: DrawerData) => {
  for (const category of data.overview.categories) {
    const match = category.components.find((c) => c.id === componentId);
    if (match) return match.title;
  }
  return componentId.charAt(0).toUpperCase() + componentId.slice(1);
};

const findStep = (state: DrawerState, data: DrawerData): PresetStep | null => {
  const steps = data.presetStepsByComponent[state.componentId] ?? [];
  return steps.find((step) => step.id === state.stepId) ?? null;
};

const headerTitle = (state: DrawerState, data: DrawerData) => {
  if (state.view === 'overview') return 'Componenten';
  if (state.view === 'presets') {
    const step = findStep(state, data);
    if (step) return step.title;
  }
  return `${componentLabel(state.componentId, data)} aanpassen`;
};

// ---------- Step cards (component-overview view) ----------

const createStepCard = (componentId: string, step: PresetStep) => {
  const item = document.createElement('li');

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'wizard-component-card';

  const illustration = document.createElement('img');
  illustration.className = 'wizard-component-card__illustration';
  illustration.src = `/svg/componenten_overzicht_${componentId}.svg`;
  illustration.alt = '';
  illustration.width = 240;
  illustration.height = 160;
  trigger.append(illustration);

  const titleEl = document.createElement('span');
  titleEl.className = 'wizard-component-card__title';
  titleEl.textContent = step.title;
  trigger.append(titleEl);

  if (step.intro) {
    const descEl = document.createElement('span');
    descEl.className = 'wizard-component-card__description';
    descEl.textContent = step.intro;
    trigger.append(descEl);
  }

  trigger.addEventListener('click', () => {
    switchToView({ componentId, stepId: step.id, view: 'presets' });
  });

  item.append(trigger);
  return item;
};

const renderStepsBody = (state: DrawerState, data: DrawerData): HTMLElement => {
  const body = document.createElement('div');
  body.className = 'template-preset-drawer__body template-preset-drawer__body--steps';

  const steps = data.presetStepsByComponent[state.componentId] ?? [];

  if (steps.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'nl-paragraph template-preset-drawer__empty';
    empty.textContent = 'Voor dit onderdeel zijn nog geen presets beschikbaar.';
    body.append(empty);
  } else {
    const list = document.createElement('ul');
    list.className = 'wizard-component-list';
    list.setAttribute('aria-label', `${componentLabel(state.componentId, data)} presets`);
    steps.forEach((step) => list.append(createStepCard(state.componentId, step)));
    body.append(list);
  }

  const footer = document.createElement('div');
  footer.className = 'template-preset-drawer__footer';

  const overviewLink = document.createElement('button');
  overviewLink.type = 'button';
  overviewLink.className = 'template-preset-drawer__nav-link';
  overviewLink.textContent = 'Bekijk alle componenten';
  overviewLink.addEventListener('click', () =>
    switchToView({ componentId: state.componentId, stepId: null, view: 'overview' }),
  );
  footer.append(overviewLink);

  body.append(footer);
  return body;
};

// ---------- Preset groups for a single step ----------

const createPresetGroupSection = (group: PresetGroup) => {
  const section = document.createElement('section');
  section.className = 'wizard-token-preset';
  section.dataset.presetGroup = '';
  section.dataset.groupLabel = group.name;

  const heading = document.createElement('h3');
  heading.className = 'nl-heading nl-heading--level-4 wizard-token-preset__title';
  heading.textContent = group.name;
  section.append(heading);

  if (group.description) {
    const description = document.createElement('p');
    description.className = 'nl-paragraph wizard-token-preset__description';
    description.textContent = group.description;
    section.append(description);
  }

  const layout = document.createElement('div');
  layout.className = 'wizard-token-preset__layout';

  const options = document.createElement('div');
  options.className = 'wizard-token-preset__options';

  const input = document.createElement('wizard-token-preset');
  input.className = 'wizard-token-preset__input';
  input.setAttribute('group-label', group.name);
  input.setAttribute('options', JSON.stringify(group.options));

  options.append(input);
  layout.append(options);
  section.append(layout);

  return section;
};

const renderPresetsBody = (state: DrawerState, data: DrawerData): HTMLElement => {
  const body = document.createElement('div');
  body.className = 'template-preset-drawer__body';

  const step = findStep(state, data);
  const groups = step?.groups ?? [];

  if (groups.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'nl-paragraph template-preset-drawer__empty';
    empty.textContent = 'Voor deze keuze zijn nog geen presets beschikbaar.';
    body.append(empty);
  } else {
    groups.forEach((group) => body.append(createPresetGroupSection(group)));
  }

  return body;
};

// ---------- All-components overview ----------

const renderOverviewBody = (state: DrawerState, data: DrawerData): HTMLElement => {
  const body = document.createElement('div');
  body.className = 'template-preset-drawer__body template-preset-drawer__body--overview';

  data.overview.categories.forEach((category) => {
    if (category.components.length === 0) return;

    const section = document.createElement('section');
    section.className = 'wizard-components-category';

    const header = document.createElement('div');
    header.className = 'wizard-components-category__header';

    const heading = document.createElement('h3');
    heading.className = 'nl-heading nl-heading--level-3';
    heading.textContent = category.label;
    header.append(heading);
    section.append(header);

    const list = document.createElement('ul');
    list.className = 'wizard-component-list';
    list.setAttribute('aria-label', category.label);

    category.components.forEach((component) => {
      const item = document.createElement('li');

      const supported = data.overview.supportedIds.includes(component.id);
      const isCurrent = component.id === state.componentId;

      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'wizard-component-card';
      trigger.disabled = !supported;
      if (isCurrent) trigger.setAttribute('aria-current', 'true');

      const illustration = document.createElement('img');
      illustration.className = 'wizard-component-card__illustration';
      illustration.src = `/svg/componenten_overzicht_${component.id}.svg`;
      illustration.alt = '';
      illustration.width = 240;
      illustration.height = 160;
      trigger.append(illustration);

      const titleEl = document.createElement('span');
      titleEl.className = 'wizard-component-card__title';
      titleEl.textContent = component.title;
      trigger.append(titleEl);

      if (component.description) {
        const descEl = document.createElement('span');
        descEl.className = 'wizard-component-card__description';
        descEl.textContent = supported ? component.description : `${component.description} (binnenkort beschikbaar)`;
        trigger.append(descEl);
      }

      if (supported) {
        trigger.addEventListener('click', () => {
          switchToView({ componentId: component.id, stepId: null, view: 'steps' });
        });
      }

      item.append(trigger);
      list.append(item);
    });

    section.append(list);
    body.append(section);
  });

  return body;
};

const renderBody = (state: DrawerState, data: DrawerData): HTMLElement => {
  if (state.view === 'overview') return renderOverviewBody(state, data);
  if (state.view === 'presets') return renderPresetsBody(state, data);
  return renderStepsBody(state, data);
};

// ---------- Header (with optional back button) ----------

const backTargetFor = (state: DrawerState): DrawerState | null => {
  if (state.view === 'presets') return { componentId: state.componentId, stepId: null, view: 'steps' };
  if (state.view === 'overview') return { componentId: state.componentId, stepId: null, view: 'steps' };
  return null;
};

const renderHeader = (drawer: HTMLElement, state: DrawerState, data: DrawerData) => {
  const existing = drawer.querySelector<HTMLElement>('.template-preset-drawer__header');
  const header = existing ?? document.createElement('header');
  header.className = 'template-preset-drawer__header';
  header.replaceChildren();

  const back = backTargetFor(state);
  if (back) {
    const backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'template-preset-drawer__back';
    backButton.setAttribute('aria-label', 'Terug');
    backButton.textContent = '←';
    backButton.addEventListener('click', () => switchToView(back));
    header.append(backButton);
  }

  const title = document.createElement('h2');
  title.className = 'nl-heading nl-heading--level-3 template-preset-drawer__title';
  title.textContent = headerTitle(state, data);
  header.append(title);

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'template-preset-drawer__close';
  closeButton.setAttribute('aria-label', 'Sluiten');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', closeDrawer);
  header.append(closeButton);

  return header;
};

// ---------- State / view switching ----------

const writeStateToDataset = (drawer: HTMLElement, state: DrawerState) => {
  drawer.dataset.view = state.view;
  drawer.dataset.componentId = state.componentId;
  drawer.dataset.stepId = state.stepId ?? '';
};

const switchToView = (next: DrawerState) => {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;

  const data = readDrawerData();
  writeStateToDataset(drawer, next);

  const newHeader = renderHeader(drawer, next, data);
  const oldHeader = drawer.querySelector('.template-preset-drawer__header');
  if (oldHeader && oldHeader !== newHeader) oldHeader.replaceWith(newHeader);
  else if (!oldHeader) drawer.prepend(newHeader);

  const oldBody = drawer.querySelector('.template-preset-drawer__body');
  const newBody = renderBody(next, data);
  if (oldBody) oldBody.replaceWith(newBody);
  else drawer.append(newBody);
};

// ---------- Open / close ----------

const removeDrawerImmediate = () => {
  const drawer = document.getElementById(drawerId);
  if (drawer instanceof HTMLDialogElement && drawer.open) drawer.close();
  drawer?.remove();
};

const closeDrawer = () => {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;

  document.documentElement.classList.remove(drawerOpenClass);

  drawer.classList.add('is-leaving');
  drawer.addEventListener(
    'transitionend',
    (event) => {
      if (event.propertyName !== 'transform') return;
      if (drawer instanceof HTMLDialogElement && drawer.open) drawer.close();
      drawer.remove();
    },
    { once: true },
  );
};

const openDrawer = (data: DrawerData, detail: TemplatePresetRequestDetail) => {
  removeDrawerImmediate();

  // Append inside <clippy-reset-theme> so the drawer inherits the basis-*/
  // nl-button-* tokens it defines on `:host`. `clippy-reset-theme` is itself
  // inside `theme-wizard-app`, so `change` events from `<wizard-token-preset>`
  // still bubble to the wizard-app's existing change handler.
  const host =
    document.querySelector('clippy-reset-theme') ??
    document.querySelector('theme-wizard-app') ??
    document.body;

  const initialState: DrawerState = {
    componentId: detail.componentId,
    stepId: null,
    view: 'steps',
  };

  const drawer = document.createElement('dialog');
  drawer.id = drawerId;
  drawer.className = 'template-preset-drawer';
  writeStateToDataset(drawer, initialState);

  drawer.append(renderHeader(drawer, initialState, data));
  drawer.append(renderBody(initialState, data));

  drawer.classList.add('is-entering');
  host.append(drawer);
  drawer.show();
  document.documentElement.classList.add(drawerOpenClass);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      drawer.classList.remove('is-entering');
    });
  });
};

const CONTROLLER_INIT_FLAG = '__templatePresetDrawerInitialized';

type WindowWithFlag = Window & { [CONTROLLER_INIT_FLAG]?: boolean };

const initTemplatePresetDrawer = () => {
  const win = window as WindowWithFlag;
  if (win[CONTROLLER_INIT_FLAG]) return;
  win[CONTROLLER_INIT_FLAG] = true;

  document.addEventListener('template-preset-request', (event) => {
    const detail = (event as CustomEvent<TemplatePresetRequestDetail>).detail;
    const data = readDrawerData();
    if (Object.keys(data.presetStepsByComponent).length === 0) return;
    openDrawer(data, detail);
  });
};

initTemplatePresetDrawer();

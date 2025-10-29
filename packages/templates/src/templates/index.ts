type Category = 'template' | 'collage';

type GroupMeta = {
  name?: string;
  value?: string;
  type?: Category;
};

type DetailMeta = {
  name?: string;
  value?: string;
  detail?: { name: string; value: string };
  module?: string;
};

type TemplateOption = {
  name: string;
  value: string;
  detail?: { name: string; value: string };
  module?: string;
};

export type TemplateGroup = {
  name: string;
  value: string;
  type: Category;
  detail: TemplateOption;
};

type PageModule = { group?: GroupMeta; detail?: DetailMeta };

const FILES = import.meta.glob('../pages/**/*.astro', { eager: true });

const PATH_REGEX = /pages\/([^/]+)\/([^/]+)\.astro$/;

function parsePath(key: string): { slug: string; page: string } | null {
  const match = PATH_REGEX.exec(key);
  if (!match) return null;

  return { page: match[2], slug: match[1] };
}

const templateGroups = (): TemplateGroup[] => {
  const groups: TemplateGroup[] = [];

  for (const [key, module] of Object.entries(FILES)) {
    // Parse path: pages/template-name/page.astro -> { page: 'page', slug: 'template-name' }
    const parsed = parsePath(key);
    if (!parsed) {
      // Skip files that don't match the expected structure (e.g., index.astro at root)
      continue;
    }

    const { page, slug } = parsed;

    // Extract metadata exported from the Astro module
    const { detail, group } = (module as PageModule) || {};

    groups.push({
      name: group?.name ?? detail?.module ?? slug,
      detail: {
        name: detail?.name ?? page,
        detail: detail?.detail,
        module: detail?.module,
        value: detail?.value ?? page,
      },
      type: group?.type ?? 'template',
      value: slug,
    });
  }
  return groups;
};

export const TEMPLATES: TemplateGroup[] = templateGroups();

export type Category = 'template' | 'collage';

export type Page = {
  name: string;
  value: string;
};

export type TemplateGroup = {
  name: string;
  type: Category;
  pages: Page[];
};

type Detail = { name?: string; value?: string; module?: string };
type PageModule = { pages?: Page[]; detail?: Detail };

const FILES = import.meta.glob('../pages/**/*.astro', { eager: true });

const PATH_REGEX = /pages\/([^/]+)\/([^/]+)\.astro$/;

function parsePath(key: string): { slug: string; page: string } | null {
  const match = PATH_REGEX.exec(key);
  if (!match) return null;
  return { page: match[2], slug: match[1] };
}

const templateGroups = (): TemplateGroup[] => {
  const map = new Map<string, TemplateGroup>();

  for (const [key, module] of Object.entries(FILES)) {
    // Parse path: pages/template-name/page.astro -> { page: 'page', slug: 'template-name' }
    const parsed = parsePath(key);
    if (!parsed) {
      // Skip files that don't match the expected structure (e.g., index.astro at root)
      continue;
    }

    const { page, slug } = parsed;
    // Extract metadata exported from the Astro module
    const { detail, pages = [] as Page[] } = (module as PageModule) || {};

    const groupType: Category = 'template';
    const groupTitle = detail?.module ?? slug;

    // Prefer explicit pages array; otherwise fall back to a single detail; otherwise use path info
    const metaName: string = pages[0]?.name ?? detail?.name ?? page;
    const metaValue: string = pages[0]?.value ?? detail?.value ?? page;

    const pageItem: Page = {
      name: metaName,
      value: `/${slug}/${metaValue}`,
    };

    if (map.has(slug)) {
      map.get(slug)!.pages.push(pageItem);
    } else {
      map.set(slug, {
        name: groupTitle,
        pages: [pageItem],
        type: groupType,
      });
    }
  }

  return Array.from(map.values());
};

const TEMPLATES: TemplateGroup[] = templateGroups();
export const TEMPLATES_JSON = JSON.stringify(TEMPLATES);

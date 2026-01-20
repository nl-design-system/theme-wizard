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


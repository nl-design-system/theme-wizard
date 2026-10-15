import { type Page } from '@playwright/test';
import { DesignTokensIndexPage } from './DesignTokensIndexPage';

export class NlTokensPage extends DesignTokensIndexPage {
  constructor(page: Page) {
    super(page, 'nl');
  }
}

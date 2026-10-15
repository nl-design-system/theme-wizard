import { type Page } from '@playwright/test';
import { DesignTokensIndexPage } from './DesignTokensIndexPage';

export class BasisTokensPage extends DesignTokensIndexPage {
  constructor(page: Page) {
    super(page, 'basis');
  }
}

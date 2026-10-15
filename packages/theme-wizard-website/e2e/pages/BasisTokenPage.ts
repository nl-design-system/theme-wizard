import { type Page } from '@playwright/test';
import { DesignTokenPage } from './DesignTokenPage';

export class BasisTokenPage extends DesignTokenPage {
  constructor(page: Page) {
    super(page, 'basis');
  }
}

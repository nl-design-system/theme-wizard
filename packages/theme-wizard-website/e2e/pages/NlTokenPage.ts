import { type Page } from '@playwright/test';
import { DesignTokenPage } from './DesignTokenPage';

export class NlTokenPage extends DesignTokenPage {
  constructor(page: Page) {
    super(page, 'nl');
  }
}

import { type Page } from '@playwright/test';
import { DesignTokenPage } from './DesignTokenPage';

export class CommunityTokenPage extends DesignTokenPage {
  constructor(page: Page) {
    super(page, 'community');
  }
}

import { test, expect } from './fixtures/fixtures';

test('can change heading font to Courier New on preview', async ({ previewPage }) => {
  const heading = previewPage.getHeading(2);

  await expect(heading).not.toHaveFont('Courier New');
  await previewPage.changeHeadingFont('Courier New');
  await expect(heading).toHaveFont('Courier New');
});

test('can change body font to Arial', async ({ previewPage }) => {
  const paragraph = previewPage.getParagraph();

  await expect(paragraph).not.toHaveFont('Arial');
  await previewPage.changeBodyFont('Arial');
  await expect(paragraph).toHaveFont('Arial');
});

import { StoryWizardOverviewController } from './StoryWizardOverviewController';
import { StoryWizardStepController } from './StoryWizardStepController';

if (document.querySelector('.wizard-story-section')) {
  StoryWizardStepController.init();
} else if (document.getElementById('wizard-overview')) {
  StoryWizardOverviewController.init();
}

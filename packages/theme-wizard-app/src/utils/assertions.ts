import { ClippyModal } from '@nl-design-system-community/clippy-components/clippy-modal';

export const isClippyModal = (element: unknown): element is ClippyModal => {
  return element instanceof ClippyModal;
};

export const isSlotEmpty = (slot: HTMLSlotElement): boolean => {
  const assigned = slot.assignedElements({ flatten: false });
  if (assigned.length === 0) return true;

  return assigned.every((el) => {
    // Recurse: an <slot> is only "content" if it itself has assigned elements
    if (el instanceof HTMLSlotElement) {
      return isSlotEmpty(el);
    }
    return false;
  });
};

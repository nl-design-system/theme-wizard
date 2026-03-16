import { css } from 'lit';

export default css`
  :host {
    --utrecht-table-caption-text-align: start;
  }

  .utrecht-table__header-cell {
    white-space: nowrap;

    &:nth-child(1) {
      inline-size: 3%;
    }
    &:nth-child(2) {
      inline-size: 47%;
    }
    &:nth-child(3) {
      inline-size: 47%;
    }
    &:nth-child(4) {
      inline-size: 3%;
    }
  }

  input[type='checkbox'] {
    zoom: 1.2;
  }
`;

import { createSelector } from "reselect";

const selectCurrent = state => state.current || {};

const makeSelectCurrentPeriod = () =>
  createSelector(selectCurrent, current => current.selectedPeriod);

const makeSelectCurrentOrg = () =>
  createSelector(selectCurrent, current => current.selectedOu);

export { selectCurrent, makeSelectCurrentPeriod, makeSelectCurrentOrg };

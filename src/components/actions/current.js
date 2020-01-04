export const selectOrg = selectedOu => ({
  type: "SET_SELECTED_ORG",
  selectedOu
});

export const selectPeriodType = selectedPeriodType => ({
  type: "SET_PERIOD_TYPE",
  selectedPeriodType
});

export const selectPeriod = selectedPeriod => ({
  type: "SET_PERIOD",
  selectedPeriod
});

const defaultState = {
  selectedPeType: "Monthly"
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case "SET_SELECTED_ORG":
      return { ...state, selectedOu: action.selectedOu };
    case "SET_PERIOD_TYPE":
      return { ...state, selectedPeType: action.selectedPeType };
    case "SET_PERIOD":      
      return { ...state, selectedPeriod: action.selectedPeriod };
    case "EVENT_DATA_RECEIVED":
      let hiddenFields = [
        "longitude",
        "latitude",
        "geometry",
        "oucode",
        "ou",
        "psi",
        "ps",
        "enrollmentdate",
        "incidentdate"
      ];

      let headers = action.json.headers;
      let tableHeaders = action.json.headers
        .filter(e => hiddenFields.indexOf(e.name) == -1)
        .map(e => {
          return {
            name: e.column,
            selector: e.name,
            sortable: true,
            minWidth: "50"
          };
        });

      let data = action.json.rows.map(r => {
        return headers.reduce((obj, h, idx) => {
          obj[h.name] = r[idx];
          return obj;
        }, {});
      });

      return { ...state, headers: tableHeaders, eventData: data };
    default:
      return state;
  }
};

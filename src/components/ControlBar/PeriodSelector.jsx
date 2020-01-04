/* Author Hoang */
import React from "react";
import { App as D2UIApp, mui3theme as dhis2theme } from "@dhis2/d2-ui-core";
import PeriodPicker from "./D2PeriodPicker";
import parsePeriod from "d2/period/parser";
import { selectPeriod } from "../actions/current";
import { connect } from "react-redux";

const PeriodSelector = props => {
  const { d2, selectedPe, selectedPeType } = props;
  return (
    <div style={{ padding: 30 }}>
      <D2UIApp>
        <PeriodPicker
          d2={d2}
          selectedPeriod={selectedPe ? selectedPe : null}
          periodType={selectedPeType}
          onPickPeriod={value => {
            // handleSelectPeriod(parsePeriod(value));
          }}
        />
      </D2UIApp>
    </div>
  );
};

const mapDispatchToProps = {
  selectPeriod: selectPeriod
};

const mapStateToProps = state => {
  return {
    selectedPeType: state.current.selectedPeType,
    selectedPe: state.current.selectedPe
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PeriodSelector);

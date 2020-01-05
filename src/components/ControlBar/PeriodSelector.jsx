/* Author Hoang */
import React from "react";
import { App as D2UIApp } from "@dhis2/d2-ui-core";
import PeriodPicker from "./D2PeriodPicker";
import parsePeriod from "d2/period/parser";
import { selectPeriod } from "../../actions/current";
import { connect } from "react-redux";

const PeriodSelector = props => {
  const { d2, selectedPeriod, selectedPeType } = props;
  return (
    <div style={{ padding: 30 }}>
      <D2UIApp>
        <PeriodPicker
          d2={d2}
          selectedPeriod={selectedPeriod ? selectedPeriod : null}
          periodType={selectedPeType}
          onPickPeriod={value => {
            props.selectPeriod(parsePeriod(value));
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
    selectedPeriod: state.current.selectedPeriod
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PeriodSelector);

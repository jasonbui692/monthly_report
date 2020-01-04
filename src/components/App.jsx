import React, { useState, useEffect } from "react";
import "./App.css";

import HeaderBar from "@dhis2/d2-ui-header-bar";
import { createHashHistory } from "history";
import { SnackbarProvider } from "notistack";

import Button from "./Button";

import ControlBar from "./ControlBar/ControlBar";
import MainView from "./MainView/MainView";
import { template } from "../config/mapping-config";

import LoadingMask from "./LoadingMask/LoadingMask";
import {
  getProgramList,
  getTemplateExcelList,
  getCompletenessDataSet,
  getProgramAndDependencies,
  getDataSetAndDependencies
} from "../utils/stores";

const history = createHashHistory({});
export const AppContext = React.createContext({});

const App = props => {
  let { d2 } = props;
  const [loading, setLoading] = useState(true);
  const [selectedOu, setSelectedOu] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedTemplateExcel, setSelectedTemplateExcel] = useState(null);
  const [excelList, setTemplateExcelList] = useState([]);
  const [selectedPeriodType, setSelectedPeriodType] = useState(null);

  const handleSelectOu = ouModel => {
    setSelectedOu(ouModel);
    let selectedOrgLevel = ouModel.path.split("/").length - 1;
    let templateFiltered = template.filter(t => t.level == selectedOrgLevel);

    if (selectedTemplateExcel) {
      setSelectedTemplateExcel(null);
    }
    if (selectedPeriod) {
      setSelectedPeriod(null);
    }

    setTemplateExcelList(templateFiltered);
  };

  const handleSelectTemplateExcel = dataSetModel => {
    let templateFiltered = template.find(t => t.id == dataSetModel);
    if (selectedPeriod && selectedPeriodType !== templateFiltered.periodType) {
      setSelectedPeriod(null);
    }

    setSelectedTemplateExcel(templateFiltered);
    setSelectedPeriodType(templateFiltered.periodType);
  };

  const handleSelectPeriod = period => {
    setSelectedPeriod(period);
  };
  return (
    <SnackbarProvider maxSnack={1}>
      {/* <LoadingMask /> */}

      <div className="App">
        <HeaderBar d2={d2} />
        <ControlBar d2={d2} />
        <MainView />
      </div>
    </SnackbarProvider>

    // <AppContext.Provider
    //   value={{
    //     d2,
    //     loading,
    //     selectedOu,
    //     handleSelectOu,
    //     selectedPeriod,
    //     selectedTemplateExcel,
    //     selectedPeriodType,
    //     excelList,
    //     handleSelectTemplateExcel,
    //     handleSelectPeriod
    //   }}
    // >

    // </AppContext.Provider>
  );
};

export default App;

/* Author Nghia */
import React, { useContext } from "react";
import Select from "react-select";
import "./ControlBar.css";
import { AppContext } from "../App";
const ProgramSelector = () => {
  const formatGroupLabel = data => (
    <div
      styles={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <span
        style={{
          backgroundColor: "#EBECF0",
          borderRadius: "2em",
          color: "#172B4D",
          display: "inline-block",
          fontSize: 12,
          fontWeight: "bold",
          lineHeight: "1",
          minWidth: 1,
          padding: "0.16666666666667em 0.5em",
          textAlign: "center"
        }}
      >
        {data.label}
      </span>
    </div>
  );

  const generateOptions = () => {
    let options = [];
    options.push(
      {
        label: "Template"
        // options: excelList.map(dataSet => {
        //   return {
        //     value: dataSet.id,
        //     label: dataSet.displayName,
        //     type: "dataSet"
        //   };
        // })
      }
      // ,{
      //   label: "Program",
      //   options: programList.map(program => {
      //     return { value: program, label: program.displayName, type: "program" };
      //   })
      // }
    );
    return options;
  };

  const generateValue = () => {
    // if (selectedTemplateExcel) {
    //   return {
    //     value: selectedTemplateExcel.id,
    //     label: selectedTemplateExcel.displayName,
    //     type: "dataSet"
    //   };
    // } else {
    //   return null;
    // }
    return null;
  };
  return (
    <Select
      value={generateValue()}
      className="widthForPeriodSelect"
      options={generateOptions()}
      placeholder={"Select dataset"}
      onChange={value => {
        // handleSelectTemplateExcel(value.value);
      }}
      clearable={false}
      formatGroupLabel={formatGroupLabel}
    />
  );
};

export default ProgramSelector;

/* Author Hoang */
import React, { useState, useContext } from "react";
import AppBar from "@material-ui/core/AppBar";
import Popover from "@material-ui/core/Popover";
import OrgUnitSelector from "./OrgUnitSelector";
import ProgramDataSetSelector from "./ProgramDataSetSelector";
import PeriodSelector from "./PeriodSelector";
import "./ControlBar.css";

import { connect } from "react-redux";
import { AppContext } from "../App";
import { Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

import { getEventData } from "../../actions";

const ControlBar = props => {
  const { d2, selectedOu } = props;
  const [ouSelectorAnchorEl, setOuSelectorAnchorEl] = useState(null);
  const [peSelectorAnchorEl, setPeSelectorAnchorEl] = useState(null);
  const [onlineStatusAnchorEl, setOnlineStatusAnchorEl] = useState(null);

  const { selectedPeriod } = useContext(AppContext);

  const handleClosePopover = () => {
    setOuSelectorAnchorEl(null);
    setPeSelectorAnchorEl(null);
    setOnlineStatusAnchorEl(null);
  };

  return (
    <div className="control-bar-container">
      <AppBar position="static" color="default" style={{ height: 65 }}>
        <div className="control-bar">
          <div className="selectors">
            <div className="ou-selector-container">
              <div className="selector-label">Khu vực</div>
              <div
                onClick={event => {
                  setOuSelectorAnchorEl(event.target);
                }}
              >
                {selectedOu ? selectedOu.displayName : "Lựa chọn khu vực"}
              </div>
              <Popover
                open={Boolean(ouSelectorAnchorEl)}
                anchorEl={ouSelectorAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
              >
                <OrgUnitSelector d2={d2} />
              </Popover>
            </div>
            {/* <div className="program-selector-container">
              <div className="selector-label">Template</div>
              <div>
                <ProgramDataSetSelector />
              </div>
            </div> */}
            <div className="period-selector-container">
              <div className="selector-label">Thời điểm</div>
              <div
                onClick={event => {
                  setPeSelectorAnchorEl(event.target);
                }}
              >
                {selectedPeriod ? selectedPeriod.name : "Chọn thời điểm"}
              </div>
              <Popover
                open={Boolean(peSelectorAnchorEl)}
                anchorEl={peSelectorAnchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left"
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left"
                }}
              >
                <PeriodSelector d2={d2} />
              </Popover>
            </div>

            <div className="control-item">
              <Tooltip title="Export JAR">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ height: 38, marginTop: 19 }}
                  onClick={props.getEventData}
                >
                  Xuất báo cáo
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </AppBar>
    </div>
  );
};

const mapActionsToProps = {
  getEventData: getEventData
};

const mapStateToProps = state => {
  return {
    selectedOu: state.current.selectedOu
  };
};

export default connect(mapStateToProps, mapActionsToProps)(ControlBar);

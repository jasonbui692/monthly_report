import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import "./LoadingMask.css";
export default class LoadingMask extends React.Component {
  render() {
    return (
      <div className="loading-mask-container">
        <CircularProgress size={100} thickness={2} />
      </div>
    );
  }
}

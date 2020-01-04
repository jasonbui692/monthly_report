import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { dhis2 } from "./config/config";
import App from "./components/App";

import configureStore from "./configureStore";
import { Provider } from "react-redux";

import { init as d2Init, config } from "d2";

const render = props => {
  const store = configureStore();
  
  ReactDOM.render(
    <Provider store={store}>
      <App {...props} />
    </Provider>,
    document.getElementById("root")
  );
  if (module.hot) {
    module.hot.accept(App);
  }
};

const init = async () => {
  console.log(process.env.NODE_ENV);
  const d2 = await d2Init({
    baseUrl: dhis2.baseUrl + "/api",
    headers: {
      credentials: "include",
      Authorization: "Basic " + btoa(`${dhis2.username}:${dhis2.password}`)
    }
  });

  render({ d2 });
};

init();
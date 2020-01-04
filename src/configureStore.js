import { createStore, applyMiddleware, compose } from "redux";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import rootSaga from "./saga";

import reducer from "./reducers";

const sagaMiddleware = createSagaMiddleware();

const configureStore = (...args) => {
  const middleware = [sagaMiddleware, ...args, createLogger()];
  let store = createStore(reducer, compose(applyMiddleware(...middleware)));
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;

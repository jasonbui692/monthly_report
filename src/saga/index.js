import { put, takeLatest, all, select } from "redux-saga/effects";
import { pull } from "../utils/fetch";

import {
  makeSelectCurrentPeriod,
  makeSelectCurrentOrg
} from "../components/MainView/selector";

function* fetchNews() {
  const json = yield fetch(
    "https://newsapi.org/v1/articles?source=cnn&apiKey=c39a26d9c12f48dba2a5c00e35684ecc"
  ).then(response => response.json());
  yield put({
    type: "NEWS_RECEIVED",
    json: json.articles || [{ error: json.message }]
  });
}

function* actionWatcher() {
  yield takeLatest("GET_NEWS", fetchNews);
}

function* fetchEventData() {
  const stateCurrentPeriod = yield select(makeSelectCurrentPeriod());
  const stateCurrentOrg = yield select(makeSelectCurrentOrg());

  const json = yield pull(
    `/api/29/analytics/events/query/sy9GqgGlkpp.json?dimension=pe:${stateCurrentPeriod.id}&dimension=ou:${stateCurrentOrg.id}&dimension=o9WoGq6dqd7&dimension=ttLnSkOQqwe&dimension=Dr5hSZTVFvc&dimension=hcH8E1UFY9G&dimension=FiDhs2FGYG4&dimension=a6Hhh31cZLB&dimension=wQpkeOFwZ5j&dimension=J9CUftEQBVv&dimension=KxFNVM6PJkm&dimension=XiX6GuSZ0fC&dimension=iV0ka50U4Fu&dimension=PKH1JKc9UeJ&dimension=Ew49D2U6kZB&dimension=iNFQzZ8uMa2&dimension=O8Hi5to4dcP&dimension=txvsBlXeIRp&dimension=ceKYb1MbmwE&stage=sgrxXfAW75Z&displayProperty=NAME&outputType=EVENT&desc=eventdate`
  );
  // const json = yield pull(
  //   "/api/29/analytics/events/query/sy9GqgGlkpp.json?dimension=pe:LAST_YEAR&dimension=ou:oVBHhZ43yPD&dimension=o9WoGq6dqd7&dimension=ttLnSkOQqwe&dimension=Dr5hSZTVFvc&dimension=hcH8E1UFY9G&dimension=FiDhs2FGYG4&dimension=a6Hhh31cZLB&dimension=wQpkeOFwZ5j&dimension=J9CUftEQBVv&dimension=KxFNVM6PJkm&dimension=XiX6GuSZ0fC&dimension=iV0ka50U4Fu&dimension=PKH1JKc9UeJ&dimension=Ew49D2U6kZB&dimension=iNFQzZ8uMa2&dimension=O8Hi5to4dcP&dimension=txvsBlXeIRp&dimension=ceKYb1MbmwE&stage=sgrxXfAW75Z&displayProperty=NAME&outputType=EVENT&desc=eventdate"
  // );

  yield put({
    type: "EVENT_DATA_RECEIVED",
    json: json || [{ error: json.message }]
  });
}

function* actionEventData() {
  yield takeLatest("GET_EVENT_DATA", fetchEventData);
}

export default function* rootSaga() {
  yield all([actionEventData()]);
}

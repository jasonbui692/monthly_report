import { combineReducers } from "redux";

import metadata, * as fromMetadata from "./metadata";
import current, * as fromCurrent from "./current";

export default combineReducers({
  metadata,
  current
});

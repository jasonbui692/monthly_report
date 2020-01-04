import { dhis2 } from "../config/config";

const pull = endPoint => {
  return fetch(dhis2.baseUrl + endPoint, {
    credentials: "include",
    headers: {
      Authorization: !dhis2.username ? "" : "Basic " + btoa(`${dhis2.username}:${dhis2.password}`)
    }
  })
    .then(result => result.json())
    .then(json => json)
    .catch(err => err);
};

const push = (endPoint, payload, method) => {
  return fetch(dhis2.baseUrl + endPoint, {
    method: method ? method : "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: !dhis2.username ? "" : "Basic " + btoa(`${dhis2.username}:${dhis2.password}`)
    }
  })
    .then(result => {
      return result.json();
    })
    .catch(err => {
      return null;
    });
};

export { pull, push };

/* Author Nghia */
import React, { useState, useContext, useEffect } from "react";
import { OrgUnitTreeMultipleRoots } from "@dhis2/d2-ui-org-unit-tree";
import LoadingMask from "../LoadingMask/LoadingMask";
import { dhis2 } from "../../config/config";
import { connect } from "react-redux";

import { selectOrg } from "../../actions/current";

const OrgUnitSelector = props => {
  const { d2, selectedOu } = props;
  const [roots, setRoots] = useState(null);

  useEffect(() => {
    d2.currentUser.getOrganisationUnits().then(ou => {
      setRoots(ou.toArray());
    });
  }, []);

  const pull = endPoint => {
    return fetch(dhis2.baseUrl + endPoint, {
      credentials: "include",
      headers: {
        Authorization: !dhis2.username
          ? ""
          : "Basic " + btoa(`${dhis2.username}:${dhis2.password}`)
      }
    })
      .then(result => result.json())
      .then(json => json)
      .catch(err => err);
  };

  const getOrgDetails = async () => {
    return pull(
      "/api/organisationUnits/UarRSGEtsLd.json?fields=id,name,displayName,level"
    ).then(json => {
      return json;
    });
  };

  const handleChangeOrgUnit = async (event, orgUnit) => {
    props.selectOrg(orgUnit);
  };

  return (
    <div style={{ width: 350, height: 450, padding: 5 }}>
      {roots ? (
        <OrgUnitTreeMultipleRoots
          roots={roots}
          selected={selectedOu ? [selectedOu.path] : []}
          initiallyExpanded={selectedOu ? [selectedOu.path] : []}
          onSelectClick={handleChangeOrgUnit}
          hideCheckboxes
        />
      ) : (
        <LoadingMask />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    selectedOu: state.current.selectedOu
  };
};

const mapDispatchToProps = {
  selectOrg: selectOrg
};

export default connect(mapStateToProps, mapDispatchToProps)(OrgUnitSelector);

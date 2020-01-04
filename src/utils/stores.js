import _ from "lodash";
import { pull } from "./fetch";
const getProgramList = (d2, ouModel, completenessexcelList) => {
  return d2.models.program
    .filter()
    .on("organisationUnits.id")
    .equals(ouModel.id)
    .list({ fields: "id,displayName,access,attributeValues", paging: false })
    .then(programs => {
      let programList = programs.toArray().filter(program => {
        return program.access.data.write === true && program.access.read === true;
      });
      programList.forEach((p, index) => {
        let foundCompletenessDataSet = completenessexcelList.find(cds => p.id === cds.program);
        if (foundCompletenessDataSet) {
          programList[index].periodType = foundCompletenessDataSet.periodType;
        }
      });
      return programList;
    });
};
 
const getexcelList = (d2, ouModel, completenessexcelList) => {
  return d2.models.dataSet
    .filter()
    .on("organisationUnits.id")
    .equals(ouModel.id)
    .list({ fields: "id,displayName,access,periodType", paging: false })
    .then(dataSets => {
      return dataSets.toArray().filter(dataSet => {
        return (
          dataSet.access.data.write === true &&
          dataSet.access.read === true &&
          !completenessexcelList.find(cds => cds.id === dataSet.id)
        );
      });
    });
};

const getCompletenessDataSet = d2 => {
  return Promise.all([
    d2.models.program
      .list({ fields: "id,displayName,access,attributeValues", paging: false })
      .then(programs => {
        return programs.toArray().filter(program => {
          return program.access.data.write === true && program.access.read === true;
        });
      }),

    d2.models.dataSets
      .list({ fields: "id,displayName,access,periodType", paging: false })
      .then(dataSets => {
        return dataSets.toArray().filter(dataSet => {
          return dataSet.access.data.write === true && dataSet.access.read === true;
        });
      })
  ]).then(result => {
    let programList = result[0];
    let excelList = result[1];
    let completenessDataSets = [];
    programList.forEach(p => {
      let found = p.attributeValues.find(attr => {
        return attr.attribute.id === "fKtNdlE6COS";
      });
      if (found) {
        let ds = excelList.find(d => {
          return d.id === found.value;
        });
        completenessDataSets.push({
          id: ds.id,
          program: p.id,
          periodType: ds.periodType
        });
      }
    });
    return completenessDataSets;
  });
};

const getProgramAndDependencies = (d2, programModel, selectedPeriodType) => {
  return Promise.all([
    d2.models.programRule
      .filter()
      .on("program.id")
      .equals(programModel.id)
      .list({
        paging: false,
        fields: `id,displayName,condition,programRuleActions[*]`
      }),
    d2.models.programRuleVariable
      .filter()
      .on("program.id")
      .equals(programModel.id)
      .list({
        paging: false,
        fields: `*`
      }),
    d2.models.program
      .filter()
      .on("id")
      .equals(programModel.id)
      .list({
        paging: false,
        fields: `id,access,displayName,attributeValues[*],programIndicators[id,displayName,attributeValues,aggregationType,expression,filter],programStages[id,displayName,captureCoordinates,featureType,dataEntryForm[id,htmlCode],programStageDataElements[compulsory,displayInReports,id,dataElement[id,displayName,displayFormName,code,valueType,optionSet[id,options[id,displayName,code,attributeValues]]]]]`
      })
  ]).then(result => {
    let p = result[2].toArray()[0];
    let program = {};
    program.access = p.access;
    program.id = p.id;
    program.displayName = p.displayName;
    program.type = "program";
    program.programStage = p.programStages.toArray()[0].id;
    program.customForm = p.programStages.toArray()[0].dataEntryForm
      ? p.programStages.toArray()[0].dataEntryForm.htmlCode
      : null;
    program.dataSet = p.attributeValues.find(attr => attr.attribute.id === "fKtNdlE6COS")
      ? p.attributeValues.find(attr => attr.attribute.id === "fKtNdlE6COS").value
      : null;
    program.periodType = selectedPeriodType;
    program.captureCoordinates = p.programStages.toArray()[0].featureType ? true : false;
    program.dataElements = p.programStages.toArray()[0].programStageDataElements.map(psde => {
      let dataElement = psde.dataElement;
      return {
        id: dataElement.id,
        displayName: dataElement.displayName,
        valueType: dataElement.valueType,
        compulsory: psde.compulsory,
        displayInTable: psde.displayInReports,
        displayFormName: dataElement.displayFormName,
        optionSet: dataElement.optionSet ? true : false,
        options: dataElement.optionSet
          ? dataElement.optionSet.options.map(o => {
              return {
                value: o.code,
                label: o.displayName,
                attributeValues: o.attributeValues ? o.attributeValues : null
              };
            })
          : null
      };
    });
    program.programIndicators = _.compact(
      p.programIndicators.toArray().map(pi => {
        let programIndicator = pi;
        return {
          id: programIndicator.id,
          displayName: programIndicator.displayName,
          filter: programIndicator.filter,
          expression: programIndicator.expression,
          aggregationType: programIndicator.aggregationType,
          sortOrder: programIndicator.attributeValues.find(
            attr => attr.attribute.id === "Nzx3vPLpeYk"
          )
            ? programIndicator.attributeValues.find(attr => attr.attribute.id === "Nzx3vPLpeYk")
                .value
            : null
        };
      })
    );
    let variables = result[1].toArray();
    program.programRules = result[0].toArray().map(pr => {
      let programRule = {
        id: pr.id,
        displayName: pr.displayName
      };
      let re = /#{([^}]*)}/g;
      let match = pr.condition.match(re);
      match.forEach(m => {
        m = m.replace("#{", "").replace("}", "");
        let found = variables.find(v => v.name === m);
        pr.condition = pr.condition.replace(
          "#{" + m + "}",
          `dataValues["${found.dataElement.id}"]`
        );
      });

      programRule.condition = pr.condition;
      programRule.actions = pr.programRuleActions.toArray().map(pra => {
        return {
          id: pra.id,
          programRuleActionType: pra.programRuleActionType,
          dataElement: pra.dataElement.id,
          content: pra.content,
          data: pra.data
        };
      });
      return programRule;
    });
    return program;
  });
};

const getDataSetAndDependencies = (d2, dataSetModel) => {
  return Promise.all([
    d2.models.dataSet
      .filter()
      .on("id")
      .equals(dataSetModel.id)
      .list({
        paging: false,
        fields: `id,access,displayName,periodType,renderAsTabs,dataSetElements[id,dataElement[id,displayName,displayFormName,valueType,categoryCombo[id,categories[id,categoryOptions[id,displayName]],categoryOptionCombos[id,displayName,categoryOptions[id,displayName]],organisationUnits[id,displayName,code],sections[id,displayName,sortOrder,dataElements[id]]`
      }),
    d2.models.programIndicator
      .filter()
      .on("access.read")
      .equals(true)
      .list({
        fields: `id,displayName,filter,expression,aggregationType,program[id],attributeValues[*]`,
        paging: false
      }),
    d2.models.validationRules
      .filter()
      .on("access.read")
      .equals(true)
      .list({
        paging: false,
        fields: `id,displayName,leftSide,rightSide,operator`
      })
  ]).then(result => {
    let ds = result[0].toArray()[0];
    let validationRules = result[2].toArray();
    let programIndicators = result[1].toArray();
    let dataSet = {};
    dataSet.id = ds.id;
    dataSet.displayName = ds.displayName;
    dataSet.periodType = ds.periodType;
    dataSet.access = ds.access;
    dataSet.type = "dataSet";
    // dataSet.organisationUnit = ds.organisationUnits.toArray();
    dataSet.renderAsTabs = ds.renderAsTabs;
    dataSet.dataElements = ds.dataSetElements.map(dse => {
      let dataElement = dse.dataElement;
      return {
        id: dataElement.id,
        displayName: dataElement.displayName,
        displayFormName: dataElement.displayFormName,
        categoryCombo: dataElement.categoryCombo,
        valueType: dataElement.valueType
      };
    });
    dataSet.dataElements =  dataSet.dataElements.sort((a, b)=> {
      if (a.displayFormName > b.displayFormName) {
        return 1;
      }
      if (a.displayFormName < b.displayFormName) {
        return -1;
      }
      return 0;
    });
    dataSet.categoryCombos = [];
    dataSet.dataElements.forEach(de => {
      let cc = de.categoryCombo;
      if (!dataSet.categoryCombos.find(c => c.id === cc.id)) {
        dataSet.categoryCombos.push({
          id: cc.id,
          categories: cc.categories.map(c => {
            return {
              categoryOptions: c.categoryOptions.map(co => {
                return {
                  displayName: co.displayName,
                  id: co.id
                };
              })
            };
          }),
          categoryOptionCombos: cc.categoryOptionCombos.map(coc => {
            return {
              id: coc.id,
              displayName: coc.displayName,
              categoryOptions: coc.categoryOptions.map(co => {
                return {
                  id: co.id
                };
              })
            };
          }),
          dataElements: [
            {
              displayFormName: de.displayFormName,
              id: de.id,
              valueType: de.valueType
            }
          ]
        });
      } else {
        dataSet.categoryCombos[
          dataSet.categoryCombos.findIndex(c => c.id === cc.id)
        ].dataElements.push({
          displayFormName: de.displayFormName,
          id: de.id,
          valueType: de.valueType
        });
      }
    });
    dataSet.sections =
      ds.sections.toArray().length !== 0
        ? ds.sections
            .toArray()
            .map(section => {
              return {
                id: section.id,
                displayName: section.displayName,
                sortOrder: section.sortOrder,
                dataElements: section.dataElements.toArray().map(de => {
                  return de.id;
                })
              };
            })
            .sort()
        : null;
    dataSet.validationRules = [];
    dataSet.programIndicators = [];
    dataSet.programs = [];
    validationRules.forEach(vrule => {
      let flag = false;
      let pis = [];
      dataSet.dataElements.forEach(de => {
        if (vrule.rightSide.expression.includes(de.id)) {
          pis = programIndicators.filter(pi => {
            return vrule.leftSide.expression.includes(pi.id);
          });
          if (pis.length > 0) flag = true;
        }
      });
      if (flag === true) {
        dataSet.validationRules.push({
          type: "ic",
          id: vrule.id,
          displayName: vrule.displayName,
          leftSide: vrule.leftSide,
          rightSide: vrule.rightSide,
          operator: vrule.operator
        });
        pis.forEach(pi => {
          dataSet.programIndicators.push({
            id: pi.id,
            displayName: pi.displayName,
            filter: pi.filter,
            expression: pi.expression,
            aggregationType: pi.aggregationType,
            operator: pi.operator,
            program: pi.program
          });
          dataSet.programs.push(pi.program);
        });
      }
    });
    validationRules.forEach(vrule => {
      dataSet.dataElements.forEach(de => {
        if (
          vrule.rightSide.expression.includes(de.id) ||
          vrule.leftSide.expression.includes(de.id)
        ) {
          let found = dataSet.validationRules.find(element => element.id === vrule.id);
          if (found === undefined || found === null) {
            dataSet.validationRules.push({
              type: "normal",
              id: vrule.id,
              displayName: vrule.displayName,
              leftSide: vrule.leftSide,
              rightSide: vrule.rightSide,
              operator: vrule.operator
            });
          }
        }
      });
    });
    dataSet.programIndicators = _.uniqBy(dataSet.programIndicators, "id");
    dataSet.programs = _.uniqBy(dataSet.programs, "id");
    return dataSet;
  });
};

const ping = () => {
  return pull("/dhis-web-commons-stream/ping.action").then(json => {
    if (json.loggedIn) {
      return true;
    } else {
      return false;
    }
  });
};

export {
  getProgramList,
  getexcelList,
  getCompletenessDataSet,
  getProgramAndDependencies,
  getDataSetAndDependencies,
  ping
};

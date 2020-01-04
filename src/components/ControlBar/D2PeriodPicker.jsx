/* Author DHIS2 - Modify by Nghia */
import React from "react";
import PropTypes from "prop-types";
import log from "loglevel";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import DatePicker from "material-ui/DatePicker";
import { is53WeekISOYear, getFirstDateOfWeek } from "d2/period/helpers";

const styles = {
  datePicker: { width: "100%" },
  year: { width: 95, marginRight: 16 },
  month: { width: 125 },
  week: { width: 105 },
  biWeek: { width: 200 },
  biMonth: { width: 200 },
  quarter: { width: 200 },
  sixMonth: { width: 200 },
  line: { marginTop: 0 }
};

const getYear = date => new Date(date).getFullYear().toString();
const getTwoDigitMonth = date => {
  const month = new Date(date).getMonth() + 1; // Month is 0 indexed

  return `0${month}`.slice(-2);
};
const getTwoDigitDay = date => {
  const day = new Date(date).getDate();

  return `0${day}`.slice(-2);
};
const formattedDate = date => `${getYear(date)}${getTwoDigitMonth(date)}${getTwoDigitDay(date)}`;
const getWeekYear = date => {
  // Create a new date object for the thursday of this week
  const target = new Date(date);
  target.setDate(target.getDate() - ((date.getDay() + 6) % 7) + 3);

  return target.getFullYear();
};
const isWeekValid = (date, week) =>
  // It's not possible to have a week 53 in a 52 week year
  !is53WeekISOYear(date) && Number(week) !== 53;
const biWeekToWeek = biWeekStr => parseInt(biWeekStr) * 2 - 1;

let state = {};
 
class PeriodPicker extends React.Component {
  constructor(props, context) {
    super(props, context);

    if (!this.props.selectedPeriod) {
      this.state = {};
    } else {
      this.state = state;
    }

    const i18n = props.d2.i18n;
    this.getTranslation = i18n.getTranslation.bind(i18n);
  }

  componentDidUpdate(prevProps) {
    if (this.props.periodType !== prevProps.periodType) {
      this.handleChange();
    }
  }

  componentWillUnmount() {
    state = this.state;
  }

  getPeriod() {
    const week =
      this.props.periodType === "BiWeekly" && this.state.biWeek
        ? biWeekToWeek(this.state.biWeek)
        : this.state.week;
    const date = this.state.year && week && getFirstDateOfWeek(this.state.year, week);

    switch (this.props.periodType) {
      case "Daily":
        return this.state.date && formattedDate(this.state.date);
      case "Weekly":
        if (date) {
          this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
        }
        return (
          date && isWeekValid(date, this.state.week) && `${getWeekYear(date)}W${this.state.week}`
        );
      case "WeeklyWednesday":
        if (date) {
          this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
        }
        return (
          date && isWeekValid(date, this.state.week) && `${getWeekYear(date)}WedW${this.state.week}`
        );
      case "WeeklyThursday":
        if (date) {
          this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
        }
        return (
          date && isWeekValid(date, this.state.week) && `${getWeekYear(date)}ThuW${this.state.week}`
        );
      case "WeeklySaturday":
        if (date) {
          this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
        }
        return (
          date && isWeekValid(date, this.state.week) && `${getWeekYear(date)}SatW${this.state.week}`
        );
      case "WeeklySunday":
        if (date) {
          this.setState({ invalidWeek: !isWeekValid(date, this.state.week) });
        }
        return (
          date && isWeekValid(date, this.state.week) && `${getWeekYear(date)}SunW${this.state.week}`
        );
      case "BiWeekly":
        if (date) {
          this.setState({ invalidBiWeek: !isWeekValid(date, biWeekToWeek(this.state.biWeek)) });
        }
        return this.state.year && this.state.biWeek && `${this.state.year}BiW${this.state.biWeek}`;
      case "Monthly":
        return this.state.year && this.state.month && `${this.state.year}${this.state.month}`;
      case "BiMonthly":
        return this.state.year && this.state.biMonth && `${this.state.year}0${this.state.biMonth}B`;
      case "Quarterly":
        return this.state.year && this.state.quarter && `${this.state.year}Q${this.state.quarter}`;
      case "SixMonthly":
        return (
          this.state.year && this.state.sixMonth && `${this.state.year}S${this.state.sixMonth}`
        );
      case "SixMonthlyApril":
        return (
          this.state.year && this.state.sixMonth && `${this.state.year}AprilS${this.state.sixMonth}`
        );
      case "SixMonthlyNov":
        return (
          this.state.year && this.state.sixMonth && `${this.state.year}NovS${this.state.sixMonth}`
        );
      case "Yearly":
        return this.state.year;
      case "FinancialApril":
        return this.state.year && `${this.state.year}April`;
      case "FinancialJuly":
        return this.state.year && `${this.state.year}July`;
      case "FinancialOct":
        return this.state.year && `${this.state.year}Oct`;

      default:
        log.error(`Unknown period type: ${this.props.periodType}`);
        return false;
    }
  }

  handleChange() {
    if (this.state.status === true) {
      if (this.getPeriod()) {
        this.props.onPickPeriod(this.getPeriod());
      }
    } else {
      let object = {
        endDate: null,
        id: null,
        name: null,
        startDate: null,
        type: this.props.periodType
      };
      this.props.onPickPeriod(object, false);
    }
  }

  renderOptionPicker(name, options) {
    const changeState = (e, i, value) => {
      const currentYear = new Date().getFullYear();
      if (parseInt(currentYear) === parseInt(value)) {
        if (this.checkingPeriod(Object.keys(this.state)[2])) {
          this.setState({ status: true, [name]: value }, this.handleChange);
        } else {
          this.setState({ status: false, [name]: value }, this.handleChange);
        }
      } else {
        this.setState({ status: true, [name]: value }, this.handleChange);
      }
    };
    const isInvalid =
      (name === "week" && this.state.invalidWeek) ||
      (name === "biWeek" && this.state.invalidBiWeek);

    if (name === "year") {
      return (
        <SelectField
          value={this.state[name]}
          onChange={changeState}
          style={styles[name]}
          floatingLabelText={this.getTranslation(name)}
          floatingLabelStyle={isInvalid ? { color: "red" } : {}}
        >
          {Object.keys(options)
            .sort((a, b) => {
              return b - a;
            })
            .map(value => (
              <MenuItem
                key={value}
                value={value}
                primaryText={
                  /[^0-9]/.test(options[value]) && name !== "biWeek"
                    ? this.getTranslation(options[value])
                    : options[value]
                }
              />
            ))}
        </SelectField>
      );
    } else {
      return (
        <SelectField
          value={this.state[name]}
          onChange={changeState}
          style={styles[name]}
          floatingLabelText={this.getTranslation(name)}
          floatingLabelStyle={isInvalid ? { color: "red" } : {}}
        >
          {Object.keys(options)
            .sort()
            .map(value => (
              <MenuItem
                key={value}
                value={value}
                primaryText={
                  /[^0-9]/.test(options[value]) && name !== "biWeek"
                    ? this.getTranslation(options[value])
                    : options[value]
                }
              />
            ))}
        </SelectField>
      );
    }
  }

  getNumberOfWeek() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  checkingPeriod(type) {
    if (this.state[type] !== undefined) {
      const currentMonth = new Date().getMonth() + 1;
      if (type === "quarter") {
        if (currentMonth >= 1 && currentMonth <= 3) {
          if (parseInt(this.state[type]) > 1) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 4 && currentMonth <= 6) {
          if (parseInt(this.state[type]) > 2) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 7 && currentMonth <= 9) {
          if (parseInt(this.state[type]) > 3) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 10 && currentMonth <= 12) {
          return true;
        }
      }
      if (type === "sixMonth") {
        if (currentMonth <= 6) {
          if (parseInt(this.state[type]) > 1) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      }
      if (type === "month") {
        if (currentMonth < parseInt(this.state[type])) {
          return false;
        } else {
          return true;
        }
      }
      if (type === "week") {
        if (parseInt(this.getNumberOfWeek()) < parseInt(this.state[type])) {
          return false;
        } else {
          return true;
        }
      }
      if (type === "biMonth") {
        if (currentMonth >= 1 && currentMonth <= 2) {
          if (parseInt(this.state[type]) > 1) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 3 && currentMonth <= 4) {
          if (parseInt(this.state[type]) > 2) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 5 && currentMonth <= 6) {
          if (parseInt(this.state[type]) > 3) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 7 && currentMonth <= 8) {
          if (parseInt(this.state[type]) > 4) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 9 && currentMonth <= 10) {
          if (parseInt(this.state[type]) > 5) {
            return false;
          } else {
            return true;
          }
        }
        if (currentMonth >= 11 && currentMonth <= 12) {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  renderYearPicker() {
    const years = {};
    const currentYear = new Date().getFullYear();
    for (let year = 1970; year <= currentYear; year++) {
      years[year] = year;
    }

    return this.renderOptionPicker("year", years);
  }

  renderMonthPicker() {
    let months = {};
    if (
      this.state.status === false ||
      parseInt(this.state.year) === parseInt(new Date().getFullYear())
    ) {
      const currentMonth = new Date().getMonth() + 1;
      for (let i = 1; i <= currentMonth; i++) {
        if (i < 10) {
          months[`0${i}`] =
            i === 1
              ? "jan"
              : i === 2
              ? "feb"
              : i === 3
              ? "mar"
              : i === 4
              ? "apr"
              : i === 5
              ? "may"
              : i === 6
              ? "jun"
              : i === 7
              ? "jul"
              : i === 8
              ? "aug"
              : i === 9
              ? "sep"
              : "";
        } else {
          months[`${i}`] = i === 10 ? "oct" : i === 11 ? "nov" : i === 12 ? "dec" : "";
        }
      }
    } else {
      months = {
        "01": "jan",
        "02": "feb",
        "03": "mar",
        "04": "apr",
        "05": "may",
        "06": "jun",
        "07": "jul",
        "08": "aug",
        "09": "sep",
        10: "oct",
        11: "nov",
        12: "dec"
      };
    }
    return this.renderOptionPicker("month", months);
  }

  renderWeekPicker() {
    const weeks = {};
    const weekLimit = 53;
    if (
      this.state.status === false ||
      parseInt(this.state.year) === parseInt(new Date().getFullYear())
    ) {
      for (let week = 1; week <= this.getNumberOfWeek(); week++) {
        weeks[`0${week}`.substr(-2)] = week;
      }
    } else {
      for (let week = 1; week <= weekLimit; week++) {
        weeks[`0${week}`.substr(-2)] = week;
      }
    }
    return this.renderOptionPicker("week", weeks);
  }

  renderBiWeekPicker() {
    const biWeeks = {};
    const biWeekLimit = 27;
    const prefix = this.getTranslation("bi_week");
    for (let biWeek = 1; biWeek <= biWeekLimit; biWeek++) {
      biWeeks[`0${biWeek}`.substr(-2)] = `${prefix} ${biWeek}`;
    }

    return this.renderOptionPicker("biWeek", biWeeks);
  }

  renderBiMonthPicker() {
    let biMonths = {};
    const currentMonth = new Date().getMonth() + 1;
    if (
      this.state.status === false ||
      parseInt(this.state.year) === parseInt(new Date().getFullYear())
    ) {
      if (currentMonth >= 1 && currentMonth <= 2) {
        biMonths = { 1: "jan-feb" };
      }
      if (currentMonth >= 3 && currentMonth <= 4) {
        biMonths = { 1: "jan-feb", 2: "mar-apr" };
      }
      if (currentMonth >= 5 && currentMonth <= 6) {
        biMonths = { 1: "jan-feb", 2: "mar-apr", 3: "may-jun" };
      }
      if (currentMonth >= 7 && currentMonth <= 8) {
        biMonths = { 1: "jan-feb", 2: "mar-apr", 3: "may-jun", 4: "jul-aug" };
      }
      if (currentMonth >= 9 && currentMonth <= 10) {
        biMonths = { 1: "jan-feb", 2: "mar-apr", 3: "may-jun", 4: "jul-aug", 5: "sep-oct" };
      }
      if (currentMonth >= 11 && currentMonth <= 12) {
        biMonths = {
          1: "jan-feb",
          2: "mar-apr",
          3: "may-jun",
          4: "jul-aug",
          5: "sep-oct",
          6: "nov-dec"
        };
      }
    } else {
      biMonths = {
        1: "jan-feb",
        2: "mar-apr",
        3: "may-jun",
        4: "jul-aug",
        5: "sep-oct",
        6: "nov-dec"
      };
    }

    return this.renderOptionPicker("biMonth", biMonths);
  }

  renderQuarterPicker() {
    let quarters;
    if (
      this.state.status === false ||
      parseInt(this.state.year) === parseInt(new Date().getFullYear())
    ) {
      const currentMonth = new Date().getMonth() + 1;
      if (currentMonth >= 1 && currentMonth <= 3) {
        quarters = { 1: "Q1" };
      }
      if (currentMonth >= 4 && currentMonth <= 6) {
        quarters = { 1: "Q1", 2: "Q2" };
      }
      if (currentMonth >= 7 && currentMonth <= 9) {
        quarters = { 1: "Q1", 2: "Q2", 3: "Q3" };
      }
      if (currentMonth >= 10 && currentMonth <= 12) {
        quarters = { 1: "Q1", 2: "Q2", 3: "Q3", 4: "Q4" };
      }
    } else {
      quarters = { 1: "Q1", 2: "Q2", 3: "Q3", 4: "Q4" };
    }
    return this.renderOptionPicker("quarter", quarters);
  }

  renderPeriodBasedOnPeriodType() {
    const setDateState = (nothing, date) => {
      const year = getYear(date);
      const month = getTwoDigitMonth(date);
      this.setState({ date, year, month }, this.handleChange);
    };

    switch (this.props.periodType) {
      case "Daily":
        return (
          <DatePicker
            floatingLabelText={this.getTranslation("day")}
            onChange={setDateState}
            autoOk
            container="inline"
            style={styles.datePicker}
            maxDate={new Date()}
          />
        );
      case "Weekly":
      case "WeeklyWednesday":
      case "WeeklyThursday":
      case "WeeklySaturday":
      case "WeeklySunday":
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderWeekPicker()}
          </div>
        );
      case "BiWeekly":
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderBiWeekPicker()}
          </div>
        );
      case "Monthly":
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderMonthPicker()}
          </div>
        );
      case "BiMonthly":
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderBiMonthPicker()}
          </div>
        );
      case "Quarterly":
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderQuarterPicker()}
          </div>
        );
      case "SixMonthly":
        let sixmonth;
        if (
          this.state.status === false ||
          parseInt(this.state.year) === parseInt(new Date().getFullYear())
        ) {
          const currentMonth = new Date().getMonth() + 1;
          if (currentMonth <= 6) {
            sixmonth = { 1: "jan-jun" };
          } else {
            sixmonth = { 1: "jan-jun", 2: "jul-dec" };
          }
        } else {
          sixmonth = { 1: "jan-jun", 2: "jul-dec" };
        }
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderOptionPicker("sixMonth", sixmonth)}
          </div>
        );

      case "SixMonthlyApril":
        let sixmonthApr;
        if (
          this.state.status === false ||
          parseInt(this.state.year) === parseInt(new Date().getFullYear())
        ) {
          const currentMonth = new Date().getMonth() + 1;
          if (currentMonth <= 6) {
            sixmonthApr = { 1: "apr-sep" };
          } else {
            sixmonthApr = { 1: "apr-sep", 2: "oct-mar" };
          }
        } else {
          sixmonthApr = { 1: "apr-sep", 2: "oct-mar" };
        }
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderOptionPicker("sixMonth", sixmonthApr)}
          </div>
        );
      case "SixMonthlyNov":
        let sixmonthNov;
        if (
          this.state.status === false ||
          parseInt(this.state.year) === parseInt(new Date().getFullYear())
        ) {
          const currentMonth = new Date().getMonth() + 1;
          if (currentMonth <= 6) {
            sixmonthNov = { 1: "nov-apr" };
          } else {
            sixmonthNov = { 1: "nov-apr", 2: "may-oct" };
          }
        } else {
          sixmonthNov = { 1: "nov-apr", 2: "may-oct" };
        }
        return (
          <div style={styles.line}>
            {this.renderYearPicker()}
            {this.renderOptionPicker("sixMonth", sixmonthNov)}
          </div>
        );
      case "Yearly":
      case "FinancialApril":
      case "FinancialJuly":
      case "FinancialOct":
        return <div style={styles.line}>{this.renderYearPicker()}</div>;

      default:
        return null;
    }
  }

  render() {
    return this.renderPeriodBasedOnPeriodType();
  }
}
PeriodPicker.propTypes = {
  periodType: PropTypes.oneOf([
    "Daily",
    "Weekly",
    "WeeklyWednesday",
    "WeeklyThursday",
    "WeeklySaturday",
    "WeeklySunday",
    "BiWeekly",
    "Monthly",
    "BiMonthly",
    "Quarterly",
    "SixMonthly",
    "SixMonthlyApril",
    "SixMonthlyNov",
    "Yearly",
    "FinancialApril",
    "FinancialJuly",
    "FinancialOct"
  ]).isRequired,

  onPickPeriod: PropTypes.func.isRequired
};

export default PeriodPicker;

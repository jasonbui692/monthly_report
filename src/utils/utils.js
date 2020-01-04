const sample = (d = [], fn = Math.random) => {
  if (d.length === 0) return;
  return d[Math.round(fn() * (d.length - 1))];
};

const generateUid = (limit = 11, fn = Math.random) => {
  const allowedLetters = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"].join("");
  const allowedChars = ["0123456789", allowedLetters].join("");
  const arr = [sample(allowedLetters, fn)];
  for (let i = 0; i < limit - 1; i++) {
    arr.push(sample(allowedChars, fn));
  }

  return arr.join("");
};

let isLeap = year => new Date(year, 1, 29).getDate() === 29;

const generatePreviousPeriod = (period, periodType) => {
  let array = [];
  if (
    periodType === "Yearly" ||
    periodType === "FinancialApril" ||
    periodType === "FinancialJuly" ||
    periodType === "FinancialOct"
  ) {
    let year = parseInt(period.substring(0, 4));
    for (let i = year - 5; i <= year; i++) {
      if (periodType === "Yearly") {
        array.push(i.toString());
      }
      if (periodType === "FinancialApril") {
        array.push(`${i}April`);
      }
      if (periodType === "FinancialJuly") {
        array.push(`${i}July`);
      }
      if (periodType === "FinancialOct") {
        array.push(`${i}Oct`);
      }
    }
  }
  if (periodType === "Monthly") {
    let currentMonth = parseInt(period.substring(4, 6));
    let currentYear = parseInt(period.substring(0, 4)) - 1;
    let currentDate = new Date(`${currentYear}-${currentMonth}`);
    let aMonth = currentDate.getMonth();
    for (let i = 0; i <= 12; i++) {
      aMonth++;
      if (aMonth > 11) {
        aMonth = 0;
      }
      if (aMonth === 0) {
        array.push(`${currentYear}12`);
        currentYear = currentYear + 1;
      } else {
        array.push(`${currentYear}${aMonth < 10 ? `0${aMonth}` : aMonth}`);
      }
    }
  }
  if (periodType === "Quarterly") {
    let currentQuarterly = period.substring(4, 6);
    let currentYear = parseInt(period.substring(0, 4));
    for (let i = currentYear - 3; i <= currentYear; i++) {
      if (i === currentYear && currentQuarterly !== "Q4") {
        if (currentQuarterly === "Q1") {
          array.push(`${i}Q1`);
        }
        if (currentQuarterly === "Q2") {
          array.push(`${i}Q1`);
          array.push(`${i}Q2`);
        }
        if (currentQuarterly === "Q3") {
          array.push(`${i}Q1`);
          array.push(`${i}Q2`);
          array.push(`${i}Q3`);
        }
      } else {
        if (i === currentYear - 3 && currentQuarterly !== "Q1") {
          if (currentQuarterly === "Q4") {
            array.push(`${i}Q4`);
          }
          if (currentQuarterly === "Q3") {
            array.push(`${i}Q3`);
            array.push(`${i}Q4`);
          }
          if (currentQuarterly === "Q2") {
            array.push(`${i}Q2`);
            array.push(`${i}Q3`);
            array.push(`${i}Q4`);
          }
        } else {
          array.push(`${i}Q1`);
          array.push(`${i}Q2`);
          array.push(`${i}Q3`);
          array.push(`${i}Q4`);
        }
      }
    }
  }
  if (
    periodType === "SixMonthly" ||
    periodType === "SixMonthlyApril" ||
    periodType === "SixMonthlyNov"
  ) {
    let currentSixMonthly;
    let middle = "";
    if (periodType === "SixMonthly") {
      currentSixMonthly = period.substring(4, 6);
    }
    if (periodType === "SixMonthlyApril") {
      currentSixMonthly = period.substring(9, 11);
      middle = "April";
    }
    if (periodType === "SixMonthlyNov") {
      currentSixMonthly = period.substring(7, 9);
      middle = "Nov";
    }
    let currentYear = parseInt(period.substring(0, 4));
    for (let i = currentYear - 6; i <= currentYear; i++) {
      if (i === currentYear && currentSixMonthly !== "S2") {
        array.push(`${i}${middle}S1`);
      } else {
        if (i === currentYear - 6 && currentSixMonthly !== "S1") {
          array.push(`${i}${middle}S2`);
        } else {
          array.push(`${i}${middle}S1`);
          array.push(`${i}${middle}S2`);
        }
      }
    }
  }

  if (
    periodType === "Weekly" ||
    periodType === "WeeklyWednesday" ||
    periodType === "WeeklyThursday" ||
    periodType === "WeeklySaturday" ||
    periodType === "WeeklySunday"
  ) {
    let currentWeek;
    let middle = "";
    if (periodType === "Weekly") {
      currentWeek = parseInt(period.substring(5, 7));
    }
    if (periodType === "WeeklyWednesday") {
      currentWeek = parseInt(period.substring(7, 10));
      middle = "Wed";
    }
    if (periodType === "WeeklyThursday") {
      currentWeek = parseInt(period.substring(7, 10));
      middle = "Thu";
    }
    if (periodType === "WeeklySaturday") {
      currentWeek = parseInt(period.substring(7, 10));
      middle = "Sat";
    }
    if (periodType === "WeeklySunday") {
      currentWeek = parseInt(period.substring(7, 10));
      middle = "Sun";
    }
    let currentYear = parseInt(period.substring(0, 4));
    for (let i = 12; i >= 0; i--) {
      if (currentWeek - i === 0) {
        if (isLeap(currentYear) === true) {
          array.push(`${currentYear - 1}${middle}W53`);
        } else {
          array.push(`${currentYear - 1}${middle}W52`);
        }
      } else {
        if (currentWeek - i < 0) {
          let count = currentWeek - i;
          let week;
          if (isLeap(currentYear) === true) {
            week = 53;
          } else {
            week = 52;
          }
          array.push(
            `${currentYear - 1}${middle}W${week + count < 10 ? `0${week + count}` : week + count}`
          );
        } else {
          array.push(
            `${currentYear}${middle}W${
              currentWeek - i < 10 ? `0${currentWeek - i}` : currentWeek - i
            }`
          );
        }
      }
    }
  }
  if (periodType === "Daily") {
    for (let i = 12; i >= 0; i--) {
      let currentDate = new Date(
        `${period.substring(0, 4)}-${period.substring(4, 6)}-${period.substring(6, 8)}`
      );
      let date = new Date(currentDate.setDate(currentDate.getDate() - i));
      array.push(
        `${date.getFullYear()}${
          date.getMonth + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        }${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`
      );
    }
  }
  if (periodType === "BiMonthly") {
    let currentMonth = parseInt(period.substring(4, 6));
    let currentYear = parseInt(period.substring(0, 4));
    for (let i = currentYear - 2; i <= currentYear; i++) {
      if (i === currentYear && currentMonth !== 6) {
        for (let y = 1; y <= currentMonth; y++) {
          array.push(`${i}0${y}B`);
        }
      } else {
        if (i === currentYear - 2 && currentMonth !== 1) {
          for (let y = currentMonth; y <= 6; y++) {
            array.push(`${i}0${y}B`);
          }
        } else {
          for (let y = 1; y <= 6; y++) {
            array.push(`${i}0${y}B`);
          }
        }
      }
    }
  }
  return array;
};

export { generateUid, generatePreviousPeriod };

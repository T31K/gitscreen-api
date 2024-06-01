import moment from "moment";
function getTotal(contributionsData) {
  let total = 0;

  contributionsData?.contributions?.forEach((contribution) => {
    total += contribution.count;
  });

  return total;
}

function getMedian(contributionsData) {
  let totalContributions = 0;
  let totalDaysWithContributions = 0;

  contributionsData?.contributions?.forEach((contribution) => {
    totalContributions += contribution.count;
    if (contribution.count > 0) {
      totalDaysWithContributions++;
    }
  });

  let median =
    totalDaysWithContributions > 0
      ? totalContributions / totalDaysWithContributions
      : 0;
  return median;
}

function getStreak(contributionsData) {
  let currentStreak = 0;
  let longestStreak = 0;

  contributionsData?.contributions?.forEach((contribution) => {
    if (contribution.count > 0) {
      // Increment the current streak if the count is greater than 0
      currentStreak++;
      // Update the longest streak if the current streak is longer
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      // Reset the current streak if the count is 0
      currentStreak = 0;
    }
  });

  return longestStreak;
}

function getMostActiveDay(contributionsData) {
  // Hard-coded mapping of index to day of the week, assuming January 1st is a Monday
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  let mostActiveDay = "";
  let highestCount = 0;

  contributionsData?.contributions
    ?.slice(0, 31)
    .forEach((contribution, index) => {
      if (contribution.count > highestCount) {
        highestCount = contribution.count;
        mostActiveDay = daysOfWeek[index % 7];
      }
    });

  return mostActiveDay;
}

function getMissedDays(contributionsData) {
  let missedDaysCount = 0;

  contributionsData?.contributions?.slice(0, 31).forEach((contribution) => {
    if (contribution.count === 0) {
      missedDaysCount++;
    }
  });

  return missedDaysCount;
}
function processWeeklyBarChart(contributionsData) {
  // Initialize sums for each day of the week
  const daySums = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  };

  // Define the days of the week for indexing
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Iterate over each contribution
  contributionsData?.contributions
    ?.slice(0, 31)
    .forEach((contribution, index) => {
      // Determine the day of the week
      const dayOfWeek = daysOfWeek[index % 7];
      // Sum the counts for each day of the week
      daySums[dayOfWeek] += contribution.count;
    });

  // Convert the sums into an array suitable for the BarChart
  const barChartData = Object.keys(daySums).map((day) => ({
    subject: day.slice(0, 2),
    A: daySums[day],
    label: day,
  }));

  return barChartData;
}

function getHighest(contributionsData) {
  let highest = 0;

  contributionsData?.contributions?.forEach((contribution) => {
    if (contribution.count > highest) highest = contribution.count;
  });

  return highest;
}

function processMonthlyChart(contributionsData) {
  const numberOfDaysInJanuary = 31;

  const monthlyContributions = contributionsData?.contributions
    ?.slice(0, numberOfDaysInJanuary)
    .map((contribution, index) => {
      // Convert day number to a date in January using moment.js
      const dateOfMonth = moment("2024-01-01")
        .add(index, "days")
        .format("MMMM Do");

      // Format the data suitable for an area chart
      return {
        name: dateOfMonth, // Use the date of the month as the name
        count: contribution.count,
      };
    });

  // If the month is not complete (less than 31 days), fill in the remaining days
  while (monthlyContributions?.length < numberOfDaysInJanuary) {
    const dateOfMonth = moment("2024-01-01")
      .add(monthlyContributions.length, "days")
      .format("MMMM Do");
    monthlyContributions.push({ name: dateOfMonth, count: 0 });
  }

  return monthlyContributions;
}

function generateRank(contributionsData) {
  // Define weights for each criterion
  const weights = {
    total: 0.2,
    consistency: 0.2,
    streak: 0.2,
    median: 0.2,
    activitySpread: 0.1,
    weekendBonus: 0.1,
  };

  // Normalizing function for total contributions
  const normalizeTotal = (total) => {
    const averageRange = 90; // Midpoint of 80-100
    return total / averageRange;
  };

  // Calculate normalized scores
  let totalScore =
    Math.min(normalizeTotal(getTotal(contributionsData)), 1) * weights.total;
  let consistencyScore =
    (getMedian(contributionsData) > 0 ? 1 : 0) * weights.consistency;
  let streakScore =
    Math.min(getStreak(contributionsData) / 31, 1) * weights.streak; // Normalize to max 1
  let medianScore =
    Math.min(getMedian(contributionsData) / 20, 1) * weights.median; // Assuming max median is around 20
  let activitySpreadScore =
    (1 - getMissedDays(contributionsData) / 31) * weights.activitySpread;

  // Apply weekend bonus
  const mostActiveDay = getMostActiveDay(contributionsData);
  const weekendDays = ["Saturday", "Sunday"];
  let weekendBonus = weekendDays.includes(mostActiveDay)
    ? weights.weekendBonus
    : 0;

  // Calculate the final score
  let finalScore =
    totalScore +
    consistencyScore +
    streakScore +
    medianScore +
    activitySpreadScore +
    weekendBonus;

  // Map the score to a rank
  let rank = Math.min(Math.ceil(finalScore * 50), 50); // Ensuring the rank does not exceed 50

  if (rank == 0) return 1;
  else return rank * 2;
}

export {
  getHighest,
  getTotal,
  getMedian,
  getStreak,
  getMostActiveDay,
  getMissedDays,
  processMonthlyChart,
  processWeeklyBarChart,
  generateRank,
};

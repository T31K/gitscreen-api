"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IconArrowNarrowDown } from "@tabler/icons-react";

import {
  getHighest,
  getMissedDays,
  getMedian,
  getMostActiveDay,
  getStreak,
  getTotal,
  processMonthlyChart,
  processWeeklyBarChart,
  generateRank,
} from "@/lib/helpers";
import { tailwindColors } from "@/lib/constants";

const Home = () => {
  const [contributionsData, setContributionsData] = useState([]);
  const [stats, setStats] = useState({ streak: 0, highest: 0, median: 0 });
  const searchParams = useSearchParams();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (contributionsData.length > 0) {
      generateStats(contributionsData);
    }
  }, [contributionsData]);

  const getData = async () => {
    try {
      const year = searchParams.get("year") || "2024";
      const username = searchParams.get("username") || "t31k";
      const res = await axios.get(
        `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`
      );
      setContributionsData(res.data);
    } catch (error) {
      if (error.code === "ERR_BAD_REQUEST") {
        // toast("User doesn't exist. Try again!");
      }
    }
  };

  const generateStats = (contributionsData) => {
    let highest = getHighest(contributionsData);
    let median = getMedian(contributionsData);
    let streak = getStreak(contributionsData);
    let total = getTotal(contributionsData);
    let mostActiveDay = getMostActiveDay(contributionsData);
    let missedDays = getMissedDays(contributionsData);
    let monthlyChart = processMonthlyChart(contributionsData);
    let weeklyBar = processWeeklyBarChart(contributionsData);
    let rank = generateRank(contributionsData);

    setStats({
      highest,
      median,
      streak,
      monthlyChart,
      total,
      rank,
      mostActiveDay,
      missedDays,
      weeklyBar,
    });
  };

  const getColor = (activeColor, count) => {
    if (count === 0) return "#fff"; // bg-gray-200
    if (count <= 4) return tailwindColors[activeColor][200];
    if (count <= 10) return tailwindColors[activeColor][400];
    if (count <= 20) return tailwindColors[activeColor][600];
    return tailwindColors[activeColor][800];
  };

  if (!contributionsData?.contributions) return null;

  const colorScheme = searchParams.get("color_scheme") || "emerald";
  const darkMode = searchParams.get("theme") === "dark";
  const showDayLabels = searchParams.get("day_labels") !== "hide";
  const showPointer = searchParams.get("current_week_pointer") !== "hide";

  const startOffsets = {
    0: 0, // Sunday
    1: 1, // Monday
    2: 2, // Tuesday
    3: 3, // Wednesday
    4: 4, // Thursday
    5: 5, // Friday
    6: 6, // Saturday
  };

  const firstDayOfWeek = new Date(
    contributionsData?.contributions[0]?.date
  ).getDay();
  const emptySquares = startOffsets[firstDayOfWeek];
  const emptySquaresRender = Array.from(
    { length: emptySquares },
    (_, index) => (
      <div
        key={`empty-${index}`}
        className="w-[20px] h-[20px] rounded-[7px]"
      ></div>
    )
  );

  const contributionSquaresRender = contributionsData?.contributions?.map(
    (day, dayIndex) => {
      const date = new Date(day.date);
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const color = getColor(colorScheme, day.count);

      return (
        <>
          <div
            key={dayIndex}
            style={{
              backgroundColor: color,
              width: "20px",
              height: "20px",
              borderRadius: "7px",
            }}
          ></div>
          {isToday && showPointer && (
            <IconArrowNarrowDown
              className="absolute top-[-22px] left-1/2 translate-x-[-50%]"
              size={18}
            />
          )}
        </>
      );
    }
  );

  const missingDotsRender = Array.from({ length: 4 }, (_, index) => (
    <div
      key={`missing-${index}`}
      style={{
        backgroundColor: "transparent",
        width: "20px",
        height: "20px",
        borderRadius: "7px",
      }}
    ></div>
  ));

  const allSquares = [
    ...emptySquaresRender,
    ...contributionSquaresRender,
    ...missingDotsRender,
  ];

  const rows = [];
  for (let i = 0; i < allSquares.length; i += 7) {
    const weekSquares = allSquares.slice(i, i + 7);
    rows.push(
      <div key={`week-${i}`} className="flex flex-col gap-1 relative">
        {weekSquares}
      </div>
    );
  }

  return (
    <div
      className={`flex gap-1 h-screen w-screen justify-center items-center ${
        darkMode ? "bg-slate-800" : "bg-slate-300"
      }`}
    >
      <div className="flex">
        {showDayLabels && (
          <div className="flex flex-col gap-1 mr-3">
            <div className="h-[20px] text-slate-800 font-mono font-semibold">
              S
            </div>
            <div className="h-[20px] text-slate-800 font-mono font-semibold">
              M
            </div>
            <div className="h-[20px] text-slate-800 font-mono font-semibold">
              T
            </div>
            <div className="h-[20px] text-slate-800 font-mono font-semibold">
              W
            </div>
            <div className="h-[20px] text-slate-800 font-mono font-semibold">
              T
            </div>
            <div className="h-[20px] text-slate-800 font-mono font-semibold">
              F
            </div>
            <div className="h-[20px] text-slate-800 font-mono font-semibold">
              S
            </div>
          </div>
        )}
        <div className="flex gap-1 h-full justify-center items-center">
          {rows}
        </div>
      </div>
    </div>
  );
};

export default Home;

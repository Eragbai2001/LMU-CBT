import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function ProgressChart() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  } | null>(null);

  useEffect(() => {
    // Fake test data
    const fakeData = [
      { date_taken: "Sun", score: 75, time_spent: 10 },
      { date_taken: "Mon", score: 60, time_spent: 15 },
      { date_taken: "Tue", score: 80, time_spent: 12 },
      { date_taken: "Wed", score: 90, time_spent: 8 }, // Active day
      { date_taken: "Thu", score: 70, time_spent: 14 },
      { date_taken: "Fri", score: 85, time_spent: 9 },
      { date_taken: "Sat", score: 65, time_spent: 11 },
    ];

    const labels = fakeData.map((item) => item.date_taken);
    const scores = fakeData.map((item) => item.score);
    const times = fakeData.map((item) => item.time_spent);

    setChartData({
      labels,
      datasets: [
        {
          label: "Test Score (%)",
          data: scores,
          borderColor: "#EC4899",
          backgroundColor: "rgba(236, 72, 153, 0.2)",
          fill: true,
        },
        {
          label: "Time Spent (mins)",
          data: times,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          fill: true,
        },
      ],
    });
  }, []);

  return (
    <div className="w-[50rem]">
      <h2 className="text-xl font-bold mb-2">Weekly Test Progress</h2>
      {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
      <p className="mt-4 text-lg font-semibold">Total Time Spent: 79 mins</p>
    </div>
  );
}

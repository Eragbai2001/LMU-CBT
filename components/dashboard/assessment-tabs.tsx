import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ProgressChart() {
  const [chartData, setChartData] = useState<any>(null);

  // Use fake data for now
  useEffect(() => {
    // Fake data example:
    const fakeData = [
      { date_taken: "2025-01-01", result: "pass" },
      { date_taken: "2025-01-15", result: "fail" },
      { date_taken: "2025-02-01", result: "pass" },
      { date_taken: "2025-02-15", result: "pass" },
      { date_taken: "2025-03-01", result: "fail" },
      { date_taken: "2025-03-15", result: "pass" },
    ];

    // Process fake data to fit chart format
    const dates = fakeData.map((item) => item.date_taken);
    const passRates = fakeData.map((item) => (item.result === "pass" ? 100 : 0));

    setChartData({
      labels: dates,
      datasets: [
        {
          label: "Test Pass Rate (%)",
          data: passRates,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    });
  }, []);

  return (
    <div>
      <h2>Your Test Progress</h2>
      {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
    </div>
  );
}

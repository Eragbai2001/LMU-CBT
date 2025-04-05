import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Card } from '../ui/card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WeeklyProgressBarChart = () => {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor: string; borderColor: string; borderWidth: number }[];
  } | null>(null);

  useEffect(() => {
    // Sample data - replace with your actual data
    const fakeData = [
      { day: 'Sun', score: 70, time_spent: 10 },
      { day: 'Mon', score: 60, time_spent: 15 },
      { day: 'Tue', score: 80, time_spent: 12 },
      { day: 'Wed', score: 90, time_spent: 8 },
      { day: 'Thu', score: 70, time_spent: 14 },
      { day: 'Fri', score: 85, time_spent: 9 },
      { day: 'Sat', score: 65, time_spent: 11 }
    ];

    const labels = fakeData.map((item) => item.day);
    const scores = fakeData.map((item) => item.score);
    const times = fakeData.map((item) => item.time_spent);

    setChartData({
      labels,
      datasets: [
        {
          label: "Test Score (%)",
          data: scores,
          backgroundColor: "#EC4899",
          borderColor: "#EC4899",
          borderWidth: 1,
        },
        {
          label: "Time Spent (mins)",
          data: times,
          backgroundColor: "#3B82F6",
          borderColor: "#3B82F6",
          borderWidth: 1,
        },
      ],
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)"
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    }
  };

  return (
    <Card className="col-span-1 p-4 lg:col-span-2">
      <h1 className="text-2xl font-bold mb-6">Weekly Test Progress</h1>
      <div className="h-64 md:h-96 w-full">
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="mt-4 text-gray-700">
        Total Time Spent: 79 mins
      </div>
    </Card>
  );
};

export default WeeklyProgressBarChart;
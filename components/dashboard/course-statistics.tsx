import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CourseStatistics = () => {
  const totalCourses = 22;

  const data = [
    { name: "Incompleted", value: 40, color: "#EF4444" },
    { name: "Completed", value: 30, color: "#4F46E5" },
    { name: "In progress", value: 20, color: "#06B6D4" },
  ];

  // Calculate the remaining percentage (if any)
  const totalPercentage = data.reduce((acc, item) => acc + item.value, 0);
  if (totalPercentage < 100) {
    data.push({
      name: "Unassigned",
      value: 100 - totalPercentage,
      color: "#E5E7EB",
    });
  }

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: { payload: { name: string; value: number } }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-2 shadow-md rounded border border-gray-200 dark:border-gray-700 dark:text-white">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {data.value}% ({Math.round((data.value * totalCourses) / 100)}{" "}
            courses)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className=" flex flex-col items-center ">
      <h3 className="text-lg font-semibold  flex justify-center">
        Course Statistics
      </h3>

      <div className="flex flex-col md:flex-row items-center">
        <div className="w-96 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="flex flex-col mt-6 md:mt-0  w-full max-w-xs ">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold">{totalCourses}</div>
          <div className="text-sm text-gray-500">Total Courses</div>
        </div>

        <div className="space-y-3">
          {data.map(
            (item, index) =>
              item.name !== "Unassigned" && (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded ">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{item.value}%</span>
                    <span className="text-xs text-gray-500">
                      ({Math.round((item.value * totalCourses) / 100)})
                    </span>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseStatistics;

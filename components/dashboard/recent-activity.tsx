export default function   RecentActivity() {
  // Placeholder data - replace with actual activity data
  const activities = [
    {
      id: 1,
      type: "assessment",
      description: "Completed 'Introduction to Python' assessment.",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "milestone",
      description: "Reached 'Module 3 Complete' milestone.",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "forum",
      description: "New post in 'Advanced Algorithms' discussion.",
      time: "3 days ago",
    },
  ];

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white h-full dark:bg-gray-800/80">
      <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
      <ul className="space-y-3">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {/* Basic icon based on type - can be enhanced */}
              {
                activity.type === "assessment" && (
                  <span className="text-blue-500">&#128221;</span>
                ) /* Document icon */
              }
              {
                activity.type === "milestone" && (
                  <span className="text-green-500">&#127942;</span>
                ) /* Trophy icon */
              }
              {
                activity.type === "forum" && (
                  <span className="text-purple-500">&#128172;</span>
                ) /* Speech bubble icon */
              }
            </div>
            <div className="flex-1">
              <p className="text-sm ">{activity.description}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </li>
        ))}
        {activities.length === 0 && (
          <p className="text-sm text-gray-500">No recent activity.</p>
        )}
      </ul>
    </div>
  );
}

import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

export const Card = ({ title, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 md:p-6 ${className}`}>
      {title && (
        <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  change,
  icon,
  color = "blue",
  show = true,
}) => {
  if (!show) return null;

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-xs md:text-sm font-medium text-gray-500">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
        </div>
        <div
          className={`h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
      {change && (
        <p
          className={`mt-1 md:mt-2 text-xs md:text-sm ${
            change.startsWith("+") ? "text-green-600" : "text-red-600"
          }`}
        >
          <ArrowTrendingUpIcon
            className={`inline h-3 w-3 md:h-4 md:w-4 ${
              change.startsWith("+") ? "text-green-500" : "text-red-500"
            }`}
          />
          {change} from last week
        </p>
      )}
    </div>
  );
};

export const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      action: "Updated student records",
      time: "2 hours ago",
      user: "You",
    },
    {
      id: 2,
      action: "Processed 5 payments",
      time: "4 hours ago",
      user: "Jane Doe",
    },
    { id: 3, action: "Added new admin user", time: "1 day ago", user: "You" },
    {
      id: 4,
      action: "Modified department settings",
      time: "2 days ago",
      user: "John Smith",
    },
  ];

  return (
    <Card title="Recent Activity">
      <ul className="space-y-3 md:space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-start">
            <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-blue-500"></div>
            <div className="ml-3">
              <p className="text-xs md:text-sm font-medium">
                {activity.action}
              </p>
              <p className="text-xs text-gray-500">
                {activity.user} • {activity.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};

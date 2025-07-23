import React from "react";
import {
  Clock,
  CurrencyDollar as CashStack,
  Calendar3 as Calendar,
  Person as User,
  InfoCircle,
} from "react-bootstrap-icons";

const ShiftTime = () => {
  const shiftData = {
    categories: [
      {
        name: "Day Shift",
        icon: <Clock className="text-yellow-500" size={20} />,
        shifts: [
          {
            name: "Morning Session",
            timing: "6:00 AM - 1:00 PM",
            fee: "₹500",
            description: "Ideal for early risers",
            capacity: "30 students max",
            features: ["Break at 10:00 AM", "Library access included"],
          },
          {
            name: "Afternoon Session",
            timing: "1:00 PM - 8:00 PM",
            fee: "₹500",
            description: "Perfect for post-lunch learning",
            capacity: "30 students max",
            features: ["Break at 4:00 PM", "Computer lab access"],
          },
          {
            name: "Full Day",
            timing: "8:00 AM - 5:00 PM",
            fee: "₹800",
            description: "Comprehensive learning experience",
            capacity: "20 students max",
            features: ["Lunch break included", "All facilities access"],
          },
        ],
      },
      {
        name: "Night Shift",
        icon: <Clock className="text-indigo-500" size={20} />,
        shifts: [
          {
            name: "Evening Session",
            timing: "8:00 PM - 1:00 AM",
            fee: "₹400",
            description: "For night owls",
            capacity: "25 students max",
            features: ["Snack break at 10:30 PM", "Quiet study zone"],
          },
          {
            name: "Late Night Session",
            timing: "1:00 AM - 6:00 AM",
            fee: "₹400",
            description: "Deep focus hours",
            capacity: "20 students max",
            features: ["24/7 security", "Coffee/tea available"],
          },
          {
            name: "Full Night",
            timing: "8:00 PM - 6:00 AM",
            fee: "₹700",
            description: "Extended learning session",
            capacity: "15 students max",
            features: ["Overnight facilities", "Dedicated tutor support"],
          },
        ],
      },
    ],
    notes: [
      "All shifts include access to digital resources",
      "Early registration discounts available",
      "Special rates for monthly packages",
    ],
  };

  const renderShiftCard = (shift) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-start mb-4">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <Clock className="text-blue-600" size={18} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{shift.name}</h3>
            <p className="text-gray-500 text-sm">{shift.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <Calendar className="text-gray-400 mr-2" size={16} />
            <span className="text-gray-700">{shift.timing}</span>
          </div>

          <div className="flex items-center">
            <CashStack className="text-gray-400 mr-2" size={16} />
            <span className="text-gray-700 font-medium">{shift.fee}</span>
          </div>

          <div className="flex items-center">
            <User className="text-gray-400 mr-2" size={16} />
            <span className="text-gray-700 text-sm">{shift.capacity}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-500 mb-2">
            FEATURES:
          </h4>
          <ul className="space-y-1">
            {shift.features.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                <span className="text-gray-600 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
          Register for this Shift
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl px-4 py-12 mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Study Shift Schedule
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the learning session that fits your schedule and preferences
        </p>
      </div>

      <div className="space-y-16">
        {shiftData.categories.map((category, index) => (
          <div key={index}>
            <div className="flex items-center mb-8">
              <div className="mr-3 p-2 bg-blue-100 rounded-lg">
                {category.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                {category.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.shifts.map((shift, idx) => (
                <div key={idx}>{renderShiftCard(shift)}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 rounded-xl p-6">
        <h3 className="flex items-center text-lg font-semibold text-gray-800 mb-4">
          <InfoCircle className="text-blue-500 mr-2" size={20} />
          Important Notes
        </h3>
        <ul className="space-y-2">
          {shiftData.notes.map((note, i) => (
            <li key={i} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShiftTime;

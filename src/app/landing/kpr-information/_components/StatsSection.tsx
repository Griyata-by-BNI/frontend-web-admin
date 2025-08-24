import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { STATS } from "../_constants";

export const StatsSection = () => (
  <div className="py-10 bg-white">
    <div className="mx-auto max-w-4xl px-4">
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row justify-around items-center space-y-6 md:space-y-0 md:space-x-6">
        {STATS.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center text-center">
              <FontAwesomeIcon
                icon={stat.icon}
                className="text-teal-500 text-3xl mb-2"
              />
              <p className="text-2xl font-bold text-gray-800">{stat.number}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
            {index < STATS.length - 1 && (
              <div className="w-full h-px bg-gray-200 md:w-px md:h-16"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);

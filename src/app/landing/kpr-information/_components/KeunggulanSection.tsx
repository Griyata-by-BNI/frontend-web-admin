import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BENEFITS } from "../_constants";

export const KeunggulanSection = () => (
  <div className="bg-white pt-10 pb-6 px-4">
    <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
      Keunggulan Griyata
    </h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      {BENEFITS.map((benefit, index) => (
        <div
          key={index}
          className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center border border-gray-200"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
            <FontAwesomeIcon
              icon={benefit.icon}
              className="text-teal-500 text-2xl"
            />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm mb-1">
            {benefit.title}
          </h3>
          <p className="text-xs text-gray-600">{benefit.description}</p>
        </div>
      ))}
    </div>
  </div>
);

import React from 'react';

// Card Component
export const Card = ({ children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {children}
    </div>
  );
};

// CardHeader Component
export const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`border-b pb-2 mb-4 ${className}`}>
      {children}
    </div>
  );
};

// CardContent Component
export const CardContent = ({ children }) => {
  return (
    <div className="text-gray-700">
      {children}
    </div>
  );
};
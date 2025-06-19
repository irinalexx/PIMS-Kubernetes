import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white shadow rounded ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`border-b p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h2 className={`text-lg font-bold ${className}`} {...props}>
      {children}
    </h2>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card; 
import React from 'react';

export const Select = ({ children, ...props }) => {
  return (
    <select className="border rounded p-2" {...props}>
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children, ...props }) => {
  return (
    <div className="relative">
      <button className="border rounded p-2 w-full text-left" {...props}>
        {children}
      </button>
    </div>
  );
};

export const SelectContent = ({ children }) => {
  return <div className="absolute bg-white shadow rounded mt-1">{children}</div>;
};

export const SelectItem = ({ children, ...props }) => {
  return (
    <div className="p-2 hover:bg-gray-100 cursor-pointer" {...props}>
      {children}
    </div>
  );
};

export const SelectValue = ({ placeholder }) => {
  return <span>{placeholder}</span>;
};

export default Select; 
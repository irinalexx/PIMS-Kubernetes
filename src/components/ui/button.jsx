import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', ...props }) => {
  const baseStyle = 'px-4 py-2 rounded focus:outline-none';
  const variants = {
    primary: 'bg-blue-600 text-gray-700 hover:bg-blue-700',
    secondary: 'bg-gray-600 text-gray-700 hover:bg-gray-700',
    destructive: 'bg-red-600 text-gray-700 hover:bg-red-700',
    outline: 'border border-gray-600 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 
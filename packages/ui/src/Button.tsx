import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => {
  const baseStyle = "px-4 py-2 rounded-xl transition-all duration-200 font-medium active:scale-95";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/30",
    secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/10"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className || ''}`}
      {...props}
    />
  );
};

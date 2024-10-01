import React, { ReactNode } from "react";
import styles from "./button.module.css";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  className?: string; // New prop for additional custom classes
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className, // New prop
}) => {
  const buttonClass = clsx(
    styles.button,
    styles[variant],
    disabled && styles.disabled,
    className // Allow custom classes
  );

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

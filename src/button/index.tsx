import React from 'react'

export interface ButtonProps {
  children: any;
  type: 'primary';
}

const Button: React.FC<ButtonProps> = ({ children, type }) => {
  return <button className={`btn btn-${type}`}>New Button {children}</button>;
};

export default Button;

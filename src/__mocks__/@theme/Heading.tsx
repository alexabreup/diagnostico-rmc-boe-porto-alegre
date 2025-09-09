import React from 'react';

interface HeadingProps {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  [key: string]: any;
}

const Heading: React.FC<HeadingProps> = ({ as: Component = 'h1', children, ...props }) => {
  return React.createElement(Component, props, children);
};

export default Heading;
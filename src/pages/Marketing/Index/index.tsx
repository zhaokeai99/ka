import React from 'react';

const Index: React.FC = (props) => {
  const { children } = props;
  return <div className="none-select">{children}</div>;
};

export default Index;

import { useEffect, useState } from 'react';

const ColorSpan = ({ value, suffix = '' }: { value: number | string; suffix?: string }) => {
  const [color, setColor] = useState('rgba(0, 0, 0, 0.85)');

  useEffect(() => {
    if (value > 0) {
      setColor('#E64552');
    } else if (value < 0) {
      setColor('#40B333');
    } else {
      setColor('rgba(0,0,0,0.65)');
    }
  }, [value]);

  return (
    <span style={{ color }}>
      {value}
      {suffix}
    </span>
  );
};

export default ColorSpan;

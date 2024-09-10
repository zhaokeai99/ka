import { memo } from 'react';
import Demo4 from './banner';

interface ModalProps {
  canvasWidth: number;
  canvasHeight: number;
  particleLength?: number;
  particleMaxRadius?: number;
  style: any;
}
const FormBackground = (props: ModalProps) => {
  const { style, canvasWidth, canvasHeight } = props;
  return <Demo4 style={style} canvasWidth={canvasWidth} canvasHeight={canvasHeight} />;
};

export default memo(FormBackground);

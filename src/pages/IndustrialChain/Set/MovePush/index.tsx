import React from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes';
import MoveIndex from './components/MoveIndex';
import MoveOpinions from './components/MoveOpinions';

const MovePush = () => {
  return (
    <ProCardPlus
      ghost
      sn={'_industrialChain_Set__Menu___MovePush'}
      size="small"
      direction="column"
      gutter={[cardGutter, cardGutter]}
      style={{ padding: contentPadding }}
    >
      <MoveIndex />
      <MoveOpinions />
    </ProCardPlus>
  );
};

export default MovePush;

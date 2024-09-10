import { cardGutter } from '@/themes/index';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { memo, useContext, useState } from 'react';
import { IndustryProvider } from '../service';

const Header = () => {
  const { industryName } = useContext(IndustryProvider);
  const [focus, setFocus] = useState(false);

  const handleFocus = () => {
    setFocus(!focus);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: cardGutter,
      }}
    >
      <span style={{ fontSize: 18, marginRight: 12 }}>{industryName}</span>
      {focus ? (
        <StarFilled style={{ fontSize: 20, color: '#FAAD14' }} onClick={handleFocus} />
      ) : (
        <StarOutlined style={{ fontSize: 20 }} onClick={handleFocus} />
      )}
      <Button style={{ marginLeft: 'auto', marginRight: 0 }} type="primary">
        行业切换
      </Button>
    </div>
  );
};

export default memo(Header);

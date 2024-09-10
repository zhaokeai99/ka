import { StarFilled, StarOutlined } from '@ant-design/icons';
import { focusOn } from '../service';

function FocusOn({ fundId, isFocus, onRefresh }: any) {
  const handleFocus = async () => {
    await focusOn({ fundId });
    onRefresh();
  };

  if (isFocus) {
    return <StarFilled style={{ fontSize: 18, color: '#FAAD14' }} onClick={handleFocus} />;
  }

  return <StarOutlined style={{ fontSize: 18, color: '#999' }} onClick={handleFocus} />;
}

export default FocusOn;

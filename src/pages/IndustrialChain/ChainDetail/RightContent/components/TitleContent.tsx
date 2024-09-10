import { Divider, List } from 'antd';
import { TopContentProps } from './Indicators/service';

// 指标标题
const TopContent = (props: TopContentProps) => {
  return (
    <div className="top-content">
      <List
        itemLayout="horizontal"
        dataSource={props.data}
        renderItem={({ title, description }: any) => (
          <List.Item>
            <List.Item.Meta title={title} description={description} />
          </List.Item>
        )}
      />
      <Divider style={{ marginTop: 0 }} />
    </div>
  );
};

export default TopContent;

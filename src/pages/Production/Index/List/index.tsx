import { Divider } from 'antd';
import { ExportOutlined } from '@ant-design/icons';

const TopicList = (props: any) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '320px',
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
      }}
    >
      {props.data &&
        props.data.map((item: any, index: number) => (
          <div key={`${item.head}-${index}`}>
            <h4>
              {item.linkUrl ? (
                <a href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                  {item.head}
                  <ExportOutlined style={{ marginLeft: '5px' }} />
                </a>
              ) : (
                item.head
              )}
            </h4>
            <p>{item.body}</p>
            <h6>{item.foot}</h6>
            <Divider />
          </div>
        ))}
    </div>
  );
};

export default TopicList;

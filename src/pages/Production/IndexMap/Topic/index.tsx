import { history } from 'umi';
import { Alert } from 'antd';
import { TextLoop } from 'react-text-loop-next';

export default function ({ topics, title }: any) {
  if (!Array.isArray(topics) || topics.length === 0) {
    return null;
  }

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      <Alert
        style={{
          width: '100%',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
        banner
        icon={<span>{title}:</span>}
        message={
          <TextLoop mask>
            {topics.map((topic) => (
              <a key={topic} onClick={() => history.push('/announcementList')}>{topic}</a>
            ))}
          </TextLoop>
        }
      />
    </div>
  );
}

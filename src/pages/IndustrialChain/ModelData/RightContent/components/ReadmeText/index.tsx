import { Empty } from 'antd';

interface ReadmeTextType {
  introHtml: string;
}

const ReadmeText = (props: ReadmeTextType) => {
  return props.introHtml ? (
    <div style={{ minHeight: 100 }} dangerouslySetInnerHTML={{ __html: props.introHtml }} />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
};

export default ReadmeText;

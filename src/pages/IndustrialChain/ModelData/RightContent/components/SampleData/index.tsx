import { Empty } from 'antd';

interface SampleDataType {
  exampleHtml: string;
}

const SampleData = (props: SampleDataType) => {
  return props.exampleHtml ? (
    <div style={{ minHeight: 100 }} dangerouslySetInnerHTML={{ __html: props.exampleHtml }} />
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
};

export default SampleData;

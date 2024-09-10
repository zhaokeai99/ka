import { Divider, Col, Row, Space } from 'antd';
import { memo } from 'react';
import './../index.css';

interface ModalProps {
  item: any;
}

const SearchInfo = (props: ModalProps) => {
  const { item } = props;

  return (
    <>
      <Row>
        <Col span={24}>
          <div
            style={{ textAlign: 'left', marginBottom: '15px' }}
            className={'es-content-title'}
            dangerouslySetInnerHTML={{
              __html: item?.title_highlight ? item?.title_highlight : item?.title,
            }}
          ></div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div style={{ textAlign: 'left' }} className={'es-content-title2'}>
            <Space>
              {item?.industryName ? <div>{item?.industryName}</div> : ''}
              {item?.brokerName ? <div>{item?.brokerName}</div> : ''}
              {item?.originalAuthor ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: item?.originalAuthor_highlight
                      ? item?.originalAuthor_highlight
                      : item?.originalAuthor,
                  }}
                ></div>
              ) : (
                ''
              )}
              {item?.docTime ? <div>{item?.docTime}</div> : ''}
            </Space>
          </div>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <div
            className={'div-detail'}
            dangerouslySetInnerHTML={{
              __html: item?.summary_highlight ? item?.summary_highlight : item?.summary,
            }}
          ></div>
        </Col>
      </Row>
    </>
  );
};
export default memo(SearchInfo);

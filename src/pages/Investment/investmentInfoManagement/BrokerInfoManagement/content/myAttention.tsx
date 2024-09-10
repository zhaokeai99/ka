import ProCard from '@ant-design/pro-card';
import { Button, Col, Modal, Row, Spin } from 'antd';
import lodash from 'lodash';
import { memo, useCallback, useEffect, useState } from 'react';
import './../index.css';
import AttentionEdit from './attentionEdit';
import { DicProps } from '@/pages/Investment/investmentInfoManagement/BrokerInfoManagement';

interface ModalProps {
  onSearch: (val: string) => void;
  onClose: () => void;
  dicMap: DicProps;
  attData: any[];
  loading: boolean;
}

/**
 * 我的关注
 * @param props
 * @constructor
 */
const MyAttention = (props: ModalProps) => {
  const { dicMap, attData, onClose, loading } = props;
  const [attentionShow, setAttentionShow] = useState<boolean>(false);
  const [attentionType, setAttentionType] = useState('');
  const [attentionTypeName, setAttentionTypeName] = useState('');
  const [total, setTotal] = useState({ type1: 0, type2: 0, type3: 0 });

  useEffect(() => {
    const type1List = lodash.filter(attData, { followType: 1 });
    const type2List = lodash.filter(attData, { followType: 2 });
    setTotal({ type1: type1List.length, type2: type2List.length, type3: 0 });
  }, [attData]);

  const showStock = useCallback(() => {
    setAttentionShow(true);
    setAttentionType('stock');
    setAttentionTypeName('自选股');
  }, []);

  const industryStock = useCallback(() => {
    setAttentionShow(true);
    setAttentionType('industry');
    setAttentionTypeName('行业');
  }, []);

  const modalClose = useCallback(() => {
    setAttentionShow(false);
    onClose();
  }, []);

  return (
    <div style={{ padding: '16px 0 0 16px' }}>
      <ProCard style={{ padding: '16px 24px 16px 24px' }} bodyStyle={{ padding: 0 }}>
        <div className={'attention-card-title'}>我的关注</div>
        <Spin spinning={loading}>
          <Row className={'attention'} gutter={17}>
            <Col span={2}></Col>
            <Col span={8}>
              <div className={'attention-div'} onClick={showStock}>
                <div className={'attention-title'}>自选股</div>
                <div className={'attention-content'}>{total.type2}</div>
              </div>
            </Col>
            <Col span={4}></Col>
            <Col span={8}>
              <div className={'attention-div'} onClick={industryStock}>
                <div className={'attention-title'}>行业</div>
                <div className={'attention-content'}>{total.type1}</div>
              </div>
            </Col>
          </Row>
        </Spin>
      </ProCard>
      <Modal
        title={attentionTypeName}
        visible={attentionShow}
        onOk={modalClose}
        onCancel={modalClose}
        width="600px"
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={modalClose}>
            关闭
          </Button>,
        ]}
      >
        <AttentionEdit dicMap={dicMap} type={attentionType} />
      </Modal>
    </div>
  );
};

export default memo(MyAttention);

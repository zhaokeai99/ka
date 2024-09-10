import { memo, useState } from 'react';
import { Button, Space, Col, Row } from 'antd';
import { EsIndexInfoFacadeExecuteCat } from './service';

const CatInfo = () => {
  const [scriptText, setScriptText] = useState<string>('');

  const searchData = async (type: string) => {
    const params = { command: type };
    const data = await EsIndexInfoFacadeExecuteCat(params);
    setScriptText(data);
  };

  return (
    <>
      <Space direction={'vertical'}>
        <Row>
          <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
            索引/集群：
          </Col>
          <Col span={20}>
            <Space>
              <Button onClick={() => searchData('health?v')}>健康 health</Button>
              <Button onClick={() => searchData('indices?v')}>索引 indices</Button>
              <Button onClick={() => searchData('count?v')}>文档 count</Button>
              <Button onClick={() => searchData('plugins?v')}>插件 plugins</Button>
              <Button onClick={() => searchData('shards?v')}>分片 shards</Button>
              <Button onClick={() => searchData('segments?v')}>分段 segments</Button>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
            节点：
          </Col>
          <Col span={20}>
            <Space>
              <Button onClick={() => searchData('nodes?v')}>集群节点 nodes</Button>
              <Button onClick={() => searchData('allocation?v')}>节点详细 allocation</Button>
              <Button onClick={() => searchData('master?v')}>主节点 master</Button>
            </Space>
          </Col>
        </Row>
        <Row>
          <Col span={4} style={{ textAlign: 'right', lineHeight: '32px' }}>
            其他：
          </Col>
          <Col span={20}>
            <Space>
              <Button onClick={() => searchData('thread_pool?v')}>线程池 thread_pool</Button>
              <Button onClick={() => searchData('pending_tasks?v')}>等待任务 pending_tasks</Button>
              <Button onClick={() => searchData('templates?v')}>模版 templates</Button>
            </Space>
          </Col>
        </Row>
      </Space>
      <Row>
        <Col>
          <pre style={{ height: 400, marginTop: 20 }}>{scriptText}</pre>
        </Col>
      </Row>
    </>
  );
};
export default memo(CatInfo);

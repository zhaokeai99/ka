import { Input, Button, Col, Row } from 'antd';
import { memo } from 'react';
import ProCard from '@ant-design/pro-card';
import NewsInfo from './news';
import Icons from './icons';

interface ModalProps {
  onSearch: (key: string) => void;
  onChange: (objId: string) => void;
}

const SearchInfo = (props: ModalProps) => {
  const { onSearch, onChange } = props;
  //搜索
  const search = () => {
    // @ts-ignore
    const key = document.getElementById('searchKey')?.value;
    onSearch(key);
  };

  const keyPress = (e: any) => {
    if (e.charCode === 13) {
      // @ts-ignore
      const key = document.getElementById('searchKey')?.value;
      onSearch(key);
    }
  };

  const newsClick = (objId: string) => {
    onChange(objId);
  };

  return (
    <>
      <ProCard headStyle={{ border: 'none' }}>
        <Row>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>{Icons.IconResearchReport}</div>
          </Col>
          <Col span={12}>
            <Input.Group compact style={{ marginTop: '20px', marginBottom: '20px' }}>
              <Input
                id={'searchKey'}
                style={{ width: 'calc(100% - 200px)' }}
                placeholder={'请输入需要搜索的关键词'}
                onKeyPress={keyPress}
              />
              <Button type="primary" onClick={search}>
                搜索
              </Button>
            </Input.Group>
          </Col>
          <Col span={6}></Col>
        </Row>
        <Row>
          <Col span={24}>
            <NewsInfo onClick={newsClick} />
          </Col>
        </Row>
      </ProCard>
    </>
  );
};
export default memo(SearchInfo);

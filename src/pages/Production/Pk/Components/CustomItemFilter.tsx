import { useEffect, useState } from 'react';
import { Space } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import TitleExtra from './TitleExtra';
import PopTreeTransfer from '@/components/PopTreeTransfer';
import { queryParams } from '../../HotFundIndex/service';

const CustomItemFilter = ({ handleFilterChange, paramTags, anchorId, searcherType }: any) => {
  const [allParams, setAllParams] = useState([]);

  // 初始化，获取所有列项
  useEffect(() => {
    (async () => {
      const data = await queryParams({ searcherType });
      // 初始化展示列项
      const allResultList = data
        .filter((d: any) => !!d.supportResult)
        .map((i: any) => {
          const { supportResult } = i;
          return { ...i, desc: supportResult.desc, noRemove: !!supportResult?.disabled };
        });
      setAllParams(allResultList);
    })();
  }, []);

  return (
    <>
      <PopTreeTransfer
        dataSource={allParams}
        selectTags={paramTags}
        schemeEmpty={false}
        onChange={handleFilterChange}
      >
        <a style={{ whiteSpace: 'nowrap' }}>
          <Space>
            <PlusCircleOutlined />
            <span>增加对比项</span>
          </Space>
        </a>
      </PopTreeTransfer>
      <TitleExtra id={anchorId} />
    </>
  );
};

export default CustomItemFilter;

import { useState, useEffect } from 'react';
import PieRadar from './PieRadar';
import RadarList from './RadarList';
import Scale from './Scale';
import TypeBar from './TypeBar';

import styles from './index.less';

export default function ({ data, floodFund }: any) {
  const [selectItem, setSelectType] = useState({ sectorId: '' });

  useEffect(() => {
    if (data && data.length) {
      setSelectType(data[0]);
    }
  }, [data, floodFund]);

  return (
    <div className={styles['container']}>
      <TypeBar
        sectorId={selectItem?.sectorId}
        data={data}
        selectTypeChange={(item: any) => setSelectType(item)}
      />
      {/* 中间部分图标内容 */}
      <div className={styles['radar']}>
        {/* 左边的两个图 */}
        <PieRadar typeItem={selectItem} floodFund={floodFund} />
        {/* 右边的两个部分 */}
        <RadarList typeItem={selectItem} floodFund={floodFund} />
      </div>
      <Scale sectorId={selectItem?.sectorId} floodFund={floodFund} />
    </div>
  );
}

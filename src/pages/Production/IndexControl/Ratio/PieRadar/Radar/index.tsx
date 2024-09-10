import { Radar } from '@ant-design/charts';
import { Empty } from 'antd';
import { useEffect, useState } from 'react';
import { calThIndexSectorLatestRanking } from '../../service';
import styles from './index.less';

const config = {
  xField: 'name',
  yField: 'quantile',
  meta: {
    quantile: {
      alias: '数值',
      min: 0,
      max: 1,
      formatter: (v: any) => +Number(v),
    },
  },
  tooltip: {
    customContent: (title: string) => title,
  },
  xAxis: {
    tickLine: null,
    label: {
      offset: 30,
      style: {
        textAlign: 'center',
        fontSize: 12,
      },
      autoHide: false,
      autoRotate: true,
    },
  },
  yAxis: {
    label: false,
    grid: {
      alternateColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  // 开启辅助点
  point: {
    size: 2,
  },
  area: {},
};

export default function IndexRadar({
  width = 300,
  height = 240,
  sectorId = '',
  title = '',
  floodFund = null,
}) {
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    (async () => {
      if (sectorId) {
        const { list } = await calThIndexSectorLatestRanking({
          sectorId,
          customerType: 'TOTAL',
          floodFund,
        });
        const radarList = (list || []).map((item: { name: any; rank: any }) => {
          return {
            ...item,
            name: item.name.replace(/(.{6})/g, '$1' + '\n') + '\n' + item.rank,
          };
        });

        setRadarData(radarList);
      }
    })();
  }, [sectorId, floodFund]);

  if (!Array.isArray(radarData)) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  if (radarData.length === 0) return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className={styles['container']}>
      <div className={styles['out']} style={{ zIndex: 2 }}>
        <div className={styles['title']}>
          <span>我司赛道排名综合评估 - </span>
          <span className={styles['type']}>{title || ''}</span>
        </div>
        <Radar {...config} width={width} height={height} data={radarData} />
      </div>
    </div>
  );
}

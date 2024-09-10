import { InsertRowAboveOutlined, PieChartOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Chart } from '@antv/g2';
import { Data } from '@antv/g2/lib/interface';
import { Radio } from 'antd';
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import TabTables from './Percentage/index';
import { getProductPie } from './service';

function pie(container: string, title: string, count: any, per: string, data: Data) {
  const chart = new Chart({
    container: container,
    width: 240,
    autoFit: true,
    height: 240,
  });
  chart.data(data);
  chart.scale('value', {
    formatter: (val) => {
      const newval = val.toFixed(2) + '%';
      return newval;
    },
  });

  chart.coordinate('theta', {
    radius: 0.75,
    innerRadius: 0.6,
  });
  chart.tooltip({
    showTitle: false,
    showMarkers: false,
    nameTpl:
      '<li class="g2-tooltip-list-name"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>',
  });

  chart.legend({
    position: 'right',
    offsetX: -10,
    itemName: {
      style: {
        fontSize: 10,
      },
    },
  });
  // 辅助文本
  chart
    .annotation()
    .text({
      position: ['50%', '50%'],
      content: title,
      style: {
        fontSize: 12,
        fill: '#8c8c8c',
        textAlign: 'center',
      },
      offsetY: -20,
    })
    .text({
      position: ['50%', '50%'],
      content: count,
      style: {
        fontSize: 16,
        fill: '#000000',
        textAlign: 'center',
      },
      offsetX: 0,
      offsetY: 15,
    })
    .text({
      position: ['50%', '50%'],
      style: {
        fontSize: 12,
        fill: '#8c8c8c',
        textAlign: 'center',
      },
      offsetY: 35,
      offsetX: 0,
    });
  chart
    .interval()
    .adjust('stack')
    .position('value')
    .color('name')
    .tooltip('name*value', (name, value) => {
      const newpercent = value.toFixed(2) + '%';
      return {
        name: name,
        value: newpercent,
      };
    });

  chart.interaction('element-single-selected');

  chart.render();
}

export default function (props: any) {
  const ref: any = useRef(null);
  const [value, setValue] = useState('0');

  useEffect(() => {
    (async () => {
      if (props?.sectorId) {
        const res = await getProductPie({ sectorId: props?.sectorId, floodFund: props?.floodFund });
        try {
          if (res && res.success && res.data && value === '0') {
            // 清空
            ref.current.innerHTML = '';

            pie('container', '产品总规模', res.total, '亿', res.data);
          }
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [props?.sectorId, props?.floodFund, value]);

  return (
    <div className={styles['container']}>
      <div className={styles['out']} style={{ zIndex: 2 }}>
        <ProCard
          headStyle={{ border: '0' }}
          extra={
            <Radio.Group
              value={value}
              buttonStyle="solid"
              size="small"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            >
              <Radio.Button value="0">
                <PieChartOutlined />
              </Radio.Button>
              <Radio.Button value="1">
                <InsertRowAboveOutlined />
              </Radio.Button>
            </Radio.Group>
          }
        >
          <div className={styles['title']}>
            <span className={styles['type']}>{props.title || ''}</span>
            <span> - Top10公司市占率分布</span>
          </div>
          {value === '0' ? (
            <div ref={ref} id="container" className={styles['item']}></div>
          ) : (
            <TabTables sectorId={props?.sectorId} floodFund={props?.floodFund} />
          )}
        </ProCard>
      </div>
    </div>
  );
}

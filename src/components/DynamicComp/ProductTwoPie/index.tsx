import { Chart } from '@antv/g2';
import { useEffect } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { getProductPie } from './service';
import styles from './index.less';

function pie(container, title, count, per, data) {
  const chart = new Chart({
    container: container,
    width: 400,
    height: 305,
  });
  chart.data(data);
  chart.scale('percent', {
    formatter: (val) => {
      const newval = (val * 100).toFixed(2) + '%';
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
    offsetX: 0,
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
      content: per,
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
    // .color('name', (xVal) => {
    //   if (xVal === '偏商品及金融衍生品类') {
    //     return '#56a0f8';
    //   } else if (xVal === '偏权益类') {
    //     return '#67c8ca';
    //   } else if (xVal === '偏固定收益类') {
    //     return '#72c77c';
    //   } else if (xVal === '债权') {
    //     return '#f4d358';
    //   } else if (xVal === '债券') {
    //     return '#e16c7d';
    //   } else if (xVal === '其他') {
    //     return '#8e66dd';
    //   } else if (xVal === 'FOF') {
    //     return '#8e6600';
    //   }
    //   return xVal;
    // })
    .color('name')
    // .style({
    //   lineWidth: 2,
    //   stroke: '#1890ff',
    // })
    // .label('percent', (percent) => {
    //   return {
    //     content: (data) => {
    //       return `${data.name}: ${percent * 100}%`;
    //     },
    //   };
    // })
    .tooltip('name*percent', (name, percent) => {
      // const newpercent = (value * 100).toFixed(2) + '%';
      return {
        name: name,
        value: percent,
      };
    });

  chart.interaction('element-single-selected');

  chart.render();
}

export default function () {
  useEffect(() => {
    getProductPie({ fundType: 'PUBLIC' })
      .then((res) => {
        if (res && res.success && res.data) {
          pie('container', '产品总规模', res.total.toFixed(2), '亿', res.data);
        }
      })
      .catch((e) => console.log(e));
    getProductPie({ fundType: 'PRIVATE' })
      .then((res) => {
        if (res && res.success && res.data) {
          pie('container1', '续存产品数量', res.total, '只', res.data);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <ProCardPlus
      gutter={[8, 8]}
      style={{ background: 'white' }}
      title="产品分布"
      extra={
        <div className={styles['extra']}>
          <div className={styles['item-fly']}></div>
          <div className={styles['item-go']}></div>
        </div>
      }
    >
      {/* <div className={styles['header-container']}>
        <div className={styles['header']}>产品分布</div>
        <div className={styles['extra']}>
          <div className={styles['item-fly']}></div>
          <div className={styles['item-go']}></div>
        </div>
      </div> */}
      <div className={styles['container']}>
        <div className={styles['out']} style={{ zIndex: 2 }}>
          <div className={styles['title']}>公募基金</div>
          <div id="container" className={styles['item']}></div>
        </div>
        <div className={styles['out']}>
          <div className={styles['title']}>私募基金</div>
          <div id="container1" className={styles['item']}></div>
        </div>
      </div>
    </ProCardPlus>
  );
}

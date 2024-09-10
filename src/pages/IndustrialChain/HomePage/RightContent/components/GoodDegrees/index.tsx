import { useCallback, useEffect, useMemo, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import { Scatter } from '@ant-design/plots';
import { Empty, Select } from 'antd';
// TODO
// import { history } from 'umi';
import { history } from 'umi';
import { queryIndustryProsperity } from '../../service';
import styles from './index.less';

const { Option } = Select;

// 行业景气度
const GoodDegrees = () => {
  const [selValue, setSelValue] = useState<string>('PE');
  const [data, setData] = useState<any[]>([]);

  const getList = useCallback(async () => {
    const result = (await queryIndustryProsperity()) || [];

    setData(result);
  }, []);

  const getMaxMin = useCallback(() => {
    if (data?.length) {
      const type = selValue === 'PE' ? 'peRatio' : 'pbRatio';
      const YData = [...data].sort((a: any, b: any) => a[type] - b[type]);
      const XData = [...data].sort((a: any, b: any) => a?.prosperity - b?.prosperity);

      return {
        minY: YData[0][type],
        maxY: YData[YData?.length - 1][type],
        minX: XData[0]['prosperity'],
        maxX: XData[XData?.length - 1]['prosperity'],
      };
    }

    return {};
  }, [data, selValue]);

  useEffect(() => {
    getList();
  }, []);

  const config = useMemo(() => {
    const { maxX, minX, maxY } = getMaxMin();

    return {
      appendPadding: 16,
      xField: 'prosperity',
      yField: selValue === 'PE' ? 'peRatio' : 'pbRatio',
      sizeField: 'industryName',
      size: 25,
      shape: 'cicle',
      pointStyle: {
        fill: '#ADC6FF',
        fillOpacity: 0.2,
        stroke: '#4568F5',
        strokeOpacity: 0.15,
      },
      meta: {
        prosperity: { alias: '行业景气度' },
        pbRatio: { alias: '行业PB百分比' },
        peRatio: { alias: '行业PE百分比' },
      },
      tooltip: {
        showTitle: true,
        showMarkers: false,
        fields: ['pbRatio', 'peRatio', 'prosperity'],
        customContent: (title: string, items: any[]) => {
          const field = items?.[0];
          const formatterInfo = {
            行业景气度: () => '%',
            行业PB百分比: () => '%',
            行业PE百分比: () => '%',
          };

          // 根据selValue的值动态展示悬浮框内容
          const newItems = items?.filter(({ name }: any) =>
            selValue === 'PE' ? name !== '行业PB百分比' : name !== '行业PE百分比',
          );

          let htmlStr = `
            <div style="margin:10px 0;font-weight:700;">
              ${field?.data?.industryName}</div>
            <div class="g2-tooltip-items">`;

          (newItems || []).forEach(({ name, value }: any) => {
            htmlStr += `<div class="g2-tooltip-item" style="margin-bottom:8px;display:flex;justify-content:space-between;">
                  <span class="g2-tooltip-item-label" style="margin-right: 12px;">${name}</span>
                  <span class="g2-tooltip-item-value">${value + formatterInfo[name](value)}</span>
                </div>`;
          });

          htmlStr += '</div>';

          return htmlStr;
        },
      },
      label: {
        formatter: (item: any) => {
          return item?.industryName;
        },
        offsetY: 12,
        style: {
          fontSize: 12,
          fill: '#4568F5',
          cursor: 'pointer',
        },
      },
      xAxis: {
        min: minX,
        max: maxX,
        grid: {
          line: {
            style: {
              stroke: '#eee',
            },
          },
        },
        label: {
          formatter: (v: any) => (v !== '0' ? v + '%' : v),
        },
        line: null,
      },
      yAxis: {
        min: -10,
        max: maxY * 1.2,
        line: null,
        label: {
          formatter: (v: any) => (v !== '0' ? v + '%' : v),
        },
      },
      annotations: [
        {
          type: 'text',
          position: ['99%', '43%'],
          content: '行业景气度  -  标准化处理',
          rotate: Math.PI / 2,
          offsetY: -40,
          offsetX: 18,
          style: {
            fontSize: 12,
          },
        },
      ],
      quadrant: {
        xBaseline: (minX + maxX) / 2,
        yBaseline: (-10 + maxY * 1.2) / 2,
        lineStyle: {
          lineWidth: 1,
          stroke: '#4568F5',
          opacity: 0.5,
        },
        // 四个方格的颜色设置
        regionStyle: [
          {
            fill: `rgba(255, 255, 255, 1)`,
          },
          {
            fill: `rgba(255, 255, 255, 1)`,
          },
          {
            fill: `rgba(255, 255, 255, 1)`,
          },
          {
            fill: `rgba(255, 255, 255, 1)`,
          },
        ],
        // 四个角角的文字设置
        labels: [
          {
            content: '高景气高估值',
            position: ['99%', '10%'],
            style: {
              fill: '#F27C49',
              fontSize: 12,
              fontWeight: 400,
            },
          },
          {
            content: '低景气高估值',
            position: ['1%', '10%'],
            style: {
              fill: '#F27C49',
              fontSize: 12,
              fontWeight: 400,
            },
          },
          {
            content: '低景气低估值',
            position: ['1%', '90%'],
            style: {
              fill: '#F27C49',
              fontSize: 12,
              fontWeight: 400,
            },
          },
          {
            content: '高景气低估值',
            position: ['99%', '90%'],
            style: {
              fill: '#F27C49',
              fontSize: 12,
              fontWeight: 400,
            },
          },
        ],
      },
    };
  }, [data, selValue]);

  const tooltipCenter = (
    <div className={styles['tooltip-center']}>
      <div>
        行业景气度：
        <span>
          综合分析了行业成分股的营业收入同比和卖方盈利预测2个维度，反映了行业盈利情况和发展前景
        </span>
      </div>
      <div>
        行业相对PE百分位：<span>反应了当前行业相对PE估值所处历史2年序列的百分位</span>
      </div>
      <div>
        行业相对PB百分位：<span>反应了当前行业相对PB估值所处历史2年序列的百分位</span>
      </div>
    </div>
  );

  return (
    <ProCardPlus direction="column" title="行业景气度" className={styles['good-degrees']}>
      {tooltipCenter}
      {data?.length <= 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <div style={{ width: '100%' }} id="select-content">
          <div className={styles['select-content']}>
            <Select
              value={selValue}
              style={{ width: 200 }}
              getPopupContainer={() => document.getElementById('select-content') as any}
              onChange={(value) => setSelValue(value)}
            >
              <Option value="PE">行业相对PE历史百分位</Option>
              <Option value="PB">行业相对PB历史百分位</Option>
            </Select>
          </div>
          <Scatter
            data={data}
            {...(config as any)}
            style={{ height: '425px' }}
            // TODO
            // onReady={(plot) => {
            //   plot.on('element:click', ({ data: { data: { industryName = '', industryChainCode = '', chain = 0 } } }: any) => {
            //     history.push(
            //       `/industrialChain/industryCenter/${industryName}/${industryChainCode}/${chain}`
            //     )
            //   });
            // }}
            onReady={(plot) => {
              plot?.on('element:click', (item: any) => {
                const { industryName = '', chainId = '', chain = 0 } = item?.data?.data ?? {};

                history.push(`/industrialChain/industryCenter/${industryName}/${chainId}/${chain}`);
              });
            }}
          />
        </div>
      )}
    </ProCardPlus>
  );
};

GoodDegrees.isProCard = true;

export default GoodDegrees;

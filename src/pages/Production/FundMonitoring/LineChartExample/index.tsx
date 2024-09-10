// import { DualAxes } from '@ant-design/charts';
// import { TableItemSkeleton } from '@ant-design/pro-components';
import { Chart } from '@antv/g2';
import React, { useEffect, memo, useRef } from 'react';

const LineChartExample: React.FC<any> = (props: any) => {
  const { LineData } = props;
  const currentRef = useRef(null);
  // const [LeftAxis, setLeftAxis] = useState<any[]>([]);
  // const [RightAxis, setRightAxis] = useState<any[]>([]);

  const creatChart = () => {
    // 创建实例
    const chart = new Chart({
      container: currentRef?.current,
      autoFit: true, //是否自适应容器宽高 如果用户设置了 height，那么会以用户设置的 height 为准
      height: 400,
      defaultInteractions: [], //配置图表默认交互
    });
    chart.tooltip({
      showCrosshairs: true, //配置 tooltip 的辅助线
    });
    chart.removeInteraction('tooltip'); // 移除当前 View 的 interaction。

    chart.legend({
      custom: true, // 是否为自定义图例，当该属性为 true 时，需要声明 items 属性。
      position: 'top-left',
      flipPage: false,
      items: [
        {
          name: '规模',
          value: 'navAmt',
          marker: {
            // 图形标记
            style: {
              fill: '#5B8FF9',
            },
          },
        },
        {
          name: '份额',
          value: 'fundvol',
          marker: {
            style: {
              fill: '#5D7092',
            },
          },
        },
        {
          name: '净值',
          value: 'nav',
          marker: {
            style: {
              fill: '#5AD8A6',
              lineWidth: 1,
            },
          },
        },
      ],
    });

    const view1 = chart.createView({
      region: {
        start: {
          x: 0,
          y: 0,
        },
        end: {
          x: 0.9,
          y: 0.5,
        },
      },
      padding: [10, 10, 10, 60],
    });

    view1.axis('fundvol', {
      grid: null,
      title: {
        text: '亿份',
      },
      label: {
        formatter: (value: any) => {
          return value.includes('.') ? Number(value).toFixed(2) : value;
        },
      },
    });
    view1.axis('navAmt', {
      title: {
        text: '亿元',
      },
      label: {
        formatter: (value: any) => {
          return value.includes('.') ? Number(value).toFixed(2) : value;
        },
      },
    });

    view1.axis('navDate', false);

    view1.tooltip({
      showCrosshairs: true, // 配置 tooltip 的辅助线
      shared: true, //true 表示合并当前点对应的所有数据并展示，false 表示只展示离当前点最逼近的数据内容
      title: (title, datum) => `${datum.navDate} ${datum.fundName}`,
      containerTpl: `<div class="g2-tooltip"><p class="g2-tooltip-title"></p><ul class="g2-tooltip-list"></ul></div>`, //用于指定图例容器的模板，自定义模板时必须包含各个 dom 节点的 class。
      itemTpl: `
        <li class="g2-tooltip-list-item">
          <span class="g2-tooltip-marker" style="background-color:{color}"></span>
          <span class="g2-tooltip-name">{name}</span>:<span class="g2-tooltip-value">{value}</span>
          <span class="g2-tooltip-value">{growthRate}</span>
        </li>
      `, // 用于指定图例容器的模板，自定义模板时必须包含各个 dom 节点的 class。
      customItems: (items: any) => {
        //在渲染 tooltip 之前，对 G2 的 tooltip items 列表项目进行用户自定义处理，默认不做任何处理。可以用来对 tooltip 列表进行过滤、排序、格式化等操作
        return items.map((item: any) => {
          return {
            color: item?.color,
            name: item?.name,
            value: item?.value,
            growthRate: item?.growthRate,
          };
        });
      },
      domStyles: {
        'g2-tooltip': {
          // width: 400
        },
        'g2-tooltip-list-item': {
          display: 'flex',
        },
      },
    });
    view1.legend(false);
    view1.data(LineData);
    view1.interaction('tooltip');
    view1.interaction('sibling-tooltip');
    view1
      .line()
      .position('navDate*navAmt')
      .color('#5B8FF9')
      .tooltip('navDate*navAmt*navAmtAddRatio', (navDate, navAmt, navAmtAddRatio) => {
        return {
          name: '规模',
          value: navAmt,
          growthRate: `${!!navAmtAddRatio ? navAmtAddRatio : 0}%`,
        };
      });
    view1
      .line()
      .position('navDate*fundvol')
      .color('#5D7092')
      .tooltip('navDate*fundvol*fundvolAddRatio', (navDate, fundvol, fundvolAddRatio) => ({
        name: '份额',
        value: fundvol,
        growthRate: `${!!fundvolAddRatio ? fundvolAddRatio : 0}%`,
      }));

    const view2 = chart.createView({
      region: {
        start: {
          x: 0,
          y: 0.5,
        },
        end: {
          x: 0.9,
          y: 1,
        },
      },
      padding: [0, 10, 60, 60],
    });

    view2.option('slider', {
      start: 0,
      end: 1,
    });

    view2.legend(false);
    view2.tooltip({
      showCrosshairs: true,
      shared: true,
      title: (title, datum) => `${datum.navDate} ${datum.fundName}`,
      containerTpl: `<div class="g2-tooltip"><p class="g2-tooltip-title"></p><ul class="g2-tooltip-list"></ul></div>`,
      itemTpl: `
        <li class="g2-tooltip-list-item">
          <span class="g2-tooltip-marker" style="background-color:{color}"></span>
          <span class="g2-tooltip-name">{name}</span>:<span class="g2-tooltip-value">{value}</span>
          <span class="g2-tooltip-value">{growthRate}</span>
        </li>
      `,
      customItems: (items: any) => {
        return items.map((item: any) => {
          return {
            color: item?.color,
            name: item?.name,
            value: item?.value,
            growthRate: item?.growthRate,
          };
        });
      },
      domStyles: {
        'g2-tooltip': {},
        'g2-tooltip-list-item': {
          display: 'flex',
        },
      },
    });

    view2.interaction('tooltip');
    view2.interaction('sibling-tooltip');
    view2.data(LineData);
    view2
      .line()
      .position('navDate*nav')
      .color('#5AD8A6')
      .tooltip('navDate*nav*navAddRatio', (navDate, nav, navAddRatio) => ({
        name: '净值',
        value: nav,
        growthRate: `${!!navAddRatio ? navAddRatio : 0}%`,
      }));

    view2.on('slider:mousemove', ({ view }) => {
      view1.changeData(view.filteredData);
    });

    chart.render();
    return chart;
  };

  // 折线图数据
  useEffect(() => {
    let chart: any = null;
    if (LineData.length !== 0) {
      // const newLeftAxis: { value: any; time: any }[] = [];
      // const newRightAxis: { fundvol: any; time: any; type: string }[] = [];
      // LineData.forEach((ite: any) => {
      //   const navAmt = {
      //     value: ite.navAmt,
      //     time: ite.navDate,
      //     title: ite.fundName,
      //     type: '规模',
      //     growthRate: ite.navAmtAddRatio,
      //     fundCode: ite.fundCode,
      //   };
      //   const nav = {
      //     value: ite.nav,
      //     time: ite.navDate,
      //     type: '净值',
      //     growthRate: ite.navAddRatio,
      //     title: ite.fundName,
      //     fundCode: ite.fundCode,
      //   };
      //   const fundvol = {
      //     fundvol: ite.fundvol,
      //     time: ite.navDate,
      //     type: '份额',
      //     growthRate: ite.fundvolAddRatio,
      //     title: ite.fundName,
      //     fundCode: ite.fundCode,
      //   };

      //   newLeftAxis.push(navAmt, nav);
      //   newRightAxis.push(fundvol);
      //   setLeftAxis(newLeftAxis);
      //   setRightAxis(newRightAxis);
      // });
      chart = creatChart();
    }
    return () => chart?.destroy();
  }, [LineData]);

  // const config = useMemo(() => {
  //   return {
  //     data: [LeftAxis, RightAxis],
  //     xField: 'time',
  //     limitInPlot: false,
  //     style: { width: '100%', height: '500px' },
  //     yField: ['value', 'fundvol'],
  //     yAxis: {
  //       value: {
  //         title: {
  //           text: '亿元',
  //           position: 'end',
  //         },
  //         label: {
  //           formatter: (value: any) => {
  //             return value.includes('.') ? Number(value).toFixed(2) : value;
  //           },
  //         },
  //       },
  //       fundvol: {
  //         title: {
  //           text: '亿份',
  //           position: 'end',
  //         },
  //         label: {
  //           formatter: (value: any) => {
  //             return value.includes('.') ? Number(value).toFixed(2) : value;
  //           },
  //         },
  //       },
  //     },
  //     xAxis: {
  //       label: {
  //         autoRotate: true,
  //       },
  //     },
  //     padding: [30, 30, 100, 30],
  //     slider: {},
  //     meta: {
  //       time: {
  //         sync: false, // 开启之后 slider 无法重绘
  //       },
  //     },
  //     tooltip: {
  //       customContent: (
  //         title:
  //           | boolean
  //           | React.ReactChild
  //           | React.ReactFragment
  //           | React.ReactPortal
  //           | null
  //           | undefined,
  //         items: any[],
  //       ) => {
  //         return (
  //           <>
  //             <h5 style={{ marginTop: 16 }}>
  //               {title}
  //               {items[0]?.data.title}
  //             </h5>
  //             <ul style={{ paddingLeft: 0 }}>
  //               {items?.map((item, index) => {
  //                 const { name, value, color } = item;
  //                 const { growthRate } = item.data;
  //                 return (
  //                   <li
  //                     key={index}
  //                     className="g2-tooltip-list-item"
  //                     data-index={index}
  //                     style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
  //                   >
  //                     <span className="g2-tooltip-marker" style={{ backgroundColor: color }}></span>
  //                     <span
  //                       style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
  //                     >
  //                       <span style={{ marginRight: '16px' }}>{name}:</span>
  //                       <span
  //                         style={{ marginRight: '10px' }}
  //                         className="g2-tooltip-list-item-value"
  //                       >
  //                         {value}
  //                       </span>
  //                       <span className="g2-tooltip-list-item-growthRate">
  //                         {!!growthRate ? growthRate : 0}%
  //                       </span>
  //                     </span>
  //                   </li>
  //                 );
  //               })}
  //             </ul>
  //           </>
  //         );
  //       },
  //     },
  //     geometryOptions: [
  //       {
  //         geometry: 'line',
  //         seriesField: 'type',
  //       },
  //       {
  //         geometry: 'line',
  //         seriesField: 'type',
  //       },
  //     ],
  //   };
  // }, [LeftAxis, RightAxis]);

  return <div ref={currentRef} />;
};
export default memo(LineChartExample);

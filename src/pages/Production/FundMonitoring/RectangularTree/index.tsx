import { numberToT } from '@/utils/utils';
import * as echarts from 'echarts';
import { get as _get } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import { history } from 'umi';
import './index.less';
interface TreeNode {
  name: string;
  id: string;
  value: number[];
  children?: TreeNode[];
}

const getLevelOption = [
  {
    itemStyle: {
      borderWidth: 3,
      gapWidth: 3,
      borderColor: '#262931',
    },

    upperLabel: {
      show: false,
    },
  },
  {
    colorMappingBy: 'value',
    color: ['#30CC5A', '#2F9E4F', '#35764E', '#414554', '#8B444E', '#BF4045', '#F63538'],
    // '#4ea254','#326d35','#245327',
    // '#631c18','#89211a','#ad261b',
    itemStyle: {
      gapWidth: 1,
      borderWidth: 1,
      borderColor: '#373c47',
    },
    emphasis: {
      itemStyle: {
        borderColor: '#373c47',
      },
    },
  },
  {
    itemStyle: {
      gapWidth: 0,
      borderWidth: 0,
      borderColor: '#15161a',
    },
    emphasis: {
      itemStyle: {
        borderColor: '#15161a',
      },
    },
  },
];

const abs = (navAmt: number, num: number | undefined) => {
  if (navAmt >= 0) {
    return numberToT(navAmt, num);
  } else {
    return `-${numberToT(Math.abs(navAmt), num)}`;
  }
};

const RectangularTree: React.FC<any> = (props: any) => {
  const { ETFdata, eventClick } = props;
  const ref = useRef(null);
  const mapInstance = useRef<any>(null);

  // 监听resize
  useEffect(() => {
    if (history.location.pathname === '/production/report/fundMonitoring') {
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.resize();
        }
      }, 0);
    }
  }, [history.location.pathname]);

  useEffect(() => {
    const onResize = () => {
      mapInstance.current.resize();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const renderChart = useCallback(
    (data: any, min, max) => {
      if (mapInstance.current) {
        mapInstance.current.dispose();
      }
      mapInstance.current = echarts.init(ref.current as unknown as HTMLDivElement);
      eventClick(mapInstance.current);

      const visualMin = -100;
      const visualMax = 100;
      const visualMinBound = -50;
      const visualMaxBound = 50;

      convertData(data);

      function convertData(originList: TreeNode[]) {
        for (let i = 0; i < originList.length; i++) {
          const node = originList[i];
          if (node) {
            if (node.value) {
              const value = node.value;
              // Scale value for visual effect
              if (value[1] != null && value[1] > 0) {
                value[2] = echarts.number.linearMap(
                  Number(value[1]),
                  [0, Number(max)],
                  [visualMaxBound, visualMax],
                  true,
                );
              } else if (value[1] != null && value[1] < 0) {
                value[2] = echarts.number.linearMap(
                  Number(value[1]),
                  [Number(min), 0],
                  [visualMin, visualMinBound],
                  true,
                );
              } else {
                value[2] = 0;
              }
            }
            if (node.children) {
              convertData(node.children);
            }
          }
        }
      }
      mapInstance.current.setOption(
        {
          // 悬浮
          tooltip: {
            formatter: function (info: { value: any; treePathInfo: any; data: any }) {
              const value = info.data;
              const treePathInfo = info.treePathInfo;

              const treePath = [];
              for (let i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              if (treePath.length > 1) {
                return [
                  `<div class="tooltip-title">
                ${echarts.format.encodeHTML(treePath.join('/'))}
              </div>
                <div class='suspension'>规模:
                <span>${abs(value.navAmt, 4)}</span>
                <span>${abs(value.navAmtAdd, 4)}</span>
                <span>${
                  value.navAmt === value.navAmtAdd
                    ? '∞'
                    : echarts.format.addCommas(value.navAmtAddRatio)
                }%</span>
              </div>
              <div class='suspension'>份额:
                <span>${abs(value.fundvol, 4)}</span>
                <span>${abs(value.fundvolAdd, 4)}</span>
                <span>${echarts.format.addCommas(value.fundvolAddRatio)}%</span>
              </div>
              <div class='suspension'>净值:
                <span>${abs(value.nav, 4)}</span>
                <span>${abs(value.navAdd, 4)}</span>
                <span>${echarts.format.addCommas(value.navAddRatio)}%</span>
              </div>`,
                ].join('');
              } else {
                return;
              }
            },
          },
          legend: {
            selectedMode: false,
          },
          label: {
            position: ['50%', '50%'],
            formatter: (params: { name: string; value: number[] }) => {
              const paramsData = _get(params, 'data', {});
              const arr = [
                `{name|${params?.name}}`,
                `{budget|${
                  paramsData?.navAmt === paramsData?.navAmtAdd
                    ? '∞'
                    : paramsData?.navAmtAddRatio + '%'
                }}`,
              ];
              return arr.join('\n');
            },
            rich: {
              budget: {
                fontSize: 12,
                color: '#fff',
                align: 'center',
                padding: [2, 15],
              },
              label: {
                fontSize: 9,
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#fff',
                borderRadius: 2,
                lineHeight: 25,
                verticalAlign: 'middle',
              },
              name: {
                fontSize: 12,
                color: '#fff',
                padding: [0, 15],
              },
            },
          },

          series: [
            {
              clickable: false,
              breadcrumb: { show: false },
              nodeClick: false, //点击节点后的行为,false无反应
              roam: false, //是否开启拖拽漫游（移动和缩放）
              type: 'treemap',
              width: '100%',
              height: '100%',
              visualMin: visualMin,
              visualMax: visualMax,
              visualDimension: 2,
              upperLabel: {
                show: true,
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                emphasis: {
                  color: '#fff',
                },
              },
              levels: getLevelOption,
              data,
            },
          ],
        },
        true,
      );
    },
    [ETFdata],
  );

  useEffect(() => {
    let min = -4;
    let max = 4;
    const newNavAtmAdd: number[] = [];
    const newNavAtmAddArr: any[] = [];
    let isEqual = false;
    ETFdata.forEach((item: { children: { value: number[]; navAmtAdd: any; navAmt: any }[] }) => {
      if (Array.isArray(item.children)) {
        newNavAtmAddArr.push(...item.children);
        item.children.forEach((cur: { value: number[]; navAmtAdd: any; navAmt: any }) => {
          newNavAtmAdd.push(cur.value[1]);
        });
      }
    });
    for (let i = 0; i < newNavAtmAddArr.length; i++) {
      if (
        newNavAtmAddArr[i].navAmtAdd === newNavAtmAddArr[i].navAmt &&
        newNavAtmAddArr[i].value[1] === 1
      ) {
        isEqual = true;
        break;
      }
    }
    if (newNavAtmAdd.length) {
      newNavAtmAdd.sort((a, b) => {
        return a - b;
      });
      min = newNavAtmAdd[0];
      max = newNavAtmAdd[newNavAtmAdd.length - 1];

      if (isEqual) {
        props.getNum(min, 0, false);
      } else {
        props.getNum(min, max, false);
      }

      if (ETFdata.length !== 0) {
        renderChart(ETFdata, min, max);
      }
    } else {
      props.getNum(0, 0, true);
    }
  }, [ETFdata]);

  return <div style={{ width: '100%', height: '90%' }} ref={ref} />;
};
export default RectangularTree;

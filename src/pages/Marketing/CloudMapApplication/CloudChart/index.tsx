import * as echarts from 'echarts';
import { get as _get } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';

const getLevelOption = [
  {
    itemStyle: {
      borderWidth: 3,
      gapWidth: 3,
      borderColor: '#2c2c2e',
    },
    upperLabel: {
      show: false,
    },
  },
  {
    colorMappingBy: 'value',
    color: ['#30CC5A', '#2F9E4F', '#35764E', '#414554', '#8B444E', '#BF4045', '#F63538'],
    itemStyle: {
      gapWidth: 1,
      borderWidth: 1,
      borderColor: '#2c2c2e',
    },
    upperLabel: {
      show: false,
    },
    emphasis: {
      itemStyle: {
        borderColor: '#2c2c2e',
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
interface TreeNode {
  name: string;
  id: string;
  value: number[];

  children?: TreeNode[];
}

const CloudChart: React.FC<any> = (props: any) => {
  const ref = useRef(null);
  let mapInstance: any = null;
  const { cloudChartData, planType } = props;

  // 监听resize
  useEffect(() => {
    function onResize() {
      mapInstance.resize();
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const renderChart = useCallback(
    (data: any, min, max, pageIndex) => {
      if (mapInstance) {
        mapInstance.dispose();
      }
      mapInstance = echarts.init(ref.current as unknown as HTMLDivElement);

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
      mapInstance.setOption(
        {
          // 悬浮
          tooltip: {
            backgroundColor: '#fff',
            formatter: (info: { value: any; treePathInfo: any; data: any; color: string }) => {
              const value = info.data;
              const treePathInfo = info.treePathInfo;
              // 查找到对应的赛道
              const SuspensionList = data.find((item: any) => {
                return item.code === value.parentCode;
              });

              let color = '#000';
              let nameWidth = '260px';
              let numWidth = '100px';

              if (planType === 'FUND_MANAGER') {
                nameWidth = '80px';
                numWidth = '150px';
              } else {
                nameWidth = '260px';
                numWidth = '100px';
              }
              // 是否为色块
              const treePath = [];
              for (let i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name);
              }
              if (treePath.length > 1) {
                // 获取页码
                const index = SuspensionList.children.findIndex((item: any) => {
                  return JSON.stringify(item) === JSON.stringify(value);
                });

                const pageSize = Math.ceil((index + 1) / pageIndex); //当前页面
                const start = (pageSize - 1) * pageIndex; // 开始位置
                const end = pageSize * pageIndex; //结束位置

                const newData = SuspensionList.children.slice(start, end); // 截取数据

                let suspensionSortList = `<div style="padding:10px;"><div>
                <span style="line-height:30px;font-weight:600;display:inline-block;color:${color};width:40px;text-align: center;">排名</span>
                <span style="line-height:30px;font-weight:600;display:inline-block;color:${color};width:${nameWidth};text-align: left;">名称</span>
                <span style="line-height:30px;font-weight:600;display:inline-block;color:${color};width:${numWidth};text-align: right;padding:0 5px;">${_get(
                  data[0],
                  `fieldLabelConfig[${value?.area}]`,
                  '面积',
                )}</span>
                <span style="line-height:30px;font-weight:600;display:inline-block;color:${color};width:${numWidth};text-align: right;padding:0 5px;">${_get(
                  data[0],
                  `fieldLabelConfig[${value?.color}]`,
                  '颜色',
                )}</span>
                <span style="line-height:30px;font-weight:600;display:inline-block;color:${color};width:${numWidth};text-align: right;padding:0 5px;">${_get(
                  data[0],
                  `fieldLabelConfig[${value?.numValue}]`,
                  '数值',
                )}</span>
              </div>`;
                newData.forEach((item: any, i: number) => {
                  if (item.ranking === index + 1) {
                    color = '#fff';
                    suspensionSortList += `<div style="background:${info.color};padding-bottom:5px;"  key=${i}>`;
                  } else {
                    color = '#000';
                    suspensionSortList += `<div style="padding-bottom:5px;" key=${i}>`;
                  }
                  suspensionSortList += `<span style="display:inline-block;vertical-align: middle;color:${color};width:40px;text-align: center;">${
                    item.ranking
                  }</span>
                  <span style="display:inline-block;vertical-align: middle;color:${color};width:${nameWidth};text-align: left;white-space: nowrap;text-overflow:ellipsis;overflow: hidden;">${
                    item.name
                  }</span>
                  <span style="display:inline-block;vertical-align: middle;color:${color};width:${numWidth};text-align: right;padding:0 5px;">${
                    item[item.area].showValue
                  }</span>
                  <span style="display:inline-block;vertical-align: middle;color:${color};width:${numWidth};text-align: right;padding:0 5px;">${
                    item[item.color].showValue
                  }</span>
                  <span style="display:inline-block;vertical-align: middle;color:${color};width:${numWidth};text-align: right;padding:0 5px;">${
                    item[item.numValue].showValue
                  }</span>
                </div>`;
                });
                return (suspensionSortList += `</div>`);
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
              const paramsData = _get(params, 'data', []);
              const { showValue } = _get(paramsData, `${paramsData.color}`, {});
              const arr = [`{name|${params.name}}`, `{budget|${showValue || '-'}}`];
              return arr.join('\n');
            },
            rich: {
              budget: {
                fontSize: 12,
                color: '#ffffffb8',
                align: 'center',
                padding: [1, 18],
              },
              label: {
                fontSize: 12,
                backgroundColor: 'rgba(0,0,0,0.3)',
                color: '#ffffffb8',
                borderRadius: 2,
                lineHeight: 25,
                verticalAlign: 'middle',
              },
              name: {
                fontSize: 12,
                color: '#ffffffb8',
                align: 'center',
                padding: [1, 15],
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
              levels: getLevelOption,
              data,
              emphasis: {
                // itemStyle:{
                //   color:'#0000033'
                // },
                label: {
                  rich: {
                    budget: {
                      fontSize: 12,
                      align: 'center',
                      color: '#fff',
                      padding: [1, 18],
                    },
                    label: {
                      fontSize: 9,
                      verticalAlign: 'middle',
                    },
                    name: {
                      fontSize: 12,
                      color: '#fff',
                      align: 'center',
                      padding: [1, 15],
                    },
                  },
                },
              },
            },
          ],
        },
        true,
      );
    },
    [cloudChartData],
  );

  useEffect(() => {
    let min = -4;
    let max = 4;
    const newNavAtmAdd: any[] = [];
    const newNavAtmAddArr: any[] = [];
    let isEqual = false;

    cloudChartData.forEach((item) => {
      if (Array.isArray(item.children)) {
        newNavAtmAddArr.push(...item.children);
        item.children.forEach((cur) => {
          newNavAtmAdd.push(cur[cur.color]);
        });
      }
    });

    for (let i = 0; i < newNavAtmAddArr.length; i++) {
      if (
        newNavAtmAddArr[i][newNavAtmAddArr[i].area].value ===
          newNavAtmAddArr[i][newNavAtmAddArr[i].color].value &&
        newNavAtmAddArr[i].value[1] === 1
      ) {
        isEqual = true;
        break;
      }
    }

    if (newNavAtmAdd.length) {
      newNavAtmAdd.sort((a, b) => {
        return a.value - b.value;
      });

      min = newNavAtmAdd[0].value;
      max = newNavAtmAdd[newNavAtmAdd.length - 1].value;

      if (isEqual) {
        props.getNum(newNavAtmAdd[0], 0);
      } else {
        props.getNum(newNavAtmAdd[0], newNavAtmAdd[newNavAtmAdd.length - 1]);
      }

      if (cloudChartData.length !== 0) {
        renderChart(cloudChartData, min, max, 10);
      }
    } else {
      props.getNum(0, 0);
    }
  }, [cloudChartData]);

  return <div style={{ width: '100%', height: '90%' }} ref={ref} />;
};
export default CloudChart;

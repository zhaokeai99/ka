const colors = require('@ant-design/colors');

// 目前portal在用的自定义蓝色
const selfBlueColors = [
  '#c0d5fd',
  '#94b8ff',
  '#84adfd',
  '#5e93fd',
  '#387bfb',
  '#3277fc',
  '#3176fc',
  '#0026ff',
  '#3d3fd1',
  '#041763',
];

// 克莱因蓝
const clyBlueColors = [
  '#cfd9e6',
  '#8babd9',
  '#628bcc',
  '#3d6bbf',
  '#1d4cb3',
  '#002fa7',
  '#002080',
  '#001359',
  '#000933',
  '#00020d',
];

// 定义颜色字段名，用来在newColors取值
/* eslint-disable */
const selfBlue = 'selfBlueColors';
const gold = 'gold';
const cyan = 'cyan';
const purple = 'purple';
const red = 'red';
const volcano = 'volcano';
const orange = 'orange';
const green = 'green';
const grey = 'grey';
const clyBlue = 'clyBlueColors';
/* eslint-enable */

// =================  记录当前主题颜色index， 以后切js相关换主题就能通过换这个index一个值就可以了  =====================
const themeIndex = selfBlue;

// 做成一个大集合，带自定义颜色
const newColors = {
  selfBlueColors,
  ...colors,
  clyBlueColors,
};

// 计算后的主题色值
const thmemesColors = {
  // blue
  primaryColor1: newColors[themeIndex][0], // 主题色渐变色1
  primaryColor2: newColors[themeIndex][1], // 主题色渐变色2
  primaryColor3: newColors[themeIndex][2], // 主题色渐变色3
  primaryColor4: newColors[themeIndex][3], // 主题色渐变色4
  primaryColor5: newColors[themeIndex][4], // 主题色渐变色5
  primaryColor6: newColors[themeIndex][5], // 主题色渐变色6
  primaryColor7: newColors[themeIndex][6], // 主题色渐变色7
  primaryColor8: newColors[themeIndex][7], // 主题色渐变色8
  primaryColor9: newColors[themeIndex][8], // 主题色渐变色9
  primaryColor10: newColors[themeIndex][9], // 主题色渐变色10
};

module.exports = {
  ...thmemesColors,
  primaryColor: thmemesColors.primaryColor6, // 主题色
  primaryBgColor: '#fff', // 主题背景色
  primaryBgColor1: thmemesColors.primaryColor2, // 主题背景色1
  primaryBgColor2: thmemesColors.primaryColor3, // 主题背景色2
  primaryBgColor3: thmemesColors.primaryColor1, // 主题背景色3
  primaryBgColor4: '#e9e9e9', // 主题背景色4
  primaryBgColor5: '#edf0f7', // 主题背景色5
  // global
  negativeColor: '#03A587', // 负数颜色
  positiveColor: '#FF4A4A', // 正数颜色
  staticCardBgColor: '#E5EDFE', // 指标卡背景色
  staticCardValueColor: '#285CFA', // 指标卡value颜色
  contentPadding: '12px', // 内容区内边距
  cardGutter: 8, // 卡片边距
  // Production/Classify/NodeTree
  defaultStateStylesHoverStroke: thmemesColors.primaryColor4,
  defaultNodeStyleFill: '#F3F7FF',
  defaultNodeStyleStroke: thmemesColors.primaryColor7,
  defaultEdgeStyleStroke: '#A3B1BF',
  defaultEdgeStyleEndArrowFill: thmemesColors.primaryColor2,
  defaultLabelCfgStyleFill: '#000',
  iconNodeOptionsStroke: thmemesColors.primaryColor9,
  iconNodeOptionsFill: '#fff',
  iconNodeShapeRectFill: '#8c8c8c',
  iconNodeShapeTextFill: '#ffffff',
  iconNodeShapeMarkerCollapseFill: '#fff',
  iconNodeShapeMarkerCollapseStroke: '#666',
  iconNodeShapeMarkerAddStroke: thmemesColors.primaryColor9,
  iconNodeShapeMarkerRemoveStroke: '#5C5C5C',
  traverseTreeLeftIconStyleFill: thmemesColors.primaryColor7,
  traverseTreeLeftIconStyleStroke: thmemesColors.primaryColor1,

  // 指数地图
  indexMapColorRange: '#fdbaba-#f71f1f',
  indexMapBorderColor: '#781cd3',
};

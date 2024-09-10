// 这是UI组件的item描述
export interface UIComponentItem {
  id: string; // 录入的UI组件英文名，唯一id
  componentName: string; // 组建的真实导出名称
  keywords: string; // 关键字，辅助搜索
  category: string; // 类别 辅助分类的
  props: string; // 大json
  /**
  [
    {
        "key":"mainTitle",
        "label":"饼图中心描述",
        "highLevel":false,
        "inputType":"text"
    },
    {
        "key":"dynamicParams",
        "label":"动态参数",
        "highLevel":false,
        "inputType":"array"
    },
    {
        "key":"widthSpan",
        "label":"占宽",
        "highLevel":false,
        "inputType":"select",
        "enumValues":{
            "4":4,
            "6":6,
            "8":8,
            "12":12
        }
    }
  ]
  目前可选类型 
  select，text, number, object, array, bool，每个类型也有自己的描述，准备直接写死几个小json
  */
  lastVersion: string; // props的上一版本，方便回滚
  title: string; // 标题 辅助用户选择
  description: string; // 描述 辅助用户选择
  imgUrl: string; // 组件缩略图 方便展示列表，而不用真实渲染组件
  modifier: string; // 修改者
  modifiedTime: string; // 修改时间
} // 这个组件暂时没有归属的概念

// 这是业务组件的item描述
export interface BizComponentItem {
  id: string; // 录入的业务组件英文名，唯一id
  keywords: string; // 关键字，辅助搜索
  category: string; // 类别 辅助分类的
  uiComponent: string; // ui组件的id
  props: string; // 大json
  /** {
     "mainTitle":"销售额类占比",
     "pieTitle":"图标标题",
     "centerDesc":"销售额",
     "componentDesc":"这是一个饼图用于描述组件右上角的问号",
     "serviceAPI":"api.getProductPie",
     "dynamicParams":["productId"],
     "staticParams":{"userId":"xinxin","pageSize":10},
     "feedBackParams":["selectProduct"],
     "widthSpan":8,
     "heightSpan":6
    }
  */
  app: string; // 业务组件归属应用
  lastVersion: string; // props的上一版本，方便回滚
  title: string; // 标题 辅助用户选择
  description: string; // 描述 辅助用户选择
  imgUrl: string; // 组件缩略图 方便展示列表，而不用真实渲染组件
  owner: string; // 所有人，目前可能会设计成owner独有的，不允许别人修改，别人要用，只能复制，再新增这样
  modifier: string; // 修改者
  modifiedTime: string; // 修改时间
}

// 这是页面的item描述
export interface PageItem {
  id: string; // 录入的页面英文名，唯一id
  keywords: string; // 关键字，辅助搜索
  category: string; // 类别 辅助分类的
  layout: string; // 大json
  /**
   [{
    "position":[ 0,0,2,2], // x,y,w,h
    "itemId":"product_table_list"
    },
    {
    "position":[ 2,0,2,2 ],
    "itemId":"product_pie_chart"
    },
    {
    "position":[ 4,0,2,2 ],
    "itemId":"sell_trend_chart"
    }]
   */
  lastVersion: string; // props的上一版本，方便回滚
  title: string; // 标题 辅助用户选择
  description: string; // 描述 辅助用户选择
  owner: string; // 所有人，目前可能会设计成owner独有的，不允许别人修改，别人要用，只能复制，再新增这样
  modifier: string; // 修改者
  modifiedTime: string; // 修改时间
}

// 这个是描述UI组件每个字段的类型的，目前就6个类型
export const UIEditPropsType = [
  {
    type: 'select',
    props: {
      key: 'string', // 需要在录入UI组件时录入这些信息
      label: 'string',
      highLevel: 'bool',
      enumValues: 'object', // textArea
    },
  },
  {
    type: 'text',
    props: {
      key: 'string', // 需要在录入UI组件时录入这些信息
      label: 'string',
      highLevel: 'bool',
    },
  },
  {
    type: 'object',
    props: {
      key: 'string', // 需要在录入UI组件时录入这些信息
      label: 'string',
      highLevel: 'bool',
    },
  },
  {
    type: 'array',
    props: {
      key: 'string', // 需要在录入UI组件时录入这些信息
      label: 'string',
      highLevel: 'bool',
    },
  },
  {
    type: 'bool',
    props: {
      key: 'string', // 需要在录入UI组件时录入这些信息
      label: 'string',
      highLevel: 'bool',
    },
  },
  {
    type: 'array',
    props: {
      key: 'string', // 需要在录入UI组件时录入这些信息
      label: 'string',
      highLevel: 'bool',
    },
  },
];

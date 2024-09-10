import { useRef, useEffect, memo } from 'react';
import G6 from '@antv/g6';
import {
  defaultStateStylesHoverStroke,
  defaultNodeStyleFill,
  defaultNodeStyleStroke,
  defaultEdgeStyleStroke,
  defaultEdgeStyleEndArrowFill,
  defaultLabelCfgStyleFill,
  iconNodeOptionsStroke,
  iconNodeOptionsFill,
  iconNodeShapeRectFill,
  iconNodeShapeTextFill,
  iconNodeShapeMarkerCollapseFill,
  iconNodeShapeMarkerCollapseStroke,
  iconNodeShapeMarkerAddStroke,
  iconNodeShapeMarkerRemoveStroke,
  traverseTreeLeftIconStyleFill,
  traverseTreeLeftIconStyleStroke,
} from '@/themes/index';
import './index.less';

const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
  return [
    ['M', x - r, y - r],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x + 2 - r, y - r],
    ['L', x + r - 2, y - r],
  ];
};

const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
  return [
    ['M', x - r, y - r],
    ['a', r, r, 0, 1, 0, r * 2, 0],
    ['a', r, r, 0, 1, 0, -r * 2, 0],
    ['M', x + 2 - r, y - r],
    ['L', x + r - 2, y - r],
    ['M', x, y - 2 * r + 2],
    ['L', x, y - 2],
  ];
};

const defaultStateStyles = {
  hover: {
    stroke: defaultStateStylesHoverStroke, // '#1890ff'
    lineWidth: 2,
  },
};

const defaultNodeStyle = {
  fill: defaultNodeStyleFill, // '#F3F7FF'
  stroke: defaultNodeStyleStroke, // '#3759B0'
  radius: 5,
};

const defaultEdgeStyle = {
  stroke: defaultEdgeStyleStroke, // '#A3B1BF'
  endArrow: {
    path: 'M 0,0 L 12, 6 L 9,0 L 12, -6 Z',
    fill: defaultEdgeStyleEndArrowFill, //'#91d5ff',
    d: -20,
  },
};

const defaultLabelCfg = {
  style: {
    fill: defaultLabelCfgStyleFill, //'#000'
    fontSize: 12,
  },
};

const defaultLayout = {
  type: 'compactBox',
  direction: 'TB',
  getId: function getId(d) {
    return d.id;
  },
  getHeight: function getHeight() {
    return 16;
  },
  getWidth: function getWidth() {
    return 16;
  },
  getVGap: function getVGap() {
    return 40;
  },
  getHGap: function getHGap() {
    return 70;
  },
};

G6.registerNode(
  'icon-node',
  {
    options: {
      size: [60, 20],
      stroke: iconNodeOptionsStroke, // '#73D13D'
      fill: iconNodeOptionsFill, // '#fff'
    },
    draw(cfg: any, group: any) {
      const styles = this.getShapeStyle(cfg);
      const { labelCfg = {} } = cfg;

      const keyShape = group.addShape('rect', {
        attrs: {
          ...styles,
          x: 0,
          y: 0,
        },
      });

      if (cfg.leftIcon) {
        const { style } = cfg.leftIcon;
        group.addShape('rect', {
          attrs: {
            x: 10,
            y: 8,
            width: 24,
            radius: 12,
            height: styles.height - 16,
            fill: iconNodeShapeRectFill, // '#8c8c8c'
            ...style,
          },
        });

        group.addShape('text', {
          attrs: {
            text:
              (cfg.editType === 0 && '系') ||
              (cfg.editType === 1 && '自') ||
              ((cfg.editType === 2 || cfg.editType === 4) && cfg.fundCount),
            x: 22,
            y: 21,
            fill: iconNodeShapeTextFill, // '#ffffff'
            fontSize: 12,
            textAlign: 'center',
            textBaseline: 'middle',
            fontWeight: 'bold',
          },
          name: 'text-shape',
        });
      }

      if (cfg.children) {
        group.addShape('marker', {
          attrs: {
            x: 60,
            y: 40,
            r: 6,
            cursor: 'pointer',
            symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
            stroke: iconNodeShapeMarkerCollapseStroke, // '#666'
            lineWidth: 1,
            fill: iconNodeShapeMarkerCollapseFill, // '#fff'
          },
          name: 'collapse-icon',
        });
      }

      // 如果不需要动态增加或删除元素，则不需要 add 这两个 marker
      if (cfg.editType === 2 || cfg.editType === 1) {
        group.addShape('marker', {
          attrs: {
            x: 80,
            y: 55,
            r: 6,
            stroke: iconNodeShapeMarkerAddStroke, // '#73d13d'
            cursor: 'pointer',
            symbol: EXPAND_ICON,
          },
          name: 'add-item',
        });
      }

      if (cfg.editType === 2) {
        group.addShape('marker', {
          attrs: {
            x: 40,
            y: 55,
            r: 6,
            stroke: iconNodeShapeMarkerRemoveStroke, // '#5C5C5C'
            cursor: 'pointer',
            symbol: COLLAPSE_ICON,
          },
          name: 'remove-item',
        });
      }

      if (cfg.title) {
        group.addShape('text', {
          attrs: {
            ...labelCfg.style,
            text: cfg.title.length > 6 ? `${cfg.title.slice(0, 6)}...` : cfg.title,
            x: 78,
            y: 25,
            textAlign: 'center',
          },
        });
      }

      return keyShape;
    },
    update: undefined,
    setState(name, value, item: any) {
      if (name === 'collapsed') {
        const marker = item.get('group').find((ele: any) => ele.get('name') === 'collapse-icon');
        const icon = value ? G6.Marker.expand : G6.Marker.collapse;
        marker.attr('symbol', icon);
      }
    },
  },
  'rect',
);

G6.registerEdge('flow-line', {
  draw(cfg: any, group: any) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;

    const { style } = cfg;
    const shape = group.addShape('path', {
      attrs: {
        stroke: style.stroke,
        endArrow: style.endArrow,
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', startPoint.x, (startPoint.y + endPoint.y) / 2],
          ['L', endPoint.x, (startPoint.y + endPoint.y) / 2],
          ['L', endPoint.x, endPoint.y],
        ],
      },
    });

    return shape;
  },
});

let dom: any = null;
let graph: any = null;
let holdHeight = 0;

function NodeTree({
  data,
  onClickAdd = () => {},
  onClickRemove = () => {},
  onClickNode = () => {},
}: any) {
  const ref = useRef(null);

  useEffect(() => {
    if (!data) return;
    G6.Util.traverseTree(data, (d: any) => {
      d.leftIcon = {
        style: {
          fill: traverseTreeLeftIconStyleFill, //'#3759B0'
          stroke: traverseTreeLeftIconStyleStroke, // '#e6fffb'
        },
      };

      const classNames = d.value.split('-');
      if (classNames.length > 2 && classNames[1] !== '我的分类' && classNames[1] !== '系统功能') {
        d.collapsed = true;
      }
      return true;
    });
    if (graph) {
      graph.read(data);
      graph.fitView();
      return;
    }
    const minimap = new G6.Minimap({
      size: [150, 100],
    });

    dom = ref.current || document.documentElement;

    const width = dom.scrollWidth;
    const height = document.documentElement.scrollHeight - 200;
    holdHeight = height;

    graph = new G6.TreeGraph({
      container: ref?.current || '',
      width,
      height,
      linkCenter: true,
      plugins: [minimap],
      modes: {
        default: ['drag-canvas', 'zoom-canvas'],
      },
      defaultNode: {
        type: 'icon-node',
        size: [120, 40],
        style: defaultNodeStyle,
        labelCfg: defaultLabelCfg,
      },
      defaultEdge: {
        type: 'flow-line',
        style: defaultEdgeStyle,
      },
      nodeStateStyles: defaultStateStyles,
      edgeStateStyles: defaultStateStyles,
      layout: defaultLayout,
    });

    graph.data(data);
    graph.render();
    graph.fitView();

    graph.on('node:mouseenter', (evt: any) => {
      const { item } = evt;
      graph.setItemState(item, 'hover', true);
    });

    graph.on('node:mouseleave', (evt: any) => {
      const { item } = evt;
      graph.setItemState(item, 'hover', false);
    });

    graph.on('node:click', (evt: any) => {
      const { item, target } = evt;
      const targetType = target.get('type');
      const name = target.get('name');
      const model = item?.getModel();

      if (!model) return;

      if (name === 'collapse-icon') {
        model.collapsed = !model.collapsed;
        graph.setItemState(item, 'collapsed', model.collapsed);
        graph.layout(true);
      }

      // 增加元素
      if (targetType === 'marker') {
        if (name === 'add-item') {
          onClickAdd(graph, model);
        } else if (name === 'remove-item') {
          onClickRemove(graph, model);
        }
      } else {
        if (model.editType === 2 || model.editType === 4) {
          onClickNode(graph, model);
        }
      }

      // graph.focusItem(item, true, {
      //   easing: 'easeCubic',
      //   duration: 400,
      // });
    });
  }, [data]);

  useEffect(
    () => () => {
      graph = null;
      dom = null;
      holdHeight = 0;
    },
    [],
  );

  // 监听resize
  useEffect(() => {
    function onResize() {
      if (!graph || graph.get('destroyed')) return;
      if (!dom || !dom.offsetWidth) return;

      graph.changeSize(dom.offsetWidth, holdHeight);
      graph.fitView();
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  if (!data) return null;

  return <div ref={ref} />;
}

export default memo(NodeTree);

import React, { useEffect, memo } from 'react';
import G6 from '@antv/g6';
import styles from './index.less';

const data = {
  nodes: [
    {
      id: 'node0',
      size: 60,
      label: '平总',
      x: 200,
      y: 200 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 30,
      },
    },
    {
      id: 'node1',
      size: 40,
      label: '李总',
      x: 370,
      y: 200 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node2',
      size: 40,
      label: '张总',
      x: 347,
      y: 285 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node3',
      size: 40,
      label: '吴总',
      x: 285,
      y: 347 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node4',
      size: 40,
      label: '王总',
      x: 200,
      y: 370 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node5',
      size: 40,
      label: '刘总',
      x: 53,
      y: 285 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node6',
      size: 40,
      label: '胡总',
      x: 30,
      y: 200 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node7',
      size: 40,
      label: '雅总',
      x: 53,
      y: 115 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node8',
      size: 40,
      label: '明总',
      x: 115,
      y: 53 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node9',
      size: 40,
      label: '赵总',
      x: 200,
      y: 30 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node10',
      size: 40,
      label: '张总',
      x: 285,
      y: 53 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node11',
      size: 40,
      label: '康总',
      x: 347,
      y: 115 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
    {
      id: 'node12',
      size: 40,
      label: '牛总',
      x: 115,
      y: 347 - 5,
      img: require('./contact_default.png'),
      type: 'image',
      labelCfg: {
        position: 'bottom',
        style: {
          stroke: '#88DEF6',
        },
      },
      // 裁剪图片配置
      clipCfg: {
        show: true,
        type: 'circle',
        r: 20,
      },
    },
  ],
  edges: [
    {
      source: 'node0',
      target: 'node1',
      label: '同学',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node2',
      label: '朋友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node3',
      label: '亲友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node4',
      label: '同学',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node5',
      label: '同学',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node6',
      label: '朋友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node7',
      label: '同学',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node8',
      label: '朋友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node9',
      label: '亲友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node10',
      label: '朋友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node11',
      label: '亲友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
    {
      source: 'node0',
      target: 'node12',
      label: '朋友',
      labelCfg: {
        style: {
          stroke: '#BFF688',
        },
      },
    },
  ],
};

const PieChart: React.FC<any> = ({}) => {
  useEffect(() => {
    const container = document.getElementById('container-relation');

    const width = 400;
    const height = 400;
    const graph = new G6.Graph({
      container: 'container-relation',
      width,
      height,
      modes: {
        default: [
          //   'drag-canvas',
          //   'drag-node',
          //   {
          //     type: 'zoom-canvas',
          //     fixSelectedItems,
          //   },
        ],
        // edit: ['click-select'],
      },
      //   defaultNode: {
      //     size: [10, 10],
      //     style: {
      //       lineWidth: 2,
      //       fill: '#DEE9FF',
      //       stroke: '#5B8FF9',
      //     },
      //   },
      defaultNode: {
        type: 'image',
        label: 'AntV Team',
        // 其他配置
      },
      defaultEdge: {
        size: 1,
        style: {
          stroke: '#e2e2e2',
          lineAppendWidth: 2,
        },
      },
      nodeStateStyles: {
        yourStateName: {
          stroke: '#f00',
          lineWidth: 3,
        },
      },
      edgeStateStyles: {
        yourStateName: {
          stroke: '#f00',
          lineWidth: 3,
        },
      },
    });

    graph.on('node:click', (e) => {
      console.log('node:click', e.item);
      graph.setItemState(e.item, 'yourStateName', true);
    });
    graph.on('edge:click', (e) => {
      graph.setItemState(e.item, 'yourStateName', true);
    });

    graph.on('canvas:click', () => {
      graph.findAllByState('node', 'yourStateName').forEach((node) => {
        graph.setItemState(node, 'yourStateName', false);
      });
      graph.findAllByState('edge', 'yourStateName').forEach((edge) => {
        graph.setItemState(edge, 'yourStateName', false);
      });
    });

    graph.data(data);
    graph.render();

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight - 40);
      };
  }, []);

  return (
    <div className={styles['container']}>
      <h2>公务员网络</h2>
      <div id="container-relation" className={styles['chart-container']}></div>
    </div>
  );
};

export default memo(PieChart);

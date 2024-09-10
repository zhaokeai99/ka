import React, { useMemo } from 'react';
import { Tabs, TabsProps } from 'antd';
interface IBondTabLayout {
  options: TabsProps;
  children: BondTabPaneChild | BondTabPaneChild[];
}

interface IBondTabLayoutChildren {
  title?: string;
  value?: string;
}

type BondTabPaneChild = React.ReactElement<IBondTabLayoutChildren>;

const BondTabLayout: React.FC<IBondTabLayout> = ({ options, children }) => {
  const bondTabChildren = useMemo(() => {
    if (Array.isArray(children)) {
      return children;
    } else {
      return [children];
    }
  }, [children]);
  if (!children) return null;
  return (
    <Tabs size="small" {...options}>
      {React.Children.map(bondTabChildren, (child: BondTabPaneChild) => {
        const { props } = child ?? {};
        return (
          <Tabs.TabPane key={props?.value} tab={props?.title} style={{ borderWidth: 0 }}>
            {React.cloneElement(child, {
              ...props,
              key: props?.value,
            })}
          </Tabs.TabPane>
        );
      })}
    </Tabs>
  );
};

export default BondTabLayout;

import React from 'react';
import styles from './index.less';

interface propsType {
  onChange: (val: string) => void;
  activeMenuPath: string;
  menus: any;
}

const HeaderMenus: React.FC<any> = ({ onChange, activeMenuPath, menus }: propsType) => {
  // const [defaultProduct, setProduct] = useState(defaultValue || menus[1]?.path);

  const handleProductChange = (value: any) => {
    // setProduct(value);
    onChange(value);
  };

  return (
    <>
      {menus
        ?.filter((item: any) => !item.hideInMenu)
        .map((item: any) => {
          return (
            <div
              key={item.path}
              className={
                item.path === activeMenuPath
                  ? `${styles['item-li']} ${styles['active-key']}`
                  : styles['item-li']
              }
              onClick={() => handleProductChange(item.path)}
            >
              {item.name}
            </div>
          );
        })}
    </>
  );
};

export default HeaderMenus;

import React, { useCallback, useEffect, useState } from 'react';
import { Menu, Spin, Empty } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { IIndustySearchParams } from '../data';
import { MenuInfo } from 'rc-menu/lib/interface';
import styles from '../index.less';
import { queryIndustryTree } from '../service';

interface ISelectMenuPropsType {
  params: IIndustySearchParams;
  onChangeParams: (e: IIndustySearchParams) => void;
}

const SelectMenu: React.FC<ISelectMenuPropsType> = ({ params, onChangeParams }) => {
  const [menuItems, setMenuItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, success } = await queryIndustryTree();
      if (success) {
        const items = data?.map((v: any) => ({
          label: v?.industryName,
          key: `${v?.industryId}`,
        }));
        const currentId = items?.[0]?.key;
        const currentName = items?.[0]?.label;
        setMenuItems(items ?? []);
        onChangeParams({
          //初始化默认第一个
          industryId: currentId,
          industryName: currentName,
        });
        setLoading(false);
      } else {
        setLoading(false);
      }
    })();
  }, []);

  const onMenuClick = useCallback(
    (e: MenuInfo) => {
      const industryName = findIndustryName(menuItems, e?.key);
      onChangeParams({
        industryId: e.key ?? '',
        industryName: industryName ?? '',
      });
    },
    [params],
  );

  function findIndustryName(array: any[], targetKey: string) {
    return array?.find((v: any) => v?.key === targetKey)?.label;
  }

  return (
    <div className={styles['select-menu-box']}>
      <Spin spinning={loading}>
        {menuItems?.length > 0 ? (
          <Menu
            mode="vertical"
            items={menuItems}
            onClick={onMenuClick}
            selectedKeys={[`${params?.industryId}`]}
            className={styles['select-menu']}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Spin>
    </div>
  );
};

export default SelectMenu;

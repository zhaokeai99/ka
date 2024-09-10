import styles from './index.less';

const iconUrl = 'https://cdnprod.tianhongjijin.com.cn/thfile/no_permission_icon1663226672987.png';

const NoPermissionPage = () => {
  return (
    <div className={styles['no-permission-container']}>
      <img src={iconUrl} alt="" />
      <span className={styles['no-permission-text']}>暂无权限</span>
      <span>抱歉，您无权限访问此页面，请联系该页面管理员（页面右下角）</span>
    </div>
  );
};

export default NoPermissionPage;

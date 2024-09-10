import styles from './index.less';

export default function (props: {
  data: any[];
  selectTypeChange: (arg0: any) => any;
  sectorId: any;
}) {
  return (
    <div className={styles['container']}>
      {(props?.data || []).map((item: any) => (
        <div
          key={item.sectorName}
          onClick={() => {
            props?.selectTypeChange(item);
          }}
          className={styles[`item${props?.sectorId === item.sectorId ? '-select' : ''}`]}
        >
          <div className={styles['type']}>{item.sectorName || ''}</div>
          <div className={styles['label']}>{'市占率'}</div>
          <div className={styles['percent']}>
            {(item.thMarketShare * 100).toFixed(2) + '%' || '--'}
          </div>
        </div>
      ))}
    </div>
  );
}

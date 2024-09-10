import { useState, useEffect } from 'react';
import { queryFundNavAndHolderRankList } from './service';
import styles from './index.less';

export default function IndexRadar({ title = '', sectorId = '', floodFund = null }) {
  const [list, setList] = useState([
    {
      rank: 0,
      fundName: '',
      totalScale: '',
      isThfund: false,
    },
  ]);

  useEffect(() => {
    (async () => {
      const data = sectorId && (await queryFundNavAndHolderRankList({ sectorId, floodFund }));

      if (data?.length > 10) {
        data.splice(10, 0, {
          fundName: '......',
        });
      }

      setList(data);
    })();
  }, [sectorId, floodFund]);

  return (
    <div className={styles['list-box']}>
      <div className={styles['title']}>
        <span className={styles['type']}>{title || ''}</span>
        <span> - 产品Top10</span>
      </div>

      <div className={styles['list-container']}>
        {list?.length
          ? list?.map(({ rank, isThfund, fundName, totalScale }) =>
              fundName === '......' ? (
                <div
                  className={styles[`item${isThfund ? '-th' : ''}`]}
                  style={{ textAlign: 'center' }}
                >
                  {fundName}
                </div>
              ) : (
                <div
                  className={styles[`item${isThfund ? '-th' : ''}`]}
                  title={rank + '. ' + (fundName + '  ' + totalScale)}
                >
                  {rank + '. ' + fundName + '  ' + totalScale || '--'}
                </div>
              ),
            )
          : null}
      </div>
    </div>
  );
}

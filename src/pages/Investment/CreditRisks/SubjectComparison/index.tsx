import Anchor from '@/components/Anchor';
import ProCardPlus from '@/components/ProCardPlus';
import { cardGutter, contentPadding } from '@/themes/index';
import React, { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import EditHeader from '../Components/EditHeader';
import TitleExtra from '../Components/TitleExtra';
import { queryFinancialRepByComp, queryLastWkDayByNow, queryQuarterList } from '../service';
import Bond from './bond';
import { map as _map } from 'lodash';
import FinancialInformation from './FinancialInformation';
import moment from 'moment';

const SubjectComparison = () => {
  const [dateArr, setDateArr] = useState([]);
  const [dateString, setDateString] = useState(
    moment(new Date()).subtract(1, 'days').format('YYYY-MM-DD'),
  );
  const [fundCodes, setFundCodes] = useState(() => {
    const pathname = history.location.pathname;
    const paths = pathname.split('/_single_/');
    const fundCodesStr = paths[1] || '';
    if (!fundCodesStr || fundCodesStr === ':fundCodes') return [];
    return fundCodesStr.split(',').map((str: string, i: number) => ({
      index: i,
      key: str,
    }));
  });

  useEffect(() => {
    (async () => {
      const result = await queryQuarterList({});
      setDateArr(result);
      const res = await queryLastWkDayByNow({});
      setDateString(res);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (fundCodes.length) {
        const result = await queryFinancialRepByComp({
          compIds: _map(fundCodes, 'key'),
          LDate: dateString,
        });
        if (result[0]?.listData.length) {
          setDateArr(result[0]?.listData);
        } else {
          const res = await queryQuarterList({});
          setDateArr(res);
        }
      } else {
        setDateArr(dateArr);
      }
    })();
  }, [fundCodes]);

  const getData = useCallback(() => {
    const aData = [
      {
        id: 'bond',
        title: '债券',
      },
    ];
    if (dateArr.length) {
      dateArr.forEach((item: any) => {
        aData.push({
          id: `financialInformation${item.quarterName}`,
          title: item.quarterName,
        });
      });
    }
    return aData;
  }, [dateArr]);

  const onChange = (date: any) => {
    setDateString(date);
  };

  return (
    <ProCardPlus
      gutter={[0, cardGutter]}
      style={{ padding: contentPadding, minHeight: '1000px' }}
      ghost
      direction="column"
    >
      {dateString ? (
        <EditHeader
          title={'主体对比'}
          data={fundCodes}
          dateString={dateString}
          setData={setFundCodes}
          change={onChange}
          replacePath="#/investment/creditRisks/subjectComparison/_single_/"
        />
      ) : (
        ''
      )}

      <ProCardPlus title="债券" ghost extra={<TitleExtra id="bond" />}>
        <Bond fundCodes={fundCodes} dateString={dateString} />
      </ProCardPlus>
      {dateArr.length
        ? dateArr.map((item: any) => {
            return (
              <>
                <ProCardPlus
                  title={item.quarterName}
                  ghost
                  extra={<TitleExtra id={`financialInformation${item.quarterName}`} />}
                >
                  <FinancialInformation
                    quarterName={item.quarterName}
                    fundCodes={fundCodes}
                    dateString={dateString}
                  />
                </ProCardPlus>
              </>
            );
          })
        : ''}
      {getData().length ? <Anchor data={[...getData()]} /> : ''}
    </ProCardPlus>
  );
};

export default SubjectComparison;

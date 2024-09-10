import { useContext, useEffect, useState } from 'react';
import ProCardPlus from '@/components/ProCardPlus';
import Tag from '@/pages/IndustrialChain/components/Tag';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Empty, Tooltip } from 'antd';
import { history } from 'umi';
import { IndustryProvider, queryReportInfoListByIndustryName } from '../../service';
import styles from './index.less';

const color = ['#4568F5', '#F27C49', '#545FC8', '#E673C0'];
const backgroungColor = ['#F0F5FF ', '#FFF2EB', '#EBEBFF', '#FFF0F6'];

const Report = () => {
  const { industryName } = useContext(IndustryProvider);
  const [reportList, setReportList] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const result = await queryReportInfoListByIndustryName({ industryName });
      setReportList(result);
    })();
  }, [industryName]);

  // 标签对应关系
  const toolTipTitle = (data: any) => (
    <div style={{ lineHeight: '30px' }}>
      {data?.map((i: any, k: number) => (
        <Tag key={k} color={color[k]} backgroundColor={backgroungColor[k]}>
          {i}
        </Tag>
      ))}
    </div>
  );

  return (
    <ProCardPlus
      ghost
      title={
        <>
          <span>研究报告</span>
          <Tooltip title={toolTipTitle(['情绪标签', '行业标签', '报告类型', '产品标签'])}>
            <QuestionCircleOutlined style={{ marginLeft: 5, fontSize: 12 }} />
          </Tooltip>
        </>
      }
      extra={
        <a style={{ fontSize: 12 }} href="#/industrialChain/restoAnalyse">
          更多研究报告 &gt;
        </a>
      }
      className={styles['report-container']}
    >
      {reportList?.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ul className={styles['report-list']}>
          {reportList?.map((item: any, index: number) => (
            <li
              key={index}
              className={styles['list-item']}
              onClick={() => {
                history.push(`/industrialChain/reportDetail/${item?.reportId}`);
              }}
            >
              <div title={item?.ratingMemo} className={styles['item-content']}>
                {item.ratingMemo.trim()}
              </div>
              <div className={styles['item-footer']}>
                {item.ratingDt}&nbsp;&nbsp;|&nbsp;&nbsp;{item.ratingInstitute}
              </div>
              <div title={item?.tagList.join(', ')} className={styles['tag-container']}>
                {item?.tagList.map((i: any, k: number) => (
                  <Tag color={color[k]} backgroundColor={backgroungColor[k]} key={k}>
                    {i}
                  </Tag>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </ProCardPlus>
  );
};

Report.isProCard = true;

export default Report;

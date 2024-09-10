import { useEffect, useState, useRef } from 'react';
import ProCard from '@ant-design/pro-card';
import ProCardPlus from '@/components/ProCardPlus';
import { Checkbox, message } from 'antd';
import { cardGutter } from '@/themes';
import BoothComponent from '@/components/boothComponent';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import styles from './index.less';
import {
  queryRiskStatementData,
  saveRiskStatementData,
  queryRecentYearsIncomeData,
} from './service';

const handleHtml = (content: any) => {
  if (content) {
    const data = content.replace(/(<red>)|(<\/red>|(<br\/>)|(<\/br>)|(<b>)|(<\/b>))/g, '');
    return data;
  }
};

function Earn({ fundCode }: any) {
  const [defaulttext, setDefaultText] = useState('');
  const [autoOptions, setAutoOptions] = useState([]);
  const [handOptions, setHandOptions] = useState([]);
  // const [List, setList] = useState([]);
  const [tenYearsData, setTenYearsData] = useState([]);
  const [isCollapse, setIsCollapse] = useState(true);
  const ref = useRef(null);
  const tenYearRef = useRef(null);

  const handleCopy = (targetValue: any) => {
    console.log();
    const transfer = document.createElement('input');
    document.body.appendChild(transfer);
    transfer.value = targetValue;
    transfer.focus();
    transfer.select();
    if (document.execCommand('copy')) {
    }
    transfer.blur();
    message.success('复制成功');
    document.body.removeChild(transfer);
  };

  useEffect(() => {
    (async () => {
      const { text, autoParams, handParams } = await queryRiskStatementData({ code: fundCode });
      setDefaultText(text);
      setAutoOptions(
        autoParams.map((item: any) => {
          return {
            ...item,
            checked: item.disable,
          };
        }),
      );
      setHandOptions(
        handParams.map((item: any) => {
          return {
            ...item,
            checked: item.disable,
          };
        }),
      );

      const _tenYearsData = await queryRecentYearsIncomeData({ code: fundCode });
      setTenYearsData(_tenYearsData);
    })();
  }, []);

  return (
    <ProCard gutter={[cardGutter, cardGutter]} wrap>
      <BoothComponent boothId="risk" />
      <ProCard title="自动参数" colSpan={24}>
        {autoOptions.map((item: any) => {
          return (
            <Checkbox
              disabled={true}
              defaultChecked={item?.checked}
              value={item?.key}
              paramsContent={item.paramsContent}
            >
              {item?.key}
            </Checkbox>
          );
        })}
      </ProCard>

      <ProCard title="手动参数" colSpan={24}>
        {handOptions.map((item: any, index) => {
          return (
            <Checkbox
              defaultChecked={item?.checked}
              value={item?.key}
              paramsContent={item.paramsContent}
              onChange={async (e) => {
                const _handOptions: any = [...handOptions].map((i: any, key) => {
                  return key == index ? { ...i, checked: e.target.checked } : i;
                });
                const _List: any = _handOptions.filter((i: any) => {
                  return i.checked;
                });
                // if (!e.target.checked && List.length < 1) {
                //   message.error('手动参数不能为空！！');
                //   return;
                // }
                setHandOptions(_handOptions);
                // setList(_List);
                await saveRiskStatementData({
                  code: fundCode,
                  params: _List.map((i: any) => {
                    return i.key;
                  }),
                });
              }}
            >
              {item?.key}
            </Checkbox>
          );
        })}
      </ProCard>
      <ProCard bordered style={{ textIndent: '24px' }}>
        <div ref={ref}>
          {defaulttext}
          {autoOptions.map((item: any) => {
            if (item.checked) return <span>{handleHtml(item.paramsContent)}</span>;
          })}
          {handOptions.map((item: any) => {
            if (item.checked && item.key != '投资目标、范围及策略变更')
              return <span>{handleHtml(item.paramsContent)}</span>;
            if (item.checked && item.key == '投资目标、范围及策略变更')
              return <span dangerouslySetInnerHTML={{ __html: item.paramsContent }}></span>;
          })}
        </div>
        <div className={styles['copy_btn']} onClick={() => handleCopy(ref.current.innerText)}>
          复制
        </div>
      </ProCard>

      {!isCollapse && (
        <ProCardPlus title="近十年基金收益" bordered>
          <div ref={tenYearRef}>{tenYearsData}</div>
          <div
            className={styles['copy_btn']}
            onClick={() => handleCopy(tenYearRef.current.innerText)}
          >
            复制
          </div>
        </ProCardPlus>
      )}
      <div className={styles['btn_expend']} onClick={() => setIsCollapse(!isCollapse)} style={{}}>
        {!isCollapse ? (
          <>
            收起
            <CaretUpOutlined />
          </>
        ) : (
          <>
            查看近十年基金收益
            <CaretDownOutlined />
          </>
        )}
      </div>
    </ProCard>
  );
}

export default Earn;

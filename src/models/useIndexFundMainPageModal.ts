import { useState, useCallback } from 'react';
import moment from 'moment';

export default () => {
  const [dateInfo, setDateInfo] = useState<any>({
    date: null, // 展示业务日期
    changeDate: null, // 更改之后的业务日期
  });
  /**
   * 写两个方法一个是解决由于date赋值触发接口请求一个是 分开展示跟设值功能
   */
  // 从接口得到业务日期并展示
  const fetchDateInfo = useCallback(async (date: any) => {
    const d = !!date ? moment(date).format('YYYY-MM-DD') : null;
    setDateInfo({ ...dateInfo, date: d });
  }, []);

  // 时间控件选择日期 改变全局changeDate 触发接口
  const handleChange = useCallback(async (date: any) => {
    const d = !!date ? moment(date).format('YYYY-MM-DD') : null;
    setDateInfo({ changeDate: d, date: d });
  }, []);

  return {
    dateInfo,
    fetchDateInfo,
    handleChange,
  };
};

import ProCard from '@ant-design/pro-card';
import {
  ProFormDateRangePicker,
  ProFormInstance,
  ProFormSelect,
  QueryFilter,
} from '@ant-design/pro-form';
import { useRef } from 'react';
import { ratingDtEnum, ratingInstituteEnum, reportViewpointEnum } from '../service';

//  搜索
interface ViewSearchProps {
  handleSearch: (value: any) => void;
}

const ViewSearch = (props: ViewSearchProps) => {
  const { handleSearch } = props;
  const formRef = useRef<ProFormInstance>();

  const onSearch = () => {
    handleSearch({
      ...formRef.current?.getFieldsValue(),
      current: 1,
      pageSize: 10,
      isFormSearch: true,
    });
  };

  // 重置
  const onReset = () => {
    formRef.current?.resetFields();

    handleSearch({
      ...formRef.current?.getFieldsValue(),
      isFormSearch: true,
      current: 1,
      pageSize: 10,
    });
  };

  return (
    <ProCard size="small" gutter={[0, 8]} style={{ paddingTop: 12 }}>
      <QueryFilter
        span={6}
        defaultChecked={false}
        defaultColsNumber={6}
        formRef={formRef}
        onFinish={onSearch as any}
        onReset={onReset}
      >
        <ProFormSelect
          name="reportViewpoint"
          label="情绪"
          valueEnum={reportViewpointEnum}
          fieldProps={{
            autoFocus: false,
          }}
        />
        <ProFormSelect
          name="ratingInstitute"
          label="研报来源"
          valueEnum={ratingInstituteEnum}
          fieldProps={{
            autoFocus: false,
          }}
        />
        <ProFormSelect
          name="industryName"
          label="申万行业"
          valueEnum={ratingDtEnum}
          fieldProps={{
            autoFocus: false,
          }}
        />
        <ProFormDateRangePicker
          name="replyDate"
          label="日期范围"
          fieldProps={{
            autoFocus: false,
          }}
        />
      </QueryFilter>
    </ProCard>
  );
};

ViewSearch.isProCard = true;

export default ViewSearch;

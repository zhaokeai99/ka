import React, { useEffect, useState, useCallback } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-components';
import { queryUploadList } from '../../service';
interface uploadPros {
  seatType: any;
  childType: any;
  fundId: any;
  getChildFn: any;
}

const UploadList = ({ seatType, childType, fundId, getChildFn }: uploadPros) => {
  const [templateList, setTemplateList] = useState<any>([]);

  const queryList = async (params: any) => {
    const list = await queryUploadList(params);
    setTemplateList(list || []);
    getChildFn(list || []);
  };

  const getDataFn = useCallback(() => {
    const params: any = { seatType, childType };
    const typeList = ['NORMAL_SEAT', 'FOF_SEAT'];
    if (typeList?.includes(childType)) {
      queryList(params);
    }
    if (fundId) {
      params.fundId = fundId;
      queryList(params);
    }
  }, [fundId, seatType]);

  useEffect(() => {
    getDataFn();
  }, [fundId, seatType]);

  return (
    <>
      {(templateList || [])?.map((item: any, index: number) => {
        return (
          <div key={item.treeId}>
            <ProFormUploadButton
              name={`file${index}`}
              fieldProps={{
                method: 'PUT',
                name: 'multipartFile',
              }}
              label={item.nodeName}
              extra={
                item.templateUrl ? (
                  <span>
                    模版：
                    <a href={item.templateUrl} target="_blank" rel="noreferrer">
                      {item.templateName}
                    </a>
                  </span>
                ) : (
                  <span>模版：无</span>
                )
              }
              max={1}
              action="/object"
              rules={[{ required: item?.need, message: '请上传' }]}
              onChange={({ file }) => {
                item.fileName = file?.name;
              }}
            />
          </div>
        );
      })}
    </>
  );
};

export default UploadList;

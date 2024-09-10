import React, { memo, useEffect, useState } from 'react';
import { Button, message, Upload } from 'antd';
import type { PortfolioInfo } from '../../service';
import { MpRsDicInfoGetExcelHost, MpRsHoldChgFacadeGetExcelTempleUrl } from '../../service';
import '../index.less';
import { useModel } from 'umi';
import { ImportOutlined } from '@ant-design/icons';

interface ModalProps {
  portfolioInfo: PortfolioInfo;
  refresh: () => void;
  tradeDate: string;
}

const MpUploadButton = (props: ModalProps) => {
  const { portfolioInfo, tradeDate, refresh } = props;
  const [excelUrl, setExcelUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState'); // 用户信息
  const getHost = async () => {
    const result = await MpRsDicInfoGetExcelHost();

    if (result.success) {
      setExcelUrl(result.data);
    }
  };

  useEffect(() => {
    getHost();
  }, []);

  const uploadProps = {
    name: 'file',
    showUploadList: false,
    multiple: false,
    accept: '.xls,.xlsx',

    // action: 'http://127.0.0.1:8080/MpBmHoldChg/uploadHoldChg',
    data: {
      tradeDate: tradeDate,
      mpCode: portfolioInfo?.mpCode,
      domain: portfolioInfo?.domain,
      userId: initialState?.userNo,
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        setLoading(true);
      }
      if (info.file.status === 'done') {
        setLoading(false);
        const { success, data, errorMsg } = info.file.response;
        if (success) {
          refresh();
          message.success('导入完成，共' + data + '条记录。');
        } else {
          message.error('导入失败！' + errorMsg);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
        setLoading(false);
      }
    },
  };
  const getExcelTemple = async () => {
    const { success, data, errorMsg } = await MpRsHoldChgFacadeGetExcelTempleUrl({});
    if (success) {
      window.location.href = data;
    } else {
      message.error(errorMsg || '系统错误请稍后重试');
    }
  };
  return (
    <>
      {excelUrl === undefined || excelUrl === null || excelUrl === '' ? (
        <></>
      ) : (
        <>
          <Upload {...uploadProps} action={excelUrl}>
            <Button style={{ marginLeft: 5 }} loading={loading} icon={<ImportOutlined />}>
              文件导入
            </Button>
          </Upload>
          <a style={{ marginLeft: 5 }} onClick={getExcelTemple}>
            下载模板
          </a>
        </>
      )}
    </>
  );
};
export default memo(MpUploadButton);

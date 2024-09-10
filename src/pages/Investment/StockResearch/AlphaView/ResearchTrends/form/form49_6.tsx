import { Avatar, Typography } from 'antd';
import React, { memo, useCallback } from 'react';
import styles from '@/pages/Investment/StockResearch/AlphaView/ResearchTrends/index.less';
import Icons from './icons';
import { IrReportFacadeGetOssUrl } from '../service';

interface ModalProps {
  itemData: any;
}

const { Text } = Typography;
/**
 * 其它　－　文件
 * dw_type = 49 - 6
 * @param props
 * @constructor
 */
const Form496Item = (props: ModalProps) => {
  const { itemData } = props;

  const getIcon = (file: string) => {
    if (file === undefined || file === null) {
      return Icons.IconFile;
    }
    const files = file.split('.');
    const fileType = files[files.length - 1].toUpperCase();

    if (fileType === 'ZIP' || fileType === 'RAR') {
      return Icons.IconZip;
    } else if (fileType === 'PDF') {
      return Icons.IconPdf;
    } else if (fileType === 'DOC' || fileType === 'DOCX') {
      return Icons.IconWord;
    } else if (fileType === 'XLSX' || fileType === 'XLS') {
      return Icons.IconExcel;
    } else if (
      fileType === 'JPG' ||
      fileType === 'BMP' ||
      fileType === 'DIF' ||
      fileType === 'GIF' ||
      fileType === 'TIF' ||
      fileType === 'PNG'
    ) {
      return Icons.IconImage;
    } else if (fileType === 'AVI' || fileType === 'MP4' || fileType === 'MP3') {
      return Icons.IconExcel;
    } else if (fileType === 'PPT' || fileType === 'PPTX') {
      return Icons.IconPpt;
    } else {
      return Icons.IconFile;
    }
  };

  const getFile = useCallback(async (d: any) => {
    if (d.attachment === undefined) {
      return;
    }
    const params = {
      attachment: d.attachment,
    };
    const data = await IrReportFacadeGetOssUrl(params);
    if (data !== undefined && data !== null) {
      window.open(data);
    }
  }, []);

  return (
    <>
      <Text className={styles['irWxContent']}>
        {itemData.attachment === undefined ||
        itemData.attachment === null ||
        itemData.attachment === '' ? (
          <div className={'irWxfileIcon'}>
            <Avatar
              shape="square"
              size={'large'}
              className={'fileIcon'}
              src={getIcon(itemData.reportTitle)}
            />
            {itemData.reportContent}
          </div>
        ) : (
          <a onClick={() => getFile(itemData)}>
            <div className={'irWxfileIcon'}>
              <Avatar
                shape="square"
                size={'large'}
                className={'fileIcon'}
                src={getIcon(itemData.reportTitle)}
              />
              {itemData.reportContent}
            </div>
          </a>
        )}
      </Text>
    </>
  );
};
export default memo(Form496Item);

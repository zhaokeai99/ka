import React, { memo, useCallback, useState, useRef } from 'react';
import { ModalForm, ProFormRadio } from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';
import { saveOpenSeatFlow } from '../service';
import SeatRental from './seatRental';
import SeatQuit from './components/seatNo';
import TradeAuthority from './tradeAuthority';

type ModulProps = {
  showAdd: boolean;
  onClose: (val?: string) => void;
};

// 业务类别
const seatTypeOptions = [
  { label: '席位租用', value: 'SEAT_RENT' },
  { label: '席位退租', value: 'SEAT_QUIT' },
  { label: '申赎权限', value: 'TRADE_AUTHORITY' },
];

const IndexAddForm = (props: ModulProps) => {
  const [loading, setLoading] = useState(false); // 是否加载中 test
  const [isResetBtn, setIsResetBtn] = useState<boolean>(false);
  const [form] = Form.useForm();
  const seatTypeWatch = Form.useWatch(['seatType'], form); // 监听业务类别
  const [fundId, setFundId] = useState<any>('');
  const { showAdd, onClose } = props;
  const seatRentalRef = useRef();
  const tradeRef = useRef();
  // 申请
  const handleSubmit = useCallback(
    async (value) => {
      setLoading(true);
      // 提交参数
      let submitParam = {};
      if (seatTypeWatch === 'SEAT_RENT') {
        const obj = seatRentalRef?.current?.getData();
        submitParam = Object.assign({ fundId }, value, obj);
      }
      if (seatTypeWatch === 'SEAT_QUIT') {
        const { seatno, trusteeName, securitiesFirmName } = value?.seatNo;
        submitParam = Object.assign({}, value, {
          seatNo: seatno,
          trustee: trusteeName,
          broker: securitiesFirmName,
        });
      }
      if (seatTypeWatch === 'TRADE_AUTHORITY') {
        const obj = tradeRef?.current?.getData();
        submitParam = Object.assign({ fundId }, value, obj);
      }
      const result = await saveOpenSeatFlow(submitParam);
      setLoading(false);
      if (result) {
        setIsResetBtn(!isResetBtn);
        form?.resetFields();
        props.onClose('reload');
        return;
      }
      message.error('申请失败');
    },
    [seatTypeWatch, fundId],
  );

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title="席位申请"
      visible={showAdd}
      initialValues={{
        seatType: 'SEAT_RENT',
      }}
      form={form}
      autoFocusFirstInput
      modalProps={{
        onCancel: () => {
          onClose();
          setIsResetBtn(!isResetBtn);
          form?.resetFields();
        },
      }}
      layout={'horizontal'}
      labelCol={{ span: 5 }}
      width="60%"
      submitTimeout={2000}
      submitter={{
        render: (formProps) => {
          return [
            <Button
              key="cancel"
              onClick={() => {
                onClose();
                setIsResetBtn(!isResetBtn);
                form?.resetFields();
              }}
            >
              关闭
            </Button>,
            <Button
              key="ok"
              type="primary"
              loading={loading}
              onClick={() => {
                formProps.submit();
              }}
            >
              发起申请
            </Button>,
          ];
        },
      }}
      onFinish={handleSubmit}
    >
      <ProFormRadio.Group
        name="seatType"
        layout="vertical"
        label="业务类别"
        options={seatTypeOptions}
        rules={[{ required: true }]}
      />
      {seatTypeWatch === 'SEAT_RENT' ? (
        <SeatRental
          isResetBtn={isResetBtn}
          setFundIdFn={setFundId}
          fundId={fundId}
          ref={seatRentalRef}
          seatType={seatTypeWatch}
        />
      ) : null}
      {seatTypeWatch === 'SEAT_QUIT' ? <SeatQuit isResetBtn={isResetBtn} /> : null}
      {seatTypeWatch === 'TRADE_AUTHORITY' ? (
        <TradeAuthority
          isResetBtn={isResetBtn}
          ref={tradeRef}
          setFundIdFn={setFundId}
          fundId={fundId}
          seatType={seatTypeWatch}
        />
      ) : null}
    </ModalForm>
  );
};

export default memo(IndexAddForm);

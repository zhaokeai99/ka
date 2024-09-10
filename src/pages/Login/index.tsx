import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Form } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, FormattedMessage, history, useModel } from 'umi';
import Cookies from 'js-cookie';
import Footer from '@/components/Footer';
import { login } from '@/services/service';
import styles from './index.less';

type UserLoginInfo = {
  userName: string;
  password: string;
  backUrl?: string;
  appName: string;
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [userLoginState, setUserLoginState] = useState({
    status: '',
    errorMsg: '',
  });
  const [redirectUrl] = useState<string>((history.location.query?.redirectUrl as string) || '');
  const { setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const handleSubmit = async (values: UserLoginInfo) => {
    setSubmitting(true);
    try {
      // 登录
      const { success, data } = await login({ ...values });
      if (success && redirectUrl.indexOf('/login') < 0) {
        setInitialState({
          settings: {},
          tabLayoutType: 'multi',
          realName: data?.realName || '',
          userName: data?.userName || '',
          userNo: data?.userNo || '',
          moduleVOS: data?.moduleVOS || [],
          appPrivilegeValueVOS: data?.appPrivilegeValueVOS || [],
          aclvoList: data?.aclvoList || [],
        });
        Cookies.set('username', values.userName);
        history.push(redirectUrl);
      } else {
        setUserLoginState({
          status: 'error',
          errorMsg: '用户名',
        });
      }
    } catch (error) {
      setUserLoginState({
        status: 'error',
        errorMsg: '',
      });
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt="logo" className={styles.logo} src="/logo3.png" />
            {/* <span className={styles.title}></span> */}
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            form={form}
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: '登录',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values);
            }}
          >
            {userLoginState.status === 'error' && (
              <LoginMessage
                content={
                  userLoginState.errorMsg ||
                  intl.formatMessage({
                    id: 'pages.login.failure',
                    defaultMessage: '账户或密码错误',
                  })
                }
              />
            )}
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                  onPressEnter: () => handleSubmit(form.getFieldsValue()),
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;

import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { primaryColor } from '../src/themes/index';
// import Footer from '@/components/Footer';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  layout: 'top',
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: primaryColor,
  // layout: 'top',
  contentWidth: 'Fluid',
  fixedHeader: false,
  // fixSiderbar: true,
  // colorWeak: false,
  title: '', // 配置头部产品
  pwa: false,
  logo: 'logo.png',
  iconfontUrl: '',
};

export default Settings;

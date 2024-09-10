import { useModel } from 'umi';
import { find as _find } from 'lodash';

function useAuth(props: any): boolean {
  const { initialState } = useModel('@@initialState');
  const { moduleVOS = [] } = initialState || {};
  const { sn } = props || {};

  if (sn) {
    const m = _find(moduleVOS, ['sn', sn]);
    if (m) {
      const { showStatus } = m || {};

      return showStatus > 0;
    }
    return false;
  }

  return true;
}

export default useAuth;

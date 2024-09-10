import { history } from 'umi';
import { Filter } from '@/pages/LowCode/core/Filter';
import MyGrid from '@/pages/LowCode/core/Grid';

export default function () {
  return (
    <Filter>
      <MyGrid id={history.location.query?.id} edit={true} />
    </Filter>
  );
}

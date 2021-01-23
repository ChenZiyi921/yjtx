import axios from '@/libs/api.request';
import store from '@/store';

const debug = true;
let table = "";

if (debug) {
  table = "http://121.42.61.204:9010/api/case/getAllCaseInfor?auth=CaseManager12:1";
} else {
  table = "release-get_table_data";
}

export const getTableData = () => {
  return axios.request({
    url: table,
    method: 'get'
  })
}

import axios from '@/libs/api.request';
import store from '@/store';

const debug = true;
let queryUserByNameApi = "";
let queryUserApi = "";
let modifyUserApi = "";

if (debug) {
  queryUserByNameApi = "/static/dbg/user/queryUserByName.json";
  queryUserApi = "/static/dbg/user/queryUser.json";
  modifyUserApi = "/static/dbg/user/modifyUser.json";
} else {
  queryUserByNameApi = "";
  queryUserApi = "";
  modifyUserApi = "";
}

export const queryUserByName = params => {
  return axios.request({
    url: queryUserByNameApi,
    params,
    method: 'get'
  })
}

export const queryUser = params => {
  return axios.request({
    url: queryUserApi,
    params,
    method: 'get'
  })
}

export const modifyUser = data => {
  return axios.request({
    url: modifyUserApi,
    data,
    method: 'post'
  })
}
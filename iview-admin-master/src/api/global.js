import axios from '@/libs/api.request';
import store from '@/store';

const debug = true;

let loginApi = "";
let queryUserByNameApi = "";
let queryUserApi = "";
let modifyUserApi = "";
let queryRolesApi = "";

if (debug) {
  loginApi = "/static/dbg/user/login.json";
  queryUserByNameApi = "/static/dbg/user/queryUserByName.json";
  queryUserApi = "/static/dbg/user/queryUser.json";
  modifyUserApi = "/static/dbg/user/modifyUser.json";
  queryRolesApi = "/static/dbg/user/queryRoles.json";
} else {
  loginApi = "";
  queryUserByNameApi = "";
  queryUserApi = "";
  modifyUserApi = "";
  queryRolesApi = "";
}

export const login = params => {
  return axios.request({
    url: loginApi,
    params,
    method: 'get'
  })
}

// 用户
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

// 角色
export const queryRoles = params => {
  return axios.request({
    url: queryRolesApi,
    params,
    method: 'get'
  })
}
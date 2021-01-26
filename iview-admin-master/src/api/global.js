import axios from '@/libs/api.request';

const debug = true;
let post = debug ? "get" : "post"

let loginApi = "";
let queryUserByNameApi = "";
let queryUserApi = "";
let modifyUserApi = "";
let queryRolesApi = "";
let changeUserPasswordApi = "";

if (debug) {
  loginApi = "/static/dbg/user/login.json";
  queryUserByNameApi = "/static/dbg/user/queryUserByName.json";
  queryUserApi = "/static/dbg/user/queryUser.json";
  modifyUserApi = "/static/dbg/user/modifyUser.json";
  queryRolesApi = "/static/dbg/user/queryRoles.json";
  changeUserPasswordApi = "/static/dbg/user/changeUserPassword.json";

} else {
  loginApi = "";
  queryUserByNameApi = "";
  queryUserApi = "";
  modifyUserApi = "";
  queryRolesApi = "";
  changeUserPasswordApi = "";
}

export const login = params => {
  return axios.request({
    url: loginApi,
    params,
    method: 'get'
  })
}

export const changeUserPassword = params => {
  return axios.request({
    url: changeUserPasswordApi,
    params,
    method: post
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
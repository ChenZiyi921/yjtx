import axios from '@/libs/api.request';

const debug = true;
let post = debug ? "get" : "post"

let loginApi = "";
let changeUserPasswordApi = "";
let addUserApi = "";
let deleteUserApi = "";
let queryUserByNameApi = "";
let queryUserApi = "";
let modifyUserApi = "";
let queryRolesApi = "";
let queryResourcesApi = "";
let deleteRoleApi = "";

if (debug) {
  loginApi = "/static/dbg/user/login.json";
  changeUserPasswordApi = "/static/dbg/user/changeUserPassword.json";
  addUserApi = "/static/dbg/user/addUser.json";
  deleteUserApi = "/static/dbg/user/deleteUser.json";
  queryUserByNameApi = "/static/dbg/user/queryUserByName.json";
  queryUserApi = "/static/dbg/user/queryUser.json";
  modifyUserApi = "/static/dbg/user/modifyUser.json";
  queryRolesApi = "/static/dbg/user/queryRoles.json";
  queryResourcesApi = "/static/dbg/user/queryResources.json";
  deleteRoleApi = "/static/dbg/user/deleteRole.json";
} else {
  loginApi = "";
  changeUserPasswordApi = "";
  addUserApi = "";
  deleteUserApi = "";
  queryUserByNameApi = "";
  queryUserApi = "";
  modifyUserApi = "";
  queryRolesApi = "";
  queryResourcesApi = "";
  deleteRoleApi = "";
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
export const addUser = data => {
  return axios.request({
    url: addUserApi,
    data,
    method: post
  })
}

export const deleteUser = data => {
  return axios.request({
    url: deleteUserApi,
    data,
    method: post
  })
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
    method: post
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

export const queryResources = params => {
  return axios.request({
    url: queryResourcesApi,
    params,
    method: 'get'
  })
}

export const deleteRole = params => {
  return axios.request({
    url: deleteRoleApi,
    params,
    method: 'get'
  })
}
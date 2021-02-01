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
let addRoleApi = "";
let modifyRoleApi = "";

let queryCasesByUserApi = "";
let deleteCaseApi = "";
let caseOperationApi = "";
let commentCaseApi = "";
let searchCaseApi = "";
let addCaseApi = "";
let checkCaseNameApi = "";
let queryVhlrApi = "";

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
  addRoleApi = "/static/dbg/user/addRole.json";
  modifyRoleApi = "/static/dbg/user/modifyRole.json";

  queryCasesByUserApi = "/static/dbg/case/queryCasesByUser.json";
  deleteCaseApi = "/static/dbg/case/deleteCase.json";
  caseOperationApi = "/static/dbg/case/caseOperation.json";
  commentCaseApi = "/static/dbg/case/commentCase.json";
  searchCaseApi = "/static/dbg/case/searchCase.json";
  addCaseApi = "/static/dbg/case/addCase.json";
  checkCaseNameApi = "/static/dbg/case/checkCaseName.json";

  queryVhlrApi = "/static/dbg/cdr/queryVhlr.json";
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
  addRoleApi = "";
  modifyRoleApi = "";

  queryCasesByUserApi = "";
  deleteCaseApi = "";
  caseOperationApi = "";
  commentCaseApi = "";
  searchCaseApi = "";
  addCaseApi = "";
  checkCaseNameApi = "";

  queryVhlrApi = "";
}

export const login = params => {
  return axios.request({
    url: loginApi,
    params,
    method: 'get'
  })
}

export const changeUserPassword = data => {
  return axios.request(Object.assign({
    url: changeUserPasswordApi,
    method: post
  }, post ? { params: data } : { data }))
}

// 用户
export const addUser = data => {
  return axios.request(Object.assign({
    url: addUserApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const deleteUser = data => {
  return axios.request(Object.assign({
    url: deleteUserApi,
    method: post
  }, post ? { params: data } : { data }))
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
  return axios.request(Object.assign({
    url: modifyUserApi,
    method: post
  }, post ? { params: data } : { data }))
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

export const addRole = params => {
  return axios.request({
    url: addRoleApi,
    params,
    method: 'get'
  })
}

export const modifyRole = params => {
  return axios.request({
    url: modifyRoleApi,
    params,
    method: 'get'
  })
}

// 案件管理
export const queryCasesByUser = data => {
  return axios.request(Object.assign({
    url: queryCasesByUserApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const deleteCase = data => {
  return axios.request(Object.assign({
    url: deleteCaseApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const caseOperation = data => {
  return axios.request(Object.assign({
    url: caseOperationApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const commentCase = data => {
  return axios.request(Object.assign({
    url: commentCaseApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const searchCase = data => {
  return axios.request(Object.assign({
    url: searchCaseApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const addCase = data => {
  return axios.request(Object.assign({
    url: addCaseApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const checkCaseName = data => {
  return axios.request(Object.assign({
    url: checkCaseNameApi,
    method: post
  }, post ? { params: data } : { data }))
}

// 
export const queryVhlr = data => {
  return axios.request(Object.assign({
    url: queryVhlrApi,
    method: post
  }, post ? { params: data } : { data }))
}
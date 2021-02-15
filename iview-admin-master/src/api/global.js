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
let queryUserResourceApi = "";
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
let addCaseIcApi = "";
let deleteCaseIcApi = "";
let queryIcApi = "";

let queryVhlrApi = "";
let queryCdrByIcApi = "";
let execQueryApi = "";
let queryQueryApi = "";
let addQueryApi = "";
let deleteQueryApi = "";
let queryLiveConsoleApi = "";
let addLiveConsoleApi = "";
let deleteLiveConsoleApi = "";
let deleteTargetIcApi = "";
let exportCaseApi = "";

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
  queryUserResourceApi = "/static/dbg/user/queryUserResource.json";
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
  addCaseIcApi = "/static/dbg/case/addCaseIc.json";
  deleteCaseIcApi = "/static/dbg/case/deleteCaseIc.json";
  queryIcApi = "/static/dbg/case/queryIc.json";

  queryVhlrApi = "/static/dbg/cdr/queryVhlr.json";
  queryCdrByIcApi = "/static/dbg/cdr/queryCdrByIc.json";
  execQueryApi = "/static/dbg/cdr/execQuery.json";
  queryQueryApi = "/static/dbg/cdr/queryQuery.json";
  addQueryApi = "/static/dbg/cdr/addQuery.json";
  deleteQueryApi = "/static/dbg/cdr/deleteQuery.json";
  queryLiveConsoleApi = "/static/dbg/case/queryLiveConsole.json";
  addLiveConsoleApi = "/static/dbg/case/addLiveConsole.json";
  deleteLiveConsoleApi = "/static/dbg/case/deleteLiveConsole.json";
  deleteTargetIcApi = "/static/dbg/case/deleteTargetIc.json";
  exportCaseApi = "/static/dbg/cdr/exportCase.json";
} else {
  loginApi = "/api/user/login.do";
  changeUserPasswordApi = "/api/user/changeUserPassword.do";
  addUserApi = "/api/user/addUser.do";
  deleteUserApi = "/api/user/deleteUser.do";
  queryUserByNameApi = "/api/user/queryUserByName.do";
  queryUserApi = "/api/user/queryUser.do";
  modifyUserApi = "/api/user/modifyUser.do";
  queryRolesApi = "/api/user/queryRoles.do";
  queryResourcesApi = "/api/user/queryResources.do";
  queryUserResourceApi = "/api/user/queryUserResource.do";
  deleteRoleApi = "/api/user/deleteRole.do";
  addRoleApi = "/api/user/addRole.do";
  modifyRoleApi = "/api/user/modifyRole.do";

  queryCasesByUserApi = "/api/case/queryCasesByUser.do";
  deleteCaseApi = "/api/case/deleteCase.do";
  caseOperationApi = "/api/case/caseOperation.do";
  commentCaseApi = "/api/case/commentCase.do";
  searchCaseApi = "/api/case/searchCase.do";
  addCaseApi = "/api/case/addCase.do";
  checkCaseNameApi = "/api/case/checkCaseName.do";
  addCaseIcApi = "/api/case/addCaseIc.do";
  deleteCaseIcApi = "/api/case/deleteCaseIc.do";
  queryIcApi = "/api/case/queryIc.do";

  queryVhlrApi = "/api/cdr/queryVhlr.do";
  queryCdrByIcApi = "/api/cdr/queryCdrByIc.do";
  execQueryApi = "/api/cdr/execQuery.do";
  queryQueryApi = "/api/cdr/queryQuery.do";
  addQueryApi = "/api/cdr/addQuery.do";
  deleteQueryApi = "/api/cdr/deleteQuery.do";
  queryLiveConsoleApi = "/api/case/queryLiveConsole.do";
  addLiveConsoleApi = "/api/case/addLiveConsole.do";
  deleteLiveConsoleApi = "/api/case/deleteLiveConsole.do";
  deleteTargetIcApi = "/api/case/deleteTargetIc.do";
  exportCaseApi = "/api/cdr/exportCase.do";
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

export const queryUserResource = data => {
  return axios.request(Object.assign({
    url: queryUserResourceApi,
    method: post
  }, post ? { params: data } : { data }))
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

export const addCaseIc = data => {
  return axios.request(Object.assign({
    url: addCaseIcApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const deleteCaseIc = data => {
  return axios.request(Object.assign({
    url: deleteCaseIcApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const queryIc = data => {
  return axios.request(Object.assign({
    url: queryIcApi,
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

export const queryCdrByIc = data => {
  return axios.request(Object.assign({
    url: queryCdrByIcApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const execQuery = data => {
  return axios.request(Object.assign({
    url: execQueryApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const queryQuery = data => {
  return axios.request(Object.assign({
    url: queryQueryApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const addQuery = data => {
  return axios.request(Object.assign({
    url: addQueryApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const deleteQuery = data => {
  return axios.request(Object.assign({
    url: deleteQueryApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const queryLiveConsole = data => {
  return axios.request(Object.assign({
    url: queryLiveConsoleApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const addLiveConsole = data => {
  return axios.request(Object.assign({
    url: addLiveConsoleApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const deleteLiveConsole = data => {
  return axios.request(Object.assign({
    url: deleteLiveConsoleApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const deleteTargetIc = data => {
  return axios.request(Object.assign({
    url: deleteTargetIcApi,
    method: post
  }, post ? { params: data } : { data }))
}

export const exportCase = data => {
  return axios.request(Object.assign({
    url: exportCaseApi,
    method: post
  }, post ? { params: data } : { data }))
}
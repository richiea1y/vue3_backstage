import { request } from '@/service/request'

/* 取得登入OTP碼 */
export const getOtp = (params) =>
  request({
    url: '/admin/otp',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

/* 登入 */
export const userLogin = (params) =>
  request({
    url: '/admin/login',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

/* Dashboard overview */
export const getOverview = (params) =>
  request({
    url: '/admin/dashboard',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

/* get img */
export const getImg = (params) =>
  request({
    url: '/admin/image/r',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params
  })

/* get img */
export const removeImg = (params) =>
  request({
    url: '/admin/image/d',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    params
  })

/* Get goods list */
export const getGoodsList = (params) =>
  request({
    url: '/admin/goods/r',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

/* add goods */
export const addGoods = (params) =>
  request({
    url: '/admin/goods/c',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

/* update goods */
export const updateGoods = (params) =>
  request({
    url: '/admin/goods/u',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

/* remove goods */
export const removeGoods = (params) =>
  request({
    url: '/admin/goods/d',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

/* remove goods specs */
export const removeGoodsSpec = (params) =>
  request({
    url: '/admin/goods/specs/d',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

/* Get goods type list */
export const getGoodsType = (params) =>
  request({
    url: '/admin/goods/goodstype/r',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

/* add goods type */
export const addGoodsType = (params) =>
  request({
    url: '/admin/goods/goodstype/c',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

/* update goods type */
export const updateGoodsType = (params) =>
  request({
    url: '/admin/goods/goodstype/u',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

/* remove goods type */
export const removeGoodsType = (params) =>
  request({
    url: '/admin/goods/goodstype/d',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

/* Admin List */

/* get Admin List */
export const getAdminMembers = (params) =>
  request({
    url: '/admin/member/backstage/r',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

export const addAdminMembers = (params) =>
  request({
    url: '/admin/member/backstage/c',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

export const updateAdminMembers = (params) =>
  request({
    url: '/admin/member/backstage/u',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

export const removeAdminMembers = (params) =>
  request({
    url: '/admin/member/backstage/d',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    params
  })

/* Permissions */

export const getAdminPermissions = (params) =>
  request({
    url: '/admin/permission/r',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

export const updateAdminPermissions = (params) =>
  request({
    url: '/admin/permission/u',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    params
  })

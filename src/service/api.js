import { request } from '@/service/request'

/* 取得登入OTP碼 */
export const getOtp = (data) =>
  request({
    url: '/admin/otp',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

/* 登入 */
export const userLogin = (data) =>
  request({
    url: '/admin/login',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

/* Dashboard overview */
export const getOverview = (data) =>
  request({
    url: '/admin/dashboard',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

/* upload img */
export const uploadImg = (formData) => request({
  url: '/admin/image/c',
  method: 'post',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  data: formData
})

/* get img */
export const getImg = (data) =>
  request({
    url: '/admin/image/r',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })

/* get img */
export const removeImg = (data) =>
  request({
    url: '/admin/image/d',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })

/* Get goods list */
export const getGoodsList = (data) =>
  request({
    url: '/admin/goods/r',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

/* add goods */
export const addGoods = (data) =>
  request({
    url: '/admin/goods/c',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

/* update goods */
export const updateGoods = (data) =>
  request({
    url: '/admin/goods/u',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

/* remove goods */
export const removeGoods = (data) =>
  request({
    url: '/admin/goods/d',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

/* remove goods specs */
export const removeGoodsSpec = (data) =>
  request({
    url: '/admin/goods/specs/d',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

/* Get goods type list */
export const getGoodsType = (data) =>
  request({
    url: '/admin/goods/goodstype/r',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

/* add goods type */
export const addGoodsType = (data) =>
  request({
    url: '/admin/goods/goodstype/c',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

/* update goods type */
export const updateGoodsType = (data) =>
  request({
    url: '/admin/goods/goodstype/u',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

/* remove goods type */
export const removeGoodsType = (data) =>
  request({
    url: '/admin/goods/goodstype/d',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

/* Admin List */

/* get Admin List */
export const getAdminMembers = (data) =>
  request({
    url: '/admin/member/backstage/r',
    method: 'get',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

export const addAdminMembers = (data) =>
  request({
    url: '/admin/member/backstage/c',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

export const updateAdminMembers = (data) =>
  request({
    url: '/admin/member/backstage/u',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

export const removeAdminMembers = (data) =>
  request({
    url: '/admin/member/backstage/d',
    method: 'post',
    headers: { 'Content-Type': 'text/plain' },
    data
  })

/* Permissions */

export const getAdminPermissions = (data) =>
  request({
    url: '/admin/permission/r',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

export const updateAdminPermissions = (data) =>
  request({
    url: '/admin/permission/u',
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data
  })

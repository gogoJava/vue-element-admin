import request from '@/utils/request'

export function loginByUsername(username, password) {
  // const data = {
  //   username,
  //   password
  // }
  return request({
    url: '/pass/login?username=' + username + '&password=' + password,
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}


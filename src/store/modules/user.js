import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    async LoginByUsername({ commit, dispatch }, userInfo) {
      const username = userInfo.username.trim()
      const { code, data } = await loginByUsername(username, userInfo.password).catch(e => e)
      if (code !== 200) return
      commit('SET_TOKEN', data.token)
      setToken(data.token)
      commit('SET_ROLES', [data.manager])
      commit('SET_NAME', data.manager.username)
      // type 类型0普通管理员1超级管理员
      // console.log('333', data.manager)
      const role = { roles: [data.manager.type === 1 ? 'super' : 'admin'] }
      dispatch('GenerateRoutes', role) // 动态修改权限后 重绘侧边菜单
      // return new Promise((resolve, reject) => {
      //   loginByUsername(username, userInfo.password).then(response => {
      //     console.log('response', response)
      //     const data = response.data
      //     commit('SET_TOKEN', data.token)
      //     setToken(data.token)
      //     commit('SET_ROLES', [data.manager])
      //     commit('SET_NAME', data.manager.username)
      //     // type 类型0普通管理员1超级管理员
      //     // console.log('333', data.manager)
      //     const role = { roles: [data.manager.type === 1 ? 'super' : 'admin'] }
      //     dispatch('GenerateRoutes', role) // 动态修改权限后 重绘侧边菜单
      //     // commit('SET_AVATAR', data.avatar)
      //     // commit('SET_INTRODUCTION', data.introduction)
      //     resolve()
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },

    // 获取用户信息
    async GetUserInfo({ commit, dispatch, state }) {
      const { code, data } = await getUserInfo().catch(e => e)
      console.log('data', data)
      if (!data || code !== 200) return
      commit('SET_ROLES', [data])
      commit('SET_NAME', data.username)
      const role = { roles: [data.type === 1 ? 'super' : 'admin'] }
      dispatch('GenerateRoutes', role) // 动态修改权限后 重绘侧边菜单
      return data
      // return new Promise((resolve, reject) => {
      //   getUserInfo().then(response => {
      //     if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
      //       reject('error')
      //     }
      //     const data = response.data

      //     commit('SET_ROLES', [data])
      //     commit('SET_NAME', data.username)
      //     // commit('SET_AVATAR', data.avatar)
      //     // commit('SET_INTRODUCTION', data.introduction)
      //     const role = { roles: [data.type === 1 ? 'super' : 'admin'] }
      //     dispatch('GenerateRoutes', role) // 动态修改权限后 重绘侧边菜单
      //     resolve(response)
      //   }).catch(error => {
      //     reject(error)
      //   })
      // })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user

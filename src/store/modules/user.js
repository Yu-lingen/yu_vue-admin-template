import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, asyncRoutes, anyRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    //存储token
    token: getToken(),
    //存储用户名
    name: '',
    //储池用户头像
    avatar: '',
    //存储服务器返回的路由信息
    routes: [],
    //存储用户按钮权限
    buttons: [],
    //存储用户信息
    roles: [],
    //对比之后的路由结果【项目中以有的路由和服务器返回的路由进行对比，谁该有，谁没有】
    resultAsyncRoute: [],
    //合并常量路由，异步路由和任意路由，包括计算后的所有路由(包括计算后的异步路由和普通路由，任意路由)
    resultAllRoute: []
  }
}

const state = getDefaultState()

//唯一修改state的地方
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  //存储用户信息
  SET_USERINFO: (state, userInfo) => {
    //存储信息和相关权限
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.roles = userInfo.roles;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons
  },
  //修改state中的最终路由信息
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //vuex保存当前用户的异步路由，注意，一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoute = asyncRoutes;
    //计算出当前用户需要展示所有路由
    state.resultAllRoute = constantRoutes.concat(anyRoutes,state.resultAsyncRoute);
    //给路由器添加新的路由
    router.addRoutes(state.resultAllRoute);
  }
}

//对比计算项目中以有的路由和服务器返回的路由进行对比
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //过滤出当前用户需要展示的路由
  return asyncRoutes.filter(item => {
    if (routes.includes(item.name)) {
      //因为有children，所以需要递归判断
      if (item.children && item.children.length) {
        //如果item有children，并且children的长度不为0,则把子路由继续进行过滤
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  })
}


const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password });
    if (result.code == 20000) {
      commit('SET_TOKEN', result.data.token);
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('falie'));
    }
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // get user info
  async getInfo({ commit, state }) {
    let result = await getInfo(state.token);
    if (result.code == 20000) {
      const { data } = result;
      if (!data) {
        return reject('Verification failed, please Login again.')
      }
      commit('SET_USERINFO', data)
      commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   getInfo(state.token).then(response => {
    //     const { data } = response

    //     if (!data) {
    //       return reject('Verification failed, please Login again.')
    //     }

    //     const { name, avatar } = data

    //     commit('SET_NAME', name)
    //     commit('SET_AVATAR', avatar)
    //     resolve(data)
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // user logout
  async logout({ commit, state }) {
    let result = await logout(state.token);
    if (result.code == 20000) {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     removeToken() // must remove  token  first
    //     resetRouter()
    //     commit('RESET_STATE')
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


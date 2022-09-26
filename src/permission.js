import router from '@/router'
import store from '@/store'

const whiteList = ['/login', '/404']

// 路由前置守卫
// 1. 权限拦截处理逻辑需要放在路由的前置守卫里处理
// 2. 首先判断有无token
// 2.1 token 存在 说明 处于登录状态
// 2.1.1 判断是否处于登录页面，是的话 跳首页 否则 直接留在当前页（直接放行 next()）
// 2.2 token 不存在 说明 不处于登录状态
// 2.2.1 判断一下 是否处于白名单 是的话 直接留在 当前页 否则 跳转到登录页
router.beforeEach(async(to, from, next) => {
//   console.log(to)
//   console.log(from)
//   next(false)
  if (store.getters.token) { // token 是否存在
    if (!store.getters.userId) {
      await store.dispatch('user/getUserInfo')
    }
    if (to.path === '/login') { // 判断是否在登录页
      next('/')
    } else {
      next()
    }
  } else { // token 不存在
    // includes() 方法用于判断字符串是否包含指定的子字符串，或者判断数组中是否有指定的元素。
    // 例如：[‘hellow’,‘world’].includes(‘hellow’) ,如果数组存在指定元素就会返回true，没有就返回false。
    if (whiteList.includes(to.path)) { // 判断是否处于白名单
      next()
    } else {
      next('/login')
    }
  }
})

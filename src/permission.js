import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store'
import { asyncRoutes } from '@/router'

/**
 *前置守卫
 *
*/

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      nprogress.done()
    } else {
      if (!store.getters.userId) {
        // 页面刷新后store刷新，里面没有数据
        // 如果没有数据，则获取，此时如果token过期，会倒向login界面
        const res = await store.dispatch('user/userGetProfileAction') // 该数据内包含有路由权限信息

        const filterRoutes = asyncRoutes.filter((item) => {
          for (const value of res.roles.menus) {
            if (item.name === value) return true
          }
        })
        store.commit('user/setRoutes', filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }]) // 加入动态路由 404必须置于最后，因此放在此处

        next(to.path)
        // 当我们通过 router.addRoutes(filterRoutes) 动态添加了新路由时，Vue Router 的内部路由表还没立即生效。
        // next(to.path) 的意思是： “重新以当前目标路径再执行一次跳转”。
        // 此时，由于上一步 router.addRoutes(filterRoutes) 已经动态添加了路由。新的路由表已经生效，Vue Router 再次匹配 to.path 时就能找到对应的组件，从而正常显示页面。
      } else {
        next() // 放行
      }
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login') // 中转到登录页
      nprogress.done()
    }
  }
})

/** *
 * 后置守卫
 * **/
router.afterEach(() => {
  nprogress.done()
})

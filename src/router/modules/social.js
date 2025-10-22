import Layout from '@/layout/index.vue'

export default {
  path: '/social',
  name: 'social',
  component: Layout,
  children: [
    {
      path: '',
      name: 'Social',
      component: () => import('@/views/social/index'),
      meta: { title: '社保', icon: 'table' }
    },

    {
      path: `/social/detail/:id?`, // 员工详情的地址
      component: () => import('@/views/social/detail.vue'),
      hidden: true, // 表示隐藏在左侧菜单
      meta: {
        title: '社保详情' // 显示在导航的文本
      }
    },
    {
      path: '/social/report',
      component: () => import('@/views/social/report.vue'),
      hidden: true, // 如果不想显示在菜单
      meta: { title: '社保月份报表' }
    },
    {
      path: '/social/archive',
      component: () => import('@/views/social/archive.vue'),
      hidden: true, // 如果不想显示在菜单
      meta: { title: '社保历史报表' }
    }
  ]
}

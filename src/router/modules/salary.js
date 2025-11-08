import Layout from '@/layout/index.vue'

export default {
  path: '/salary',
  name: 'salary',
  component: Layout,
  children:
  [
    {
      path: '',
      name: 'Salary',
      component: () => import('@/views/salary/index'),
      meta: { title: '工资', icon: 'money' }
    },
    {
      path: '/salary/setting',
      component: () => import('@/views/salary/setting.vue'),
      hidden: true, // 如果不想显示在菜单
      meta: { title: '工资设置' }
    },
    {
      path: '/salary/report/:yearMonth?',
      component: () => import('@/views/salary/report.vue'),
      hidden: true, // 如果不想显示在菜单
      meta: { title: '工资报表' }
    },
    {
      path: '/salary/detail/:userId/:yearMonth',
      component: () => import('@/views/salary/detail.vue'),
      hidden: true, // 如果不想显示在菜单
      meta: { title: '工资详情' }
    }
  ]
}

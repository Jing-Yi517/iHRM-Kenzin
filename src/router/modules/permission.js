import Layout from '@/layout/index.vue'

export default {
  path: '/permission',
  component: Layout,
  children: [{
    path: '',
    name: 'Permission',
    component: () => import('@/views/permission/index'),
    meta: { title: '权限', icon: 'lock' }
  }]
}

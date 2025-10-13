import Layout from '@/layout/index.vue'

export default {
  path: '/department',
  name: 'department',
  component: Layout,
  children: [{
    path: '',
    name: 'Department',
    component: () => import('@/views/department/index'),
    meta: { title: '组织', icon: 'tree' }
  }]
}

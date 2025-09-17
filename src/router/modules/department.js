import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'department',
    name: 'Department',
    component: () => import('@/views/department/index'),
    meta: { title: '组织', icon: 'tree' }
  }]
}

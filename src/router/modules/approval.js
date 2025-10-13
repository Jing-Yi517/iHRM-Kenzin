import Layout from '@/layout/index.vue'

export default {
  path: '/approval',
  name: 'approval',
  component: Layout,
  children: [{
    path: '',
    name: 'Approval',
    component: () => import('@/views/approval/index'),
    meta: { title: '审批', icon: 'tree-table' }
  }]
}

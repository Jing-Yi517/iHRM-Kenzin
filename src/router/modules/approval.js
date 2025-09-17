import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'approval',
    name: 'Approval',
    component: () => import('@/views/approval/index'),
    meta: { title: '审批', icon: 'tree-table' }
  }]
}

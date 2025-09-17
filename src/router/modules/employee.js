import Layout from '@/layout/index.vue'

export default {
  path: '/employee',
  component: Layout,
  children: [{
    path: '',
    name: 'Employee',
    component: () => import('@/views/employee/index'),
    meta: { title: '员工', icon: 'people' }
  }]
}

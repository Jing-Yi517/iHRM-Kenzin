import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'employee',
    name: 'Employee',
    component: () => import('@/views/employee/index'),
    meta: { title: '员工', icon: 'people' }
  }]
}

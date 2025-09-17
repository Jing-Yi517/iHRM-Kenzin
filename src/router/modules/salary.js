import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'salary',
    name: 'Salary',
    component: () => import('@/views/salary/index'),
    meta: { title: '工资', icon: 'money' }
  }]
}

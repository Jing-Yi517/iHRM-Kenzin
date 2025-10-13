import Layout from '@/layout/index.vue'

export default {
  path: '/salary',
  name: 'salary',
  component: Layout,
  children: [{
    path: '',
    name: 'Salary',
    component: () => import('@/views/salary/index'),
    meta: { title: '工资', icon: 'money' }
  }]
}

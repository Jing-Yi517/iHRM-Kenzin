import Layout from '@/layout/index.vue'

export default {
  path: '/social',
  name: 'social',
  component: Layout,
  children: [{
    path: '',
    name: 'Social',
    component: () => import('@/views/social/index'),
    meta: { title: '社保', icon: 'table' }
  }]
}

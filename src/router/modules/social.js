import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'social',
    name: 'Social',
    component: () => import('@/views/social/index'),
    meta: { title: '社保', icon: 'table' }
  }]
}

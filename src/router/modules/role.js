import Layout from '@/layout/index.vue'

export default {
  path: '/role',
  name: 'role',
  component: Layout,
  children: [{
    path: '',
    name: 'Role',
    component: () => import('@/views/role/index'),
    meta: { title: '角色', icon: 'setting' }
  }]
}

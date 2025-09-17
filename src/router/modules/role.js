import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'role',
    name: 'Role',
    component: () => import('@/views/role/index'),
    meta: { title: '角色', icon: 'setting' }
  }]
}

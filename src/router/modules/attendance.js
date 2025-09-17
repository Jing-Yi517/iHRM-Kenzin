import Layout from '@/layout/index.vue'

export default {
  path: '/attendance',
  component: Layout,
  children: [{
    path: '',
    name: 'Attendance',
    component: () => import('@/views/attendance/index'),
    meta: { title: '考勤', icon: 'excel' }
  }]
}

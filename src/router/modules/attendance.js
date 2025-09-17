import Layout from '@/layout/index.vue'

export default {
  path: '/',
  component: Layout,
  children: [{
    path: 'attendance',
    name: 'Attendance',
    component: () => import('@/views/attendance/index'),
    meta: { title: '考勤', icon: 'excel' }
  }]
}

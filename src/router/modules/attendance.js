import Layout from '@/layout/index.vue'

export default {
  path: '/attendance',
  name: 'attendance',
  component: Layout,
  children: [
    {
      path: '',
      name: 'Attendance',
      component: () => import('@/views/attendance/index'),
      meta: { title: '考勤', icon: 'excel' }
    },

    {
      path: '/attendance/report',
      name: 'AttendanceReport',
      component: () => import('@/views/attendance/report.vue'),
      hidden: true, // 如果不想显示在菜单
      meta: { title: '考勤报表' }
    }
  ]
}

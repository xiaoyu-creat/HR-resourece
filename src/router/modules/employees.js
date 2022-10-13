import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    }, {
      path: '/employees/detail/:id',
      hidden: true,
      component: () => import('@/views/employees/detail.vue')
    }
  ]
}

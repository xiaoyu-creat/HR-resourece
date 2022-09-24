import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

const req = require.context('./svg', false, /\.svg$/)
// req函数 ==》根据路径 对应的模块 导入进来
// req的keys 属性 ==》方法 ==》返回一个数组
// console.log(req.keys())
// console.log(req('./dashboard.svg'))
// console.log(req => req.keys().map(req))

// const requireAll = requireContext => requireContext.keys().map(requireContext)
const requireAll = requireContext => requireContext.keys().map(val => {
  return requireContext(val)
})
// map 返回一个新数组
// 长度和原来的一样
// 映射

// ['./dashboard.svg'].map(requireContext) //[]
requireAll(req)
console.log(requireAll(req))

// import PageTools from './PageTools/index.vue'
// const components = [PageTools]
// 全局注册组件
// 引入要注册的组件
// 把组件用数组收集起来

// Vue.use(plugin)
// plugin对象 install 属性 --> 会被执行install方法 --》 第一个参数Vue
// 函数被install方法 ==》 会被执行 函数第一个参数vue
// Vue.use(plugin)

// export default {
//   install: function(Vue) {
//     components.forEach(ele => {
//       Vue.component(ele.name, ele)
//     })
//   }
// }

// 实现组件自动注册
// require.context(路径，是否查看子目录，正则) ==》返回一个函数
import * as filters from '@/filters'

const fn = require.context('./', true, /\.vue$/)
// console.dir(fn)
// console.log(fn.keys())// 路径
// console.log(fn('./PageTools/index.vue')) // 根据路径查找模块

// 一次性导入所有的模块
// fn.keys() ==> 返回所有模块 ['./PageTools/index.vue']
const components = fn.keys().map(ele => {
  return fn(ele)
})

export default (Vue) => {
  components.forEach(ele => {
    // console.log(ele)
    Vue.component(ele.default.name, ele.default)
  })
  // Vue.filter('过滤器名称', 过滤器的方法)
  Object.keys(filters).forEach(key => {
    // Vue.filter('过滤器名称',过滤器的方法)
    // console.log(key);
    Vue.filter(key, filters[key])
  })
}


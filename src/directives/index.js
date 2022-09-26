export const imgerror = {
  // 什么时候 去换图片地址
  // onerror
  // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
  inserted(el, binding, vnode) {
    // el dom
    console.log(el)
    // binding 当前指令的相关信息
    console.log(binding)
    // vnode 虚拟节点
    console.log(vnode)
    el.onerror = function() {
      el.src = binding.value
    }
  }
}

import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
// 全局注册svg-icon组件
Vue.component('svg-icon', SvgIcon)

/*
    ! 这一句是用于引入svg文件
    ? 查找目标目录: .svg
    ? 是否查找该目录下的子目录: 当前为false
    ? 要哪些后缀的: .svg
    * 他会将匹配到的路径存入一个数组内,我们可以通过 xxx.keys()获取
    * 如果我们向这个函数传入一个路径,那么就会引入他
**/
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

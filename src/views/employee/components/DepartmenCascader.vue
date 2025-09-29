<template>
  <el-cascader
    :value="value"
    class="cascader"
    :options="departmentTree"
    :props="cascaderSettings"
    separator="-"
    @change="handleCascaderChange"
  />
</template>

<script>
import { list2Tree } from '@/utils'
import { getDepartmentInfo } from '@/api/department'
export default {
  props: {
    value: {
      required: 'true',
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      cascaderSettings: { // 级联组件设置（类似树）
        label: 'name',
        value: 'id',
        children: 'children'
      },
      departmentTree: [] // 获取的树形数据

    }
  },
  async created() {
    const res = await getDepartmentInfo() // 获取部门数据（扁平）
    const tree = list2Tree(res) // 树形结构转换
    this.departmentTree = this.removeEmptyChildren(tree) // 优化： 之前的树形转化算法，将所有的数据都增添了children的数组属性（无论有没有children），在这里将children.length === 0的children属性进行删除
  },
  methods: {
    /**
     * ? 获取当前选中节点的id数据
     * @param node 节点数据数组
     * ! 注意： 这里默认至能选中叶子节点，如果不是，返回null
     */
    handleCascaderChange(node) {
      if (node.length > 0) {
        this.$emit('input', node[node.length - 1])
      } else {
        this.$emit('input', null)
      }
    },
    /**
     * ? 树形结构优化
     * @param tree 树形结构
     * * 如果children的长度为0（空数组），则删除该children属性
     */
    removeEmptyChildren(tree) {
      tree.forEach(node => {
        if (node.children && node.children.length === 0) {
          delete node.children
        } else if (node.children) {
          this.removeEmptyChildren(node.children) // 递归
        }
      })
      return tree
    }
  }
}
</script>

<style>
.cascader{
  width: 350px;
}
</style>

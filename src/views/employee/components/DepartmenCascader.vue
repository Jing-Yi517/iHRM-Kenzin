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
      cascaderSettings: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      departmentTree: []

    }
  },
  async created() {
    const res = await getDepartmentInfo()
    const tree = list2Tree(res)
    this.departmentTree = this.removeEmptyChildren(tree)
  },
  methods: {
    handleCascaderChange(node) {
      console.log(node[node.length - 1])
      if (node.length > 0) {
        this.$emit('input', node[node.length - 1])
      } else {
        this.$emit('input', null)
      }
    },
    removeEmptyChildren(tree) {
      tree.forEach(node => {
        if (node.children && node.children.length === 0) {
          delete node.children
        } else if (node.children) {
          this.removeEmptyChildren(node.children)
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

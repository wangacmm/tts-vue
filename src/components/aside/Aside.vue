<template>
  <div class='aside'>
    <el-menu
      :default-active='page.asideIndex'
      class='el-menu-vertical-demo'
      @select='menuChange'
    >
      <el-menu-item index='1'>
        <span>号码分类</span>
      </el-menu-item>
      <el-menu-item index='2'>
        <span>错号排查</span>
      </el-menu-item>
      <el-menu-item index='3'>
        <span>号码去重</span>
      </el-menu-item>
      <el-menu-item index='4'>
        <span>号码对比</span>
      </el-menu-item>
    </el-menu>
    <Version />
  </div>
</template>

<script setup lang='ts'>
  import { useTtsStore } from '@/store/store'
  import { storeToRefs } from 'pinia'
  import Version from './Version.vue'

  const ttsStore = useTtsStore()
  const { page, config } = storeToRefs(ttsStore)

  const menuChange = (index: number) => {
    if (index === 4) return
    page.value.asideIndex = index.toString()
  }
</script>

<style scoped>
    .aside {
        height: 100%;
        background-color: #fff;
        border-right: 1px solid #dcdfe6;
        border-top: 1px solid #dcdfe6;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom-left-radius: 10px;
        border-top-right-radius: 5px;
    }

    .el-menu {
        border-right: unset !important;
    }

    .el-menu-item {
        box-sizing: border-box;
        border-color: var(--el-menu-active-color);
        border-left: 2px solid transparent;
    }

    .is-active {
        border-left: 2px solid;
    }
</style>

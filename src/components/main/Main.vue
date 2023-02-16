<template>
  <div class='main'>
    <el-tabs tab-position='left' style='width: 100%;height: 100%' class='demo-tabs'>
      <el-tab-pane label='按运营商分类'>
        <Sort :dir='dir' />
      </el-tab-pane>
      <el-tab-pane label='过滤错号'>
        <Filter :dir='dir' />
      </el-tab-pane>
      <el-tab-pane label='号码去重'>
        <Repeat :dir='dir' />
      </el-tab-pane>
      <el-tab-pane label='号码对比'>
        <Compare :dir='dir' />
      </el-tab-pane>
      <el-tab-pane label='按地区导出'>
        <Location :dir='dir' />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang='ts'>
  import Sort from './Sort.vue'
  import Filter from './Filter.vue'
  import Repeat from './Repeat.vue'
  import Compare from './Compare.vue'
  import Location from './Location.vue'
  import { onMounted } from 'vue'

  const path = require('path')
  const fs = require('fs')
  const homedir = require('os').homedir()

  const dir = path.join(homedir, 'Desktop', '号码立方')
  onMounted(() => {
    //创建导出目录
    fs.readdir(dir, (err) => {
      if (err) {
        fs.mkdir(dir, function(err) {
          if (err) {
            return console.error(err)
          }
        })
      }
    })
  })

</script>

<style>
    .main {
        height: calc(100vh - 35px);
        background-color: #fff;
        scroll-behavior: smooth;
        overscroll-behavior: contain;
    }

    .input-area {
        width: 100% !important;
        border-radius: 5px !important;
    }

    .main-config-page {
        width: 100%;
        height: calc(100vh - 102px);
        background-color: #fff;
        border-radius: 5px;
        border: 1px solid #dcdfe6;
        overflow: hidden;
    }

    .table-tool {
        margin-top: 10px;
        margin-right: 10px;
        display: flex;
        justify-content: space-between;
    }

    .menu .el-menu {
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        height: 30px;
    }

    :deep(.el-upload-list) {
        display: none;
    }

    :deep(.el-textarea__inner) {
        height: calc(100vh - 500px);
        resize: none;
        border-radius: 5px !important;
    }

    :deep(textarea::-webkit-scrollbar) {
        width: 5px;
    }

    :deep(textarea::-webkit-scrollbar-thumb) {
        width: 5px;
        position: relative;
        display: block;
        cursor: pointer;
        border-radius: inherit;
        background-color: rgb(183, 192, 201);
        transition: 0.3 background-color;
        opacity: 0.3;
    }

    .doc-frame {
        width: 100%;
        height: 100%;
        border: medium none;
    }

    .el-upload__tip {
        color: #909399;
    }
</style>

<template>
  <div v-loading='true'>
    <div class='box'>
      <h3>手动录入</h3>
      <el-input v-model="text" type='textarea' placeholder='输入号码,多个号码用英文","分开' style='width: 99%' :autofocus='false' />
      <h3>文件导入</h3>
      <el-table
        :data='tableData'
        style='width: 99%'
      >
        <el-table-column
          prop='fileName'
          label='文件名'
          show-overflow-tooltip='true'
        />
        <el-table-column
          prop='filePath'
          label='文件路径'
          show-overflow-tooltip='true'
        />
        <el-table-column
          prop='fileSize'
          label='字数'
          width='60'
          show-overflow-tooltip='true'
        />
        <el-table-column prop='status' label='状态' width='60'>
          <template #default='scope'>
            <div>
              <el-tag
                class='ml-2'
                :type="scope.row.status == 'ready' ? 'info' : 'success'"
              >{{ scope.row.status }}
              </el-tag
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <template #default='scope'>
            <template v-if="scope.row.status == 'ready'">
              <el-button
                size='small'
                type='danger'
                @click='handleDelete(scope.$index, scope.row)'
              >移除
              </el-button
              >
            </template>
            <template v-else>
              <el-button
                size='small'
                type='warning'
                @click='play(scope.row)'
                circle
              >
                <el-icon>
                  <CaretRight />
                </el-icon
                >
              </el-button>
              <el-button size='small' @click='openInFolder(scope.row)' circle
              >
                <el-icon>
                  <FolderOpened />
                </el-icon
                >
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class='table-tool'>
        <el-upload
          ref='uploadRef'
          :auto-upload='false'
          :on-change='fileChange'
          :on-remove='fileRemove'
          show-file-list='false'
          accept='.txt'
          multiple
          size='small'
        >
          <template #trigger>
            <el-button type='primary'>选择文件</el-button>
          </template>

          <template #tip>
            <div class='el-upload__tip'>一行一个号码,文件类型为.txt,.csv</div>
          </template>
        </el-upload>
      </div>
    </div>
    <el-affix position='bottom' :offset='5'>
      <el-button type='primary' class='act'>立即分类</el-button>
    </el-affix>
  </div>
</template>

<script setup lang='ts'>
  import {ref} from 'vue'
  import * as util from './util'

  util.test('aaa')
  const text=ref('')
</script>

<style scoped>

</style>

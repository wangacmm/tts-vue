<template>
  <div class='box'>
    <!--          <h3>手动录入</h3>-->
    <!--          <el-input v-model='text' type='textarea' placeholder='输入号码,多个号码用英文","分开' style='width: 99%'-->
    <!--                    :autofocus='false'></el-input>-->
    <h3>文件导入</h3>
    <el-table
      :data='files'
      style='width: 99%'
    >
      <el-table-column
        prop='fileName'
        label='文件名'
        :show-overflow-tooltip='true'></el-table-column>
      <el-table-column
        prop='filePath'
        label='文件路径'
        :show-overflow-tooltip='true'></el-table-column>
      <el-table-column prop='status' label='状态' width='60'>
        <template #default='scope'>
          <div>
            <el-tag
              class='ml-2'
              :type="scope.row.status === 'ready' ? 'info' : 'success'"
            >{{ scope.row.status }}
            </el-tag
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column label='操作'>
        <template #default='scope'>
          <el-button
            size='small'
            type='danger'
            @click='handleDelete(scope.$index, scope.row)'
          >移除
          </el-button>
          <el-button size='small' type='primary' @click='openInFolder(scope.row)'>
            打开
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class='table-tool'>
      <el-upload
        ref='uploadRef'
        :auto-upload='false'
        :on-change='fileChange'
        :on-remove='fileRemove'
        :limit='1'
        :show-file-list='false'
        accept='.csv,.txt'
        size='small'
      >
        <template #trigger>
          <el-button type='info'>上传文件</el-button>
        </template>

        <template #tip>
          &nbsp;&nbsp;<span class='el-upload__tip'>文件类型为.txt或.csv</span>&nbsp;
          <span class='el-upload__tip'>一行一个号码,或用','分开</span>
        </template>
      </el-upload>
      <el-button type='primary' @click='sortMobile'>立即分类</el-button>
    </div>
    <h3>结果导出</h3>
    <el-table
      :data='results'
      stripe
      style='width: 99%'
    >
      <el-table-column
        prop='fileName'
        label='文件名'
        :show-overflow-tooltip='true'></el-table-column>
      <el-table-column
        prop='filePath'
        label='文件路径'
        :show-overflow-tooltip='true'></el-table-column>
      <el-table-column
        prop='fileSize'
        label='数量'
        :show-overflow-tooltip='true'></el-table-column>
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
          <el-button size='small' type='primary' @click='openInFolder(scope.row)'>
            打开
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang='ts'>
  import { ElMessage } from 'element-plus'
  import { ElLoading } from 'element-plus'
  import { ref } from 'vue'
  import { sort, openInFolder, getTimestamp, write } from './util'
  import { UploadInstance } from 'element-plus'
  import fs from 'fs'
  import path from 'path'

  const props: any = defineProps({
    dir: String
  })

  const files = ref([])
  const results = ref([])
  const fileChange = (uploadFile: any, uploadFiles: any) => {
    files.value = uploadFiles.map((item: any) => {
      return {
        fileName: item.name,
        filePath: item.raw.path,
        fileSize: item.size,
        status: item.status,
        file: item
      }
    })
  }

  const uploadRef = ref<UploadInstance>()

  const handleDelete = (index: any, row: any) => {
    uploadRef.value!.handleRemove(row.file)
  }
  const fileRemove = (uploadFile: any, uploadFiles: any) => {
    files.value = uploadFiles.map((item: any) => {
      return {
        fileName: item.name,
        filePath: item.raw.path,
        fileSize: item.size,
        status: item.status,
        file: item
      }
    })
  }

  const sortMobile = () => {
    if (files.value.length === 0) {
      return ElMessage.warning('请导入文件')
    }
    results.value = []
    const loading = ElLoading.service({
      lock: true,
      text: '处理中',
      background: 'rgba(0, 0, 0, 0.5)'
    })
    setTimeout(() => {
      let data = fs.readFileSync(files.value[0]['filePath']).toString()
      data = data.replaceAll('\n', ',')
      let arr = data.split(',')
      let err: string[] = []
      let yd: string[] = []
      let lt: string[] = []
      let dx: string[] = []
      for (let i = 0; i < arr.length; i++) {
        let mobile = arr[i]
        switch (sort(mobile)) {
          case 1:
            yd.push(mobile)
            break
          case 2:
            lt.push(mobile)
            break
          case 3:
            dx.push(mobile)
            break
          default:
            err.push(mobile)
            break
        }
      }
      const timestamp = getTimestamp()

      write(path.join(<string>props.dir, timestamp + '移动.txt'), yd.join('\n'))
      write(path.join(<string>props.dir, timestamp + '联通.txt'), lt.join('\n'))
      write(path.join(<string>props.dir, timestamp + '电信.txt'), dx.join('\n'))
      write(path.join(<string>props.dir, timestamp + '错号.txt'), err.join('\n'))
      ElMessage.success('操作成功')

      results.value = [
        {
          fileName: '移动.txt',
          filePath: path.join(<string>props.dir, timestamp + '移动.txt'),
          fileSize: yd.length,
          status: 'ok'
        },
        {
          fileName: '联通.txt',
          filePath: path.join(<string>props.dir, timestamp + '联通.txt'),
          fileSize: lt.length,
          status: 'ok'
        },
        {
          fileName: '电信.txt',
          filePath: path.join(<string>props.dir, timestamp + '电信.txt'),
          fileSize: dx.length,
          status: 'ok'
        },
        {
          fileName: '错号.txt',
          filePath: path.join(<string>props.dir, timestamp + '错号.txt'),
          fileSize: err.length,
          status: 'ok'
        }]
      loading.close()
    }, 1000)
  }
</script>

<style scoped>

</style>

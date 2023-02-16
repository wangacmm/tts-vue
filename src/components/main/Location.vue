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
        :limit='2'
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
      <el-button type='primary' @click='sortMobile'>开始导出</el-button>
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
  import { ref, onMounted } from 'vue'
  import { isMobile, openInFolder, getTimestamp, write } from './util'
  import { UploadInstance } from 'element-plus'
  import fs from 'fs'
  import path from 'path'

  const props: any = defineProps({
    dir: String
  })

  const sqlite3 = require('sqlite3')

  const locationMap = new Map()

  function SQLiteInit() {
    let rootPath = path.join(process.cwd(), '/db/location.db')
    console.log(rootPath)
    let db = new sqlite3.Database(rootPath, (err) => {
      if (err) throw err
      console.log('数据库连接')
      db.each('SELECT * FROM location', (err, row) => {
        locationMap.set(row.phone, row)
      })
    })
  }

  onMounted(() => {
    SQLiteInit()
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

  const getLocation = (mobile: string): object => {
    let key = mobile.substring(0, 7)
    let location = locationMap.get(key)
    if (!location) {
      key = mobile.substring(0, 8)
      location = locationMap.get(key)
    }
    return location ? location : {}
  }

  const sortMobile = () => {
    if (files.value.length === 0) {
      return ElMessage.error('请导入文件')
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
      let items = []
      for (let i = 0; i < arr.length; i++) {
        let item = []
        let mobile = arr[i]
        let location = getLocation(mobile)
        item.push(mobile)
        item.push(location['province'])
        item.push(location['city'])
        item.push(location['isp'])
        items.push(item.join(','))
      }
      const timestamp = getTimestamp()

      write(path.join(<string>props.dir, timestamp + '地区.csv'), items.join('\n'))
      ElMessage.success('操作成功')

      results.value = [
        {
          fileName: '地区.csv',
          filePath: path.join(<string>props.dir, timestamp + '地区.csv'),
          fileSize: items.length,
          status: 'ok'
        }
      ]
      loading.close()
    }, 1000)
  }
</script>

<style scoped>

</style>

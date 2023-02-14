import {
  ElContainer,
  ElIcon,
  ElButton,
  ElButtonGroup,
  ElMenu,
  ElInput,
  ElForm,
  ElSelect,
  ElCard,
  ElSlider,
  ElOption,
  ElTabs,
  ElTabPane,
  ElSelectV2,
  ElMenuItem,
  ElTable,
  ElRow,
  ElCol,
  ElTag,
  ElUpload,
  ElDialog,
  ElDivider,
  ElSwitch,
  ElPopover,
  ElDropdown,
  ElMessage,
  ElAffix,
} from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import * as Icons from '@element-plus/icons-vue'

const components = [
  ElContainer,
  ElContainer.Header,
  ElContainer.Main,
  ElContainer.Aside,
  ElContainer.Footer,
  ElTabs,
  ElRow,
  ElCol,
  ElTabPane,
  ElIcon,
  ElButton,
  ElButtonGroup,
  ElMenu,
  ElMenu.MenuItem,

  ElInput,
  ElMessage,
  ElCard,
  ElForm,
  ElForm.FormItem,
  ElSelect,
  ElSelectV2,
  ElSelect.Option,
  ElAffix,
  ElSlider,

  ElTable,
  ElTable.TableColumn,
  ElTag,

  ElUpload,
  ElDialog,
  ElSwitch,
  ElPopover,
  ElDivider,

  ElDropdown,
  ElDropdown.DropdownMenu,
  ElDropdown.DropdownItem,
]

export default function (app: any) {
  for (const component of components) {
    app.component(component.name, component)
  }

  for (const name in Icons) {
    app.component(name, (Icons as any)[name])
  }
}

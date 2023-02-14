import { shell } from 'electron'
import fs from 'fs'

export const openInFolder = (row: any) => {
  shell.showItemInFolder(row.filePath)
}
const yd: number[] = [
  1340, 1341, 1342, 1343, 1344, 1345, 1346, 1347, 1348, 135, 136, 137, 138, 139,
  147, 148, 150, 151, 152, 157, 158, 159, 165, 1703, 1705, 1706, 172, 178, 182,
  183, 184, 187, 188, 195, 198, 144, 193, 192,
]
const lt: number[] = [
  130, 131, 132, 140, 145, 146, 155, 156, 166, 167, 1704, 1707, 1708, 1709, 171,
  172, 175, 176, 185, 186, 196, 193, 195, 192,
]
const dx: number[] = [
  133, 1349, 141, 149, 153, 162, 1700, 1701, 1702, 172, 173, 174, 177, 180, 181,
  189, 190, 191, 199, 193, 195, 192,
]

const mobileReg =
  /^(13[0-9]|14[01456789]|15[012356789]|16[2567]|17[012345678]|18[0-9]|19[135689])\d{8}$/

export const isMobile = (mobile: string): boolean => {
  return mobileReg.test(mobile)
}
export const sort = (mobile: string): number => {
  if (!isMobile(mobile)) {
    return 0
  }
  for (let i = 0; i < yd.length; i++) {
    if (mobile.startsWith(yd[i] + '')) {
      return 1
    }
  }
  for (let i = 0; i < lt.length; i++) {
    if (mobile.startsWith(lt[i] + '')) {
      return 2
    }
  }
  for (let i = 0; i < dx.length; i++) {
    if (mobile.startsWith(dx[i] + '')) {
      return 3
    }
  }
  return 0
}

export function getTimestamp() {
  let now = new Date(),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate()
  return (
    y +
    '' +
    (m < 10 ? '0' + m : m) +
    (d < 10 ? '0' + d : d) +
    now.toTimeString().substring(0, 8).replaceAll(':', '')
  )
}

export const write = (filepath: string, data: string) => {
  fs.writeFile(filepath, data, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

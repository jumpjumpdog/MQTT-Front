import request from '@/plugin/myaxios'
export function Mysql (data) {
  return request({
    url: '/mysql',
    method: 'post',
    data
  })
}

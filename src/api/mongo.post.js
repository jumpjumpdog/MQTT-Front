import request from '@/plugin/myaxios'
export function Mongo (data) {
  return request({
    url: '/mongo',
    method: 'post',
    data
  })
}

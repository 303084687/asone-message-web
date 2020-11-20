//邮件配置接口
import request from '@/utils/request'

//模板列表
export function queryTemplateList(params) {
  return request({
    url: '/email/template/list',
    method: 'get',
    params: params
  })
}

//创建模板
export function createTemplate(data) {
  return request({
    url: '/email/template/create',
    method: 'post',
    data: data
  })
}

//修改模板
export function updateTemplate(id, data) {
  return request({
    url: '/email/template/update/' + id,
    method: 'post',
    data: data
  })
}

//删除模板
export function deleteTemplate(id) {
  return request({
    url: '/email/template/delete/' + id,
    method: 'post'
  })
}

//邮件日志列表
export function queryLogList(params) {
  return request({
    url: '/email/log/list',
    method: 'get',
    params: params
  })
}

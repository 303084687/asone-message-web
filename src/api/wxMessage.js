//微信消息接口
import request from '@/utils/request'

//模板列表
export function queryTemplateList(params) {
  return request({
    url: '/wx/messageTemplate/list',
    method: 'get',
    params: params
  })
}

//创建模板
export function createTemplate(data) {
  return request({
    url: '/wx/messageTemplate/create',
    method: 'post',
    data: data
  })
}

//修改模板
export function updateTemplate(templateId, data) {
  return request({
    url: '/wx/messageTemplate/update/' + templateId,
    method: 'post',
    data: data
  })
}

//删除模板
export function deleteTemplate(templateId) {
  return request({
    url: '/wx/messageTemplate/delete/' + templateId,
    method: 'post'
  })
}

//微信消息日志列表
export function queryLogList(params) {
  return request({
    url: '/wxlog/messageLog/list',
    method: 'get',
    params: params
  })
}

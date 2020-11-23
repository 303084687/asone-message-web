<!--邮件推送日志-->
<template> 
  <div class="app-container">
    <!--模糊搜索-->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
       <!--模糊查询条件-->
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.templateName" class="input-width" placeholder="模板名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.subject" class="input-width" placeholder="邮件主题" clearable></el-input>
          </el-form-item>
           <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.receiveMail" class="input-width" placeholder="邮件接收人" clearable></el-input>
          </el-form-item>
          <el-form-item label="消息状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in categoryOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!--数据列表-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="模板Id" width="400px" align="center" >
          <template slot-scope="scope">{{scope.row.templateId}}</template>
        </el-table-column>
        <el-table-column label="模板名称" align="center">
          <template slot-scope="scope">{{scope.row.templateName}}</template>
        </el-table-column>
        <el-table-column label="邮件主题" align="center">
          <template slot-scope="scope">{{scope.row.subject}}</template>
        </el-table-column>
        <el-table-column label="邮件接收人" align="center">
          <template slot-scope="scope">{{scope.row.receiveMail}}</template>
        </el-table-column>
        <el-table-column label="发送状态" align="center">
          <template slot-scope="scope">{{scope.row.status==0?'成功':'失败'}}</template>
        </el-table-column>
        <el-table-column label="发送时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleQuery(scope.$index, scope.row)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="'邮件发送日志详情'"
      :visible.sync="dialogVisible"
      width="40%">
      <div class="el-dialog-div">
        <el-form :model="messageLog" size="small">
          <el-form-item label="模板Id：">
            <template>{{messageLog.templateId}}</template>
          </el-form-item>
          <el-form-item label="模板名称：">
            <template>{{messageLog.templateName}}</template>
          </el-form-item>
          <el-form-item label="邮件主题：">
            <template>{{messageLog.subject}}</template>
          </el-form-item>
          <el-form-item label="发送状态：">
            <template>{{messageLog.status==0?'成功':'失败'}}</template>
          </el-form-item>
          <el-form-item label="成功/失败原因：">
            <template>{{messageLog.message}}</template>
          </el-form-item>
          <el-form-item label="邮件接收人：">
            <template>{{messageLog.receiveMail}}</template>
          </el-form-item>
          <el-form-item label="邮件内容：">
            <template><p v-html='messageLog.content'></p></template>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
   //接口地址
  import {queryLogList} from '@/api/email';
  import {formatDate} from '@/utils/date';
  //默认查询参数
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    templateName: "",
    subject:"",
    receiveMail: "",
    //0成功1失败,默认2全部
    status: 2
  };
  //数据实体
  const defaultMessageLog= {
    id: null,
    //模板主键
    templateId: '',
    //模板名称
    templateName: '',
    //邮件主题
    subject: '',
    //邮件接收者
    receiveMail:'',
    //发送内容
    content: '',
    //发送状态0成功1失败
    status: null,
    //失败原因
    message: ''
  };
  export default {
    name: 'logList',
    data() {
      return {
        //查询参数
        listQuery: Object.assign({}, defaultListQuery),
        //模板数据集合
        list: null,
        //总页数
        total: null,
        //数据加载
        listLoading: false,
        //弹窗
        dialogVisible: false,
        //实体参数
        messageLog: Object.assign({}, defaultMessageLog),
        //搜索下拉框默认数据
        categoryOptions:[
          {
            "label":"全部",
            "value":2
          },
          {
            "label":"成功",
            "value":0
          },{
            "label":"失败",
            "value":1
          }
        ],
      }
    },
    //初始化数据
    created() {
      this.getTemplateLogList();
    },
    //格式化时间
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    //方法
    methods: {
      //加载微信日志列表
      getTemplateLogList() {
        this.listLoading = true;
        queryLogList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });

      },
      //搜索重置
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      //搜索事件
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getTemplateLogList();
      },
      //分页输入数字事件
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getTemplateLogList();
      },
      //分页下一页事件
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getTemplateLogList();
      },
      //查看微信消息日志详情
      handleQuery(index, row) {
        this.dialogVisible = true;
        this.messageLog = Object.assign({},row);
      },
    }
  }
</script>
<style>
  .el-dialog-div{
    height: 65vh;
    margin-left: 25px;
    overflow: auto;
  }
</style>

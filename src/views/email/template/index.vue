<!--邮件配置列表-->
<template> 
  <div class="app-container">
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
            <el-input v-model="listQuery.templateId" class="input-width" placeholder="模板Id" clearable></el-input>
          </el-form-item>
           <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.templateName" class="input-width" placeholder="模板名称" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <!--数据列表部分-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="adminTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="模板Id" align="center" width="280px">
          <template slot-scope="scope">{{scope.row.templateId}}</template>
        </el-table-column>
        <el-table-column label="模板名称" align="center">
          <template slot-scope="scope">{{scope.row.templateName}}</template>
        </el-table-column>
          <el-table-column label="邮件标题" align="center">
          <template slot-scope="scope">{{scope.row.subject}}</template>
        </el-table-column>
        <el-table-column label="服务器host" align="center">
          <template slot-scope="scope">{{scope.row.host}}</template>
        </el-table-column>
        <el-table-column label="服务器port" align="center">
          <template slot-scope="scope">{{scope.row.port}}</template>
        </el-table-column>
        <el-table-column label="邮件用户名" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleQuery(scope.$index, scope.row)"> 查看
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页参数部分-->
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
    <!--添加/编辑模板-->
    <el-dialog
      :title="isEdit?'编辑邮件模板':'添加邮件模板'"
      :visible.sync="dialogVisible"
      width="47%">
      <el-form :model="message"
              ref="templateForm"
              :rules="rules"
              label-width="200px" size="small">
        <el-form-item label="模板名称：" :required="true" prop="templateName">
          <el-input v-model="message.templateName" style="width: 550px" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="邮件标题：" :required="true" prop="subject">
          <el-input v-model="message.subject" style="width: 550px" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="服务器host：" :required="true" prop="host">
          <el-input v-model="message.host"   style="width: 550px" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="服务器port：" :required="true" prop="port">
          <el-input v-model="message.port" style="width: 550px" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="邮件用户名：" :required="true" prop="userName">
          <el-input v-model="message.userName"  style="width: 550px" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="邮件用户名密码：" :required="true" prop="passWord">
          <el-input v-model="message.passWord" style="width: 550px" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="发件人地址：">
          <el-input v-model="message.fromMail"  style="width: 550px" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容：">
          <el-input v-model="message.content"
                    type="textarea"
                    :rows="10"
                    style="width: 550px"
                    maxlength="8000">
          </el-input>
          <!--提示语-->
          <el-tooltip class="item" effect="light" content="发送邮件的时候会检查改值，有直接使用，否则使用自定义" placement="right-start">
              <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('templateForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看详情弹窗-->
    <el-dialog
    :title="'查看邮件模板详情'"
    :visible.sync="dialogVisibleShow"
    width="47%">
      <el-form :model="message"
              label-width="200px" size="small">
        <el-form-item label="模板Id：">
          <el-input v-model="message.templateId" style="width: 550px" disabled></el-input>
        </el-form-item>
        <el-form-item label="模板名称：">
          <el-input v-model="message.templateName" style="width: 550px" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务器host：">
          <el-input v-model="message.host" style="width: 550px" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务器port：">
          <el-input v-model="message.port"   style="width: 550px" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮件用户名：">
          <el-input v-model="message.userName" style="width: 550px" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮件用户名密码：">
          <el-input v-model="message.passWord"  style="width: 550px" disabled></el-input>
        </el-form-item>
        <el-form-item label="发件人地址：" >
          <el-input v-model="message.fromMail" style="width: 550px" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="message.content"
                    type="textarea"
                    :rows="10"
                    style="width: 550px"
                    disabled>
          </el-input>
          <!--提示语-->
          <el-tooltip class="item" effect="light" content="发送邮件的时候会检查改值，有直接使用，否则使用自定义" placement="right-start">
              <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
     </el-form>
    </el-dialog>
  </div>
</template>
<script>
  //接口地址
  import {queryTemplateList,createTemplate,updateTemplate,deleteTemplate} from '@/api/email';
  //时间格式化
  import {formatDate} from '@/utils/date';
  //默认查询参数
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    templateId: "",
    templateName: ""
  };
  //数据实体参数
  const defaultMessage = {
    //主键
    id:null,
    //模板Id
    templateId: "",
    //模板名称
    templateName: "",
    //邮件服务器host
    host: "",
    //邮件服务器port
    port: "",
    //邮件标题
    subject: "",
    //邮件用户名
    userName: "",
    //邮件用户名密码
    passWord: "",
    //发件人地址
    fromMail: "",
    //邮件内容
    content: ""
  };
  export default {
    name: 'messageList',
    //监听验证参数
    watch: {
              dialogVisible: function (val,oldVla) {
                  if (this.$refs['templateForm'] != undefined) {
                      this.$refs["templateForm"].resetFields();
                  }
              }
            },
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
        //控制添加or修改弹窗
        dialogVisible: false,
        //控制查看弹窗
        dialogVisibleShow: false,
        //消息模板实体
        message: Object.assign({}, defaultMessage),
        //添加or修改弹窗标识
        isEdit: false,
        //是否必填验证
        rules: {
          templateName: [
            {required: true, message: '请输入模板名称', trigger: 'change'},
          ],
          subject: [
            {required: true, message: '请输入邮件标题', trigger: 'change'},
          ],
          host: [
            {required: true, message: '请输入服务器host', trigger: 'change'},
          ],
          port: [
            {required: true, message: '请输入服务器port', trigger: 'change'},
          ],
          userName: [
            {required: true, message: '请输入邮件用户名', trigger: 'change'},
          ],
          passWord: [
            {required: true, message: '请输入邮件用户名密码', trigger: 'change'},
          ]
        }
      }
    },
    //初始化数据
    created() {
      this.getTemplateList();
    },
    //时间事件格式化
    filters: {
      formatDateTime(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    //接口方法
    methods: {
      //加载微信模板列表
      getTemplateList() {
        this.listLoading = true;
        queryTemplateList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      //分页输入数字事件
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getTemplateList();
      },
      //分页下一页事件
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getTemplateList();
      },
      //搜索重置
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      //搜索事件
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getTemplateList();
      },
      //查看邮件模板详情
      handleQuery(index, row) {
        this.dialogVisibleShow = true;
        this.message = Object.assign({},row);
      },
      //添加邮件模板弹窗
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.message = Object.assign({},defaultMessage);
      },
      //修改邮件模板弹窗
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.message = Object.assign({},row);
      },
      //删除邮件模板
      handleDelete(index, row) {
        this.$confirm('是否要删除该模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTemplate(row.id).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTemplateList();
          });
        });
      },
      //添加or修改邮件模板
      handleDialogConfirm(formName) {
        //先验证参数
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                 updateTemplate(this.message.id,this.message).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  //关闭弹窗
                  this.dialogVisible =false;
                  //刷新列表
                  this.getTemplateList();
                });
              } else {
                 createTemplate(this.message).then(response => {
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                  //关闭弹窗
                  this.dialogVisible =false;
                  //刷新列表
                  this.getTemplateList();
                });
              }
            });
          }
        });
     }
    }
  }
</script>
<style></style>
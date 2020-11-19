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
        <el-table-column label="公众号appid" align="center">
          <template slot-scope="scope">{{scope.row.appId}}</template>
        </el-table-column>
        <el-table-column label="公众号跳转url" align="center">
          <template slot-scope="scope">{{scope.row.url}}</template>
        </el-table-column>
        <el-table-column label="公众号关联小程序appid" align="center">
          <template slot-scope="scope">{{scope.row.miniAppId}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
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
      :title="isEdit?'编辑微信消息模板':'添加微信消息模板'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="message"
              ref="templateForm"
              :rules="rules"
              label-width="200px" size="small">
        <el-form-item label="模板Id：" :required="true" prop="templateId">
          <el-input v-model="message.templateId" style="width: 450px" maxlength="49">     </el-input>
          <el-tooltip class="item"  effect="light" content="必须和微信公众号设置的消息模板Id一致"  placement="right-start">
          <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="模板名称：" :required="true" prop="templateName">
          <el-input v-model="message.templateName" style="width: 450px" maxlength="40"></el-input>
        </el-form-item>
        <el-form-item label="微信公众号appid：" :required="true" prop="appId">
          <el-input v-model="message.appId" style="width: 450px" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="微信公众号secret：" :required="true" prop="secret">
          <el-input v-model="message.secret"   style="width: 450px" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="微信公众号token：">
          <el-input v-model="message.token" style="width: 450px" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="微信公众号aesKey：">
          <el-input v-model="message.aesKey"  style="width: 450px" maxlength="60"></el-input>
        </el-form-item>
        <el-form-item label="微信公众号跳转url：" >
          <el-input v-model="message.url" style="width: 450px" maxlength="300"></el-input>
          <el-tooltip class="item"  effect="light" placement="right-start">
          <div slot="content">
              非必填，微信消息模板跳转链接（海外帐号没有跳转能力），若不填则模板无跳转 <br/>
              若url和小程序appid都传，会优先跳转小程序，当用户的微信客户端版本不支持跳小程序时，将会跳转至url。
          </div>
          <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="公众号关联小程序appid：">
          <el-input v-model="message.miniAppId"  style="width: 450px" maxlength="50"></el-input>
          <el-tooltip class="item" effect="light" placement="right-start">
            <div slot="content">
              非必填，所需跳转到的小程序appid（该小程序必须与发模板消息的公众号是绑定关联关系，暂不支持小游戏） <br/>
              若url和小程序appid都传，会优先跳转小程序，当用户的微信客户端版本不支持跳小程序时，将会跳转至url。
            </div>
            <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="公众号关联小程序跳转地址：">
          <el-input v-model="message.miniPagePath"  style="width: 450px" maxlength="250"></el-input>
          <el-tooltip class="item" effect="light" content="所需跳转到小程序的具体页面路径，支持带参数,（示例index?foo=bar），要求该小程序已发布，暂不支持小游戏" placement="right-start">
          <div slot="content">
              非必填，所需跳转到小程序的具体页面路径，支持带参数,（示例index?foo=bar） <br/>
              若填写小程序appid必须填写，且该小程序要求已发布，暂不支持小游戏。
          </div>
          <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="message.description"
                    type="textarea"
                    :rows="5"
                    style="width: 450px"
                    maxlength="240">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('templateForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看详情弹窗-->
    <el-dialog
    :title="'查看微信消息模板详情'"
    :visible.sync="dialogVisibleShow"
    width="40%">
      <el-form :model="message"
              label-width="200px" size="small">
        <el-form-item label="模板Id：">
          <el-input v-model="message.templateId" style="width: 450px" disabled></el-input>
        </el-form-item>
        <el-form-item label="模板名称：">
          <el-input v-model="message.templateName" style="width: 450px" disabled></el-input>
        </el-form-item>
        <el-form-item label="微信公众号appid：">
          <el-input v-model="message.appId" style="width: 450px" disabled></el-input>
        </el-form-item>
        <el-form-item label="微信公众号secret：">
          <el-input v-model="message.secret"   style="width: 450px" disabled></el-input>
        </el-form-item>
        <el-form-item label="微信公众号token：">
          <el-input v-model="message.token" style="width: 450px" disabled></el-input>
        </el-form-item>
        <el-form-item label="微信公众号aesKey：">
          <el-input v-model="message.aesKey"  style="width: 450px" disabled></el-input>
        </el-form-item>
        <el-form-item label="微信公众号跳转url：" >
          <el-input v-model="message.url" style="width: 450px" disabled></el-input>
          <el-tooltip class="item" effect="light" content="模板跳转链接，URL置空，则在发送后，点击模板消息无法点击" placement="right-start">
              <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="公众号关联小程序appid：">
          <el-input v-model="message.miniAppId"  style="width: 450px" disabled></el-input>
          <el-tooltip class="item" effect="light" content="所需跳转到的小程序appid（该小程序appid必须与发模板消息的公众号是绑定关联关系，暂不支持小游戏）" placement="right-start">
              <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="公众号关联小程序跳转地址：">
          <el-input v-model="message.miniPagePath"  style="width: 450px" disabled></el-input>
          <el-tooltip class="item" effect="light" content="所需跳转到小程序的具体页面路径，支持带参数,（示例index?foo=bar），要求该小程序已发布，暂不支持小游戏" placement="right-start">
              <i class="el-icon-question" />
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="message.description"
                    type="textarea"
                    :rows="5"
                    style="width: 450px"
                    disabled>
          </el-input>
        </el-form-item>
     </el-form>
    </el-dialog>
  </div>
</template>
<script>
  //接口地址
  import {queryTemplateList,createTemplate,updateTemplate,deleteTemplate} from '@/api/wxMessage';
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
    //微信公众号appid
    appId: "",
    //微信公众号secret
    secret: "",
    //微信公众号设置的token
    token: "",
    //微信公众号设置的aesKey
    aesKey: "",
    //详情跳转页面--请注意，URL置空，则在发送后，点击模板消息无法点击
    url: "",
    //公众号关联小程序appid
    miniAppId: "",
    //公众号关联小程序跳转地址带参数
    miniPagePath: "",
    //描述
    description: ""
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
          templateId: [
            {required: true, message: '请输入模板Id,必须和微信消息模板Id一致', trigger: 'change'},
          ],
          templateName: [
            {required: true, message: '请输入模板名称', trigger: 'change'},
          ],
          appId: [
            {required: true, message: '请输入微信公众号appId', trigger: 'change'},
          ],
          secret: [
            {required: true, message: '请输入微信公众号secret', trigger: 'change'},
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
      //查看微信消息模板详情
      handleQuery(index, row) {
        this.dialogVisibleShow = true;
        this.message = Object.assign({},row);
      },
      //添加微信消息模板弹窗
      handleAdd() {
        this.dialogVisible = true;
        this.isEdit = false;
        this.message = Object.assign({},defaultMessage);
      },
      //修改微信消息模板弹窗
      handleUpdate(index, row) {
        this.dialogVisible = true;
        this.isEdit = true;
        this.message = Object.assign({},row);
      },
      //删除微信消息模板
      handleDelete(index, row) {
        this.$confirm('是否要删除该模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTemplate(row.templateId).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTemplateList();
          });
        });
      },
      //添加or修改微信模板
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
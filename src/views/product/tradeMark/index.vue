<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="handleAddBtn"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updataTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      :pager-count="7"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="getPageList"
    >
    </el-pagination>
    <!-- 弹出对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTradeMarkOrUpdataTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",

  data() {
    //自定义表单验证
    var validatePass = (rule, value, callback) => {
      //value,需要验证的值，callback放行函数
      if (value === "") {
        callback(new Error("请选择品牌图片"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      limit: 3,
      total: 0,
      list: [],
      //对话框显示与隐藏
      dialogFormVisible: false,
      //收集对话框的表单
      from: {},
      //准备一个对象，用来收集添加和修改提交的数据
      tmForm: {
        logoUrl: "",
        tmName: "",
      },

      //element-ui表单验证
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    async getPageList(pager = 1) {
      //当点击不同页数时，触发current-change函数，重新发送请求,第一次加载分页器时候，没有点击任何页数，默认值为pager = 1，点击后就把点击的值赋值给page
      //current-change默认传递当前点击的页数参数
      this.page = pager;
      //解构默认参数
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    //当点击修改当前页显示多少条数据时会触发handleSizeChange函数
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //处理点击添加时的回调
    handleAddBtn() {
      //对话框显示出来
      (this.dialogFormVisible = true),
        //清空上一次添加遗留的数据
        (this.tmForm.logoUrl = ""),
        (this.tmForm.tmName = "");
    },
    //对话框图片收集成功回调
    handleAvatarSuccess(res, file) {
      //收集图片服务器地址数据
      this.tmForm.logoUrl = res.data;
    },
    //对话框图片收集前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //对话框确定按钮回调函数(处理添加商品或者修改商品)
    addTradeMarkOrUpdataTradeMark() {
      //表单校验，如果校验通过，则继续往下
      this.$refs.ruleForm.validate(async (vaild) => {
        //vaild是一个boolean值
        if (vaild) {
          //vaild为真,验证通过
          const { tmForm } = this;
          //发送请求
          let result =
            await this.$API.tradeMark.reqAddTradeMarkOrUpdataTradeMark(tmForm);
          if (result.code == 200) {
            //重新发送请求获取列表，如果是修改商品时，需要判断是否是在第一页，如果是，则成功时显示当前页数为默认的第一页，如果不是，则需要跳转到点击的页数
            this.getPageList(this.tmForm.id ? this.page : 1);
            //请求发送成功,弹出element-ui的成功信息框
            this.$message({
              message: this.tmForm.id
                ? "恭喜你，修改成功!"
                : "恭喜你，添加成功!",
              type: "success",
            });
          }
          // 把对话框隐藏
          this.dialogFormVisible = false;
        } else {
          //vaild为false,验证失败
          alert("表单验证失败，请检查输入内容是否符合要求");
          return false;
        }
      });
    },
    //修改品牌按钮回调
    updataTradeMark(row) {
      //显示对话框
      this.dialogFormVisible = true;

      //row通过slot插件传参过来，函数接收,row即使点击的当前行的信息,我们需要把这个信息显示在弹出来的对话框内,但是由于页面的数据是v-model双向绑定,所以需要使用浅拷贝
      this.tmForm = { ...row };
    },
    //删除按钮回调事件
    handleDelete(row) {
      this.$confirm(`此操作将永久删除${row.tmName}商品, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        //点击确认触发.then
        .then(async () => {
          //发送删除请求
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          //重新获取列表,当前页数需要进行判断,如果当前显示的商品数量小于1，则-1页，如果当前显示的商品数量大于1，则不需要改变当前页
          this.getPageList(this.list.length>1?this.page:this.page-1);
        })
        //点击取消触发.catch
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getPageList();
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="show"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <!-- 添加Spu按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- SPU属性详情 -->
        <el-table :data="records" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>

          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>

          <el-table-column label="操作" width="width">
            <!-- 按钮   -->
            <template slot-scope="{ row }">
              <!-- 添加sku按钮 -->
              <el-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <!-- 修改spu按钮 -->
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改spu"
                @click="updateSpu(row)"
                @changeSpuScene="$emit('initSpuData')"
              ></el-button>
              <!-- 查看当前spu的sku列表按钮 -->
              <el-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看当前spu全部sku列表"
                @click="showDialog(row)"
              ></el-button>
              <!-- 删除spu按钮 -->
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除spu"
                  slot="reference"
                  style="margin-left: 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getAttrList"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
        >
        </el-pagination>
      </div>
      <spuScene
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spuScene"
      ></spuScene>
      <skuScene
        v-show="scene == 2"
        ref="skuScene"
        @changeScenes="changeScenes"
      ></skuScene>
    </el-card>
    <!-- 点击查看详细SKU按钮弹出的对话框 -->
    <el-dialog
      :title="`${spu.spuName}的sku属性`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">

        </el-table-column>

        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>

        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>

        <el-table-column prop="prop" label="默认图片" width="width">
          <template slot-scope="{row}">
            <div>
              <img :src="row.skuDefaultImg" alt="" style="weight:100px;height:100px">
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
//引入scene子组件
import spuScene from "./spuScene";
import skuScene from "./skuScene";

export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      show: true,
      //默认当前页参数，接口函数getCategoryId需要携带
      page: 1,
      limit: 3,
      //接收服务器返回的Spu参数
      records: [],
      total: 0,
      //控制第二个card组件的三个页面切换,0==>默认Spu列表,1==>spu修改与添加,2==>sku的展示与修改
      scene: 0,
      //控制对话框的显示与隐藏,默认隐藏
      dialogTableVisible: false,

      //dialog对话框内所需数据
      spu: {},
      skuList: [],
      //控制loading效果
      loading:true,
    };
  },
  components: {
    spuScene,
    skuScene,
  },
  methods: {
    //获取Spu详情
    async getAttrList(pages = 1) {
      this.page = pages;
      //结构参数  page,limit,category3Id
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqGetSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //获取子组件传递的ID
    getCategoryId({ categoryId, leve }) {
      //通过结构的方式接收两个参数，再通过leve来判断接收的是几级ID
      if (leve == 1) {
        //当重新选择一级ID菜单时,需要把后面两个全部清空
        this.category2Id = "";
        this.category3Id = "";

        this.category1Id = categoryId;
      } else if (leve == 2) {
        //当重新选择二级ID菜单时,需要把后面一个全部清空
        this.category3Id = "";

        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;

        //当进入当前判断时,则代表获取到三级ID了，并且一定获取到一二级ID了
        this.getAttrList();
      }
    },
    //当前pagination显示页数发生变化时触发回调
    handleSizeChange(limit) {
      this.limit = limit;
      //重新发送请求
      this.getAttrList();
    },
    //添加spu按钮回调
    addSpu() {
      this.scene = 1;
      //通知子组件发送请求，
      this.$refs.spuScene.addSpuData(this.category3Id);
    },
    //修改spu按钮回调
    updateSpu(row) {
      this.scene = 1;
      //通知子组件发送请求，获取初始化数据
      this.$refs.spuScene.initSpuData(row.id);
    },
    //改变视图
    changeScene(scene) {
      this.scene = scene;
      //切换回来当前0页，需要重新发送请求获取修改或添加后的列表
      this.getAttrList(this.page);
    },
    //改变视图
    changeScenes(scene) {
      this.scene = scene;
    },
    //删除spu按钮回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功!" });
      }
      //再次发送请求获取页面列表
      this.getAttrList(this.records.length > 1 ? this.page : this.page - 1);
    },
    //点击sku按钮回调
    addSku(row) {
      this.scene = 2;
      //通知子组件发送请求，获取数据
      this.$refs.skuScene.getData(this.category1Id, this.category2Id, row);
    },
    //点击查看详细sku按钮的回调
    async showDialog(spu) {
      //保存spu，以便其中id等等需要使用
      this.spu = spu;
      this.dialogTableVisible = true;

      //发送请求
      let result = await this.$API.spu.reqFindBySpuId(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        //加载完成后，消除loading效果
        this.loading = false;
      }
    },
    //关闭对话框回调
    close(done){
      //done 用于关闭 Dialog
      //清空sku数据
      this.skuList = [];
      //loading效果重置
      this.loading = true;
      //关闭对话框
      done();
    }
  },
};
</script>

<style>
</style>
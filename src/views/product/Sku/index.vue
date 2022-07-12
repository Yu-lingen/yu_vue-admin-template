<template>
  <div>
    <!-- 表格 -->
    <el-table style="width: 100%" :data="records">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            icon="el-icon-top"
            size="mini"
            v-if="row.isSale == 0"
            @click="sale(row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-bottom"
            size="mini"
            v-else
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="onDevelop"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="showDrawer(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            style="margin-left: 20px"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,total,sizes"
      :total="total"
    >
    </el-pagination>

    <!-- 右侧抽屉 -->
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      :show-close="false"
      size="50%"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuListInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuListInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuListInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin-right:10px"
            type="success"
            v-for="skuTag in skuListInfo.skuSaleAttrValueList"
            :key="skuTag.id"
            >{{ `${skuTag.saleAttrName} : ${skuTag.saleAttrValueName}` }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="800px">
            <el-carousel-item v-for="img in skuListInfo.skuImageList" :key="img.id">
              <img :src="img.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      //当前页数
      page: 1,
      //一页显示多少跳数据
      limit: 7,
      //总共多少条数据
      total: 0,
      //存储服务器返回的skulist数据
      records: [],
      //控制右侧抽屉显示与隐藏
      drawer: false,
      //存储服务器返回的getSkuById的数据
      skuListInfo: {},
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(pages = 1) {
      //分页器回调,分页器自定义current-change事件，会接收一个pages，点击的当前页参数，默认是第一页，如果点击其他页，则更改data中的数据
      this.page = pages;

      //解构参数
      const { page, limit } = this;
      let result = await this.$API.sku.reqGetSkuList(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //分页器回调函数
    handleSizeChange(limit) {
      this.limit = limit;
      //重新发送请求
      this.getSkuList();
    },
    //商品上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "商品上架成功 !" });
      }
    },
    //商品下架
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "商品下架成功 !" });
      }
    },
    //编辑按钮
    onDevelop() {
      this.$message({ type: "info", message: "正在开发中..." });
    },
    //显示抽屉按钮
    async showDrawer(row) {
      //发送请求,获取改sku的详细信息
      let result = await this.$API.sku.reqGetSkuById(row.id);
      if (result.code == 200) {
        this.skuListInfo = result.data;
      }
      this.drawer = true;
    },
  },
};
</script>
<style  scoped>
.el-row .el-col {
  margin: 10px 10px;
}
.el-row .el-col-5 {
  font-size: 24px;
  text-align: right;
}
.el-row .el-col-16 {
  font-size: 20px;
}
 .el-carousel__button{
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #bfa;
}
</style>
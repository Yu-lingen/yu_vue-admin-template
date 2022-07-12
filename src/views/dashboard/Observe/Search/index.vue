<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <div class="search-header">
          <span>线上热门搜索</span>
          <!-- 下拉菜单 -->
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <lineCharts></lineCharts>
          </el-col>
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
        </el-row>
      </div>
      <!-- 表格区域 -->
      <el-table
        :data="
          searchData.slice((currentPage - 1) * PageSize, currentPage * PageSize)
        "
        style="width: 100%"
        :default-sort="{ prop: 'count', order: 'descending' }"
        border
      >
        <el-table-column align="center" label="排名" width="60" type="index">
        </el-table-column>
        <el-table-column
          align="center"
          prop="word"
          label="搜索关键句"
          width="120"
        >
        </el-table-column>
        <el-table-column align="center" prop="count" label="用户数" sortable>
        </el-table-column>
        <el-table-column align="center" prop="user" label="周涨幅" sortable>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        @current-change="handleCurrentChange"
        class="pagination"
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="PageSize"
        :total="searchData.length"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
//引入lineCharts组件
import LineCharts from "./lineCharts";

export default {
  name: "Search",
  data() {
    return {
      searchData: [],
      currentPage: 1,
      PageSize: 5,
    };
  },
  props: ["searchWord"],
  components: {
    LineCharts,
  },
  watch:{
    searchWord(listData){
     this.searchData = listData;
    }
  },
  methods:{
    handleCurrentChange(value){
      this.currentPage = value;
    }
  }
};
</script>

<style scoped>
.el-card__header {
  border-bottom: 1px solid #eee;
}
.search-header {
  display: flex;
  justify-content: space-between;
}
.pagination {
  float: right;
}
</style>


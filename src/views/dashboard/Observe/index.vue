<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <Search :searchWord="listData.searchWord"></Search>
      </el-col>
      <el-col :span="12">
        <Category :saleRank="listData.saleRank"></Category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入Search和Category子组件
import Search from "./Search";
import Category from "./Category";
import { mapState } from "vuex";

export default {
  name: "Observer",
  components: {
    Search,
    Category,
  },
  computed: {
    ...mapState({ listData: (state) => state.home.list }),
  },
};
</script>

<style>
</style>
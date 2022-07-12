<template>
  <div>
    <!-- inline表示是行内表单，可以一行展示多个表单元素 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级菜单" :model="idForm">
        <el-select
          v-model="idForm.category1Id"
          placeholder="请选择"
          @change="handleC2Id"
          :disabled="!show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in c1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级菜单" :model="idForm">
        <el-select
          placeholder="请选择"
          v-model="idForm.category2Id"
          @change="handleC3Id"
          :disabled="!show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in c2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级菜单" :model="idForm">
        <el-select
          placeholder="请选择"
          v-model="idForm.category3Id"
          @change="handleDetail"
          :disabled="!show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in c3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  data() {
    return {
      //一级标题菜单数据
      c1List: [],
      //二级标题菜单数据
      c2List: [],
      //三级标题菜单数据
      c3List: [],

      //收集对应级别菜单的id
      idForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props:['show'],
  methods: {
    //收集一级菜单数据
    async getCategory1Id() {
      let result = await this.$API.attr.reqCategory1Id();
      if (result.code == 200) {
        this.c1List = result.data;
      }
    },
    //监测到一级分类ID项发生变化时，就同时发送请求获取二级分类ID
    async handleC2Id() {
      //当一级分类ID项再次发生变化时，需要清空原有的数据，在发送请求
      this.c2List = [];
      this.c3List = [];
      this.idForm.category2Id = "";
      this.idForm.category3Id = "";
      //结构category1Id
      const { category1Id } = this.idForm;

      //触发父组件的自定义方法，把对应的id传给父组件,为了方便父组件判断是几级id，所以多传一个leve参数，那么传参的形式就为对象
      this.$emit("getCategoryId", { categoryId:category1Id, leve: 1 });

      let result = await this.$API.attr.reqCategory2Id(category1Id);
      if (result.code == 200) {
        this.c2List = result.data;
      }
    },

    //监测到二级分类ID项发生变化时，就同时发送请求获取三级分类ID
    async handleC3Id() {
      //当二级分类ID项再次发生变化时，需要清空原有的数据，在发送请求
      this.c3List = [];
      this.idForm.category3Id = "";
      //结构category2Id
      const { category2Id } = this.idForm;

      //触发父组件的自定义方法，把对应的id传给父组件,为了方便父组件判断是几级id，所以多传一个leve参数，那么传参的形式就为对象
      this.$emit("getCategoryId", { categoryId:category2Id, leve: 2 });

      let result = await this.$API.attr.reqCategory2Id(category2Id);
      if (result.code == 200) {
        this.c3List = result.data;
      }
    },
    //监测到三级分类ID项发生变化时,
    handleDetail() {
      //结构三级ID
      const { category3Id } = this.idForm;
      //触发父组件的自定义方法，把对应的id传给父组件,为了方便父组件判断是几级id，所以多传一个leve参数，那么传参的形式就为对象
      this.$emit("getCategoryId", { categoryId:category3Id, leve: 3 });
    },
  },

  mounted() {
    this.getCategory1Id();
  },
};
</script>

<style>
</style>
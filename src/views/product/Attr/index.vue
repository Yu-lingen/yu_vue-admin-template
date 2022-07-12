<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="isShowCard"
      ></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowCard">
        <el-button
          style="margin: 20px 0px"
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>

          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- 这里使用el-tag标签,要使用到作用域插槽 -->
            <template slot-scope="{ row }">
              <el-tag
                style="margin: 0px 15px"
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>

              <el-popconfirm
                :title="`确定删除${row.attrName}吗？`"
                @onConfirm="deleteAttrList(row)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  size="mini"
                  slot="reference"
                  style="margin-left: 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowCard">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowCard = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column label="属性名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                placeholder="请输入属性名称"
                size="mini"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="changeShowValue(row)"
                @keydown.native.enter="changeShowValue(row)"
                :ref="$index"
              ></el-input>
              <span
                style="display: block"
                @click="changeFocus(row, $index)"
                v-else
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确认要删除${row.valueName}`"
                @onConfirm="deleteAttr($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length < 1"
          @click="saveAttr"
          >保存</el-button
        >
        <el-button @click="isShowCard = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "loadsh/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收接口返回的数据
      attrList: [],
      //控制下面的el-card显示与隐藏
      isShowCard: true,
      //用于修改和添加使用的商品基础属性对象
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    async getAttrList() {
      //结构参数
      const { category1Id, category2Id, category3Id } = this;

      let result = await this.$API.attr.reqGetAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },

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
    //点击点击添加属性(这是添加attrValueList)按钮的回调
    addAttr() {
      this.isShowCard = false;
      //清空上次输入遗留
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3,
      };
      //收集到当前的category3Id,用于等等提交添加属性值时，供服务器使用
      this.attrInfo.categoryId = this.category3Id;
    },
    //点击添加属性(这是attrInfo内attrValueList的属性值的添加)按钮的回调
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: undefined,
        valueName: "",
        //添加的时候，增加一个属性，标识与切换查看模式和编辑模式
        flag: true,
      });
      //当点击添加属性值时，自动获取焦点到最新一个input节点上
      //最新一个节点即 this.attrInfo.attrValueList.length - 1
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //点击修改button按钮的回调
    updateAttr(row) {
      this.isShowCard = false;
      //显示需要修改的数据到页面上,这里因为row和this.attrInfo使用的是同一个对象数据，而对象内的数据结构过于复杂，浅拷贝不足以满足解决当前问题，需要引入loadash中的深拷贝
      this.attrInfo = cloneDeep(row);
      //切换显示编辑页的编辑模式和查看模式
      //向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
      //它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
      //需要遍历，确保每一个属性值都添加到flag新属性
      //this.$set(item,'flag',flase)   item==>目标对象，'flag'==>新属性名称，flase==>新属性默认值
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    //当处于添加商品属性下，blur时触发回调
    changeShowValue(row) {
      //对输入进行检验
      //1.非空
      if (row.valueName.trim() == "") {
        this.$message("请输入一个正常的属性值!");
        return;
      }
      //2.判断当前输入的新属性值是否与之前的重复，通过判断attrValueList中已有的值和新输入的值(row)，调用some方法，如果有，some返回true
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        //判断时，需要将row重数组中去除，否则永远都会和自己新输入的值判断，结果永远为true
        if (row !== item) {
          //进入判断，则只会遍历除row当前项外的每一项
          //如果row.valueName == item.valueName,则代表有重复，isRepat则为真
          return row.valueName == item.valueName;
        }
      });
      if (isRepat) {
        this.$message("输入属性值已存在");
        return;
      }
      row.flag = false;
    },
    //当由查看模式切换到编辑模式时，需要自动获取焦点到点击的那个input框上
    changeFocus(row, index) {
      row.flag = true;
      //获取焦点,$index就是当前点击的那个input框的标识,利用ref给input节点打标识
      //因为当由查看模式切换到编辑模式时,浏览器需要时间重绘节点，所以现在不能马上获取到打标识的refs，要利用$nextTick
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //点击删除按钮触发popconfirm组件，点击确认按钮时触发回调事件
    deleteAttr(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //点击保存按钮触发回调
    async saveAttr() {
      //收集并且过滤属性,不允许出现空值的情况
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //filter过滤后返回一个新的数组，需要接收，这里直接接收并且赋值回去原数组
          if (item.valueName != "") {
            //进入判断，代表属性名称正确,服务器不需要falg属性，需要删除
            delete item.flag;
            return true;
          }
        }
      );
      try {
        //过滤完成后，发送请求
        await this.$API.attr.reqAddOrUpdataAttrInfo(this.attrInfo);
        //弹出成功提示信息
        this.$message({ message: "保存成功!", type: "success" });
        //获取新的平台属性进行展示,并且需要把页面返回显示属性页
        this.getAttrList();
        this.isShowCard = true;
      } catch (error) {
        this.$message({ message: "保存失败!", type: "error" });
      }
    },
    //点击删除spu属性按钮(deleteAttrList)
    async deleteAttrList(row) {
      let result = await this.$API.attr.reqDeleteAttrList(row.id);
      if(result.code == 200){
        this.$message({type:'success',message:'删除成功!'});
        //重新发送请求获取attr列表
        this.getAttrList();
      }
    },
  },
};
</script>

<style>
</style>
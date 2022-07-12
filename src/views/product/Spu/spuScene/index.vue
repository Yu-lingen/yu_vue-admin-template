<template>
  <div>
    <!-- spuScene 外部form -->
    <el-form ref="form" label-width="80px" :model="spuData">
      <!-- spu名称 -->
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuData.spuName"></el-input>
      </el-form-item>
      <!-- 品牌 -->
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuData.tmId">
          <el-option
            v-for="tmList in baseTradeMarkList"
            :key="tmList.id"
            :label="tmList.tmName"
            :value="tmList.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- SPU描述 -->
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="SPU描述"
          v-model="spuData.description"
        ></el-input>
      </el-form-item>
      <!-- Spu图片 -->
      <el-form-item label="图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImgList"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <!-- 销售属性下拉选择框 -->
        <el-select
          style="margin-right: 20px"
          v-model="attrIdAndName"
          :placeholder="`还有${unselectSaleAttr.length}未选择`"
        >
          <el-option
            :label="attrValue.name"
            :value="`${attrValue.id}:${attrValue.name}`"
            v-for="attrValue in unselectSaleAttr"
            :key="attrValue.id"
          ></el-option>
        </el-select>
        <!-- 添加属性按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndName"
          @click="addAttrValue"
          >添加销售属性</el-button
        >
        <!-- 销售属性详情列表 -->
        <el-table style="width: 100%" border :data="spuData.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                :key="attrValue.id"
                v-for="(attrValue, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ attrValue.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="120">
            <template slot-scope="{ $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spuData.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 保存于取消按钮 -->
      <el-form-item>
        <el-button type="primary" @click="saveSpuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuScene",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //接收服务器返回的SPU属性,
      //这个spuData不仅在修改的时候要使用到，添加的时候也要，所以要初始化基本的属性
      spuData: {
        //3级id
        category3Id: 0,
        //spu描述
        description: "",
        //spuid
        id: 0,
        //spu名称
        spuName: "",
        //品牌id
        tmId: "",
        //spu图片
        spuImageList: [
          /*           {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          }, */
        ],
        // spu销售属性
        spuSaleAttrList: [
          /*           {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: "string",
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: "string",
                saleAttrName: "string",
                saleAttrValueName: "string",
                spuId: 0,
              },
            ],
          }, */
        ],
      },
      //接收服务器返回的平台基础属性列表
      baseSaleAttrList: [],
      //接收服务器返回的基础品牌信息
      baseTradeMarkList: [],
      //接收服务器返回的图片信息
      spuImgList: [],
      //控制element-ui的tag显示与隐藏
      inputVisible: false,
      //收集为选择的平台基础属性
      attrIdAndName: "",
    };
  },
  props: ["scene"],
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
      //收集照片数据，方便以后提交与服务器
      this.spuImgList = fileList;
    },
    handleSuccess(response, file, fileList) {
      //收集照片数据，方便以后提交与服务器
      this.spuImgList = fileList;
      console.log(fileList);
    },
    //照片墙预览功能回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //父组件回调
    async initSpuData(id) {
      //发请求，获取当前spu的基础属性
      let spuResult = await this.$API.spu.reqGetSpuAttr(id);
      if (spuResult.code == 200) {
        this.spuData = spuResult.data;
      }

      //发送请求，获取平台全部的基础销售属性
      let baseSaleAttrListresult = await this.$API.spu.reqGetBaseSaleAttrList();
      if (baseSaleAttrListresult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListresult.data;
      }

      //发送请求，获取基础的品牌信息
      let baseTradeMarkListResult =
        await this.$API.spu.reqGetBaseTradeMarkList();
      if (baseTradeMarkListResult.code == 200) {
        this.baseTradeMarkList = baseTradeMarkListResult.data;
      }

      //发送请求,获取spu图片数据
      let spuImgListReuslt = await this.$API.spu.reqGetSpuImgList(id);
      if (spuImgListReuslt.code == 200) {
        //上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}],因为element框架的file-list需要规定的格式所以在接收到服务器返回的数据后要进行修改
        let imgList = spuImgListReuslt.data;
        imgList.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImgList = imgList;
      }
    },
    //点击添加属性回调
    addAttrValue() {
      //结构服务器所需要的数据 saleAttrName baseSaleAttrId
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      const saleAttrObj = {
        saleAttrName: saleAttrName,
        baseSaleAttrId: baseSaleAttrId,
        spuSaleAttrValueList: [],
      };
      this.spuData.spuSaleAttrList.push(saleAttrObj);
      //清空原有的数据
      this.attrIdAndName = "";
    },
    //点击添加具体属性值的按钮回调
    showInput(row) {
      //显示input框
      this.$set(row, "inputVisible", true);
      //自动获取聚焦
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus();
      });
    },
    //具体属性值的blur和enter事件回调
    handleInputConfirm(row) {
      //显示input框
      row.inputVisible = false;
      //结构服务器需要的属性
      let { inputValue, baseSaleAttrId } = row;
      //创建对象，往slaeAttrList里面添加新增的属性
      const saleAttrObj = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      //对新增的属性值进行判断，不能为空和重复的
      //不能为空
      if (inputValue == undefined || inputValue.trim() == "") {
        this.$message("不能添加空属性值!");
        return;
      }
      //不能重复
      let result = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue;
      });
      if (result) {
        this.$message("不能添加重复的属性值!");
        return;
      }
      row.spuSaleAttrValueList.push(saleAttrObj);
      //清空残余数据
      row.inputValue = "";
    },
    //保存Spu按钮回调
    async saveSpuInfo() {
      //整理参数
      //需要的参数spu中都有，除了imgList需要整理
      //对保存imgList的数据进行map,整理出来然后保存到spu中的imgList中
      this.spuData.spuImageList = this.spuImgList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
          name: item.name,
          url: (item.response && item.response.data) || item.url,
        };
      });
      //整理完参数，发送请求
      let result = await this.$API.spu.reqAddSpuOrUpdateSpu(this.spuData);
      if (result.code == 200) {
        this.$message({ type: "success", message: "保存成功!" });
        //切换页面
        this.$emit("changeScene", 0);
      }
      //最后清空数据
      Object.assign(this._data, this.$options.data());
    },
    //点击Spu，父组件回调
    async addSpuData(categoryId) {
      this.spuData.category3Id = categoryId;
      //发送请求，获取平台全部的基础销售属性
      let baseSaleAttrListresult = await this.$API.spu.reqGetBaseSaleAttrList();
      if (baseSaleAttrListresult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrListresult.data;
      }

      //发送请求，获取基础的品牌信息
      let baseTradeMarkListResult =
        await this.$API.spu.reqGetBaseTradeMarkList();
      if (baseTradeMarkListResult.code == 200) {
        this.baseTradeMarkList = baseTradeMarkListResult.data;
      }
    },
    //点击取消保存spu按钮的回调
    cancel() {
      this.$emit("changeScene", 0);
      //最后清空数据
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //整个平台销售属性一共3个，颜色，版本，尺码这里通过计算属性计算出当前商品已拥有的销售属性，
    unselectSaleAttr() {
      return this.baseSaleAttrList.filter((baseItem) => {
        //这里过滤出来当前商品已经有的属性
        //filter的回调函数如果返回true，则保留改元素,每一个item代表颜色，版本,尺码三个销售属性
        //再通过every遍历当前商品的已有属性，通过对比这两者，过滤出当前商品没有的属性
        return this.spuData.spuSaleAttrList.every((item) => {
          //every方法为当前数组中的每个元素执行一次回调函数，如果执行的回调函数结果为false,则发回false,否则返回true,继续执行
          //item代表当前商品已经具有的属性
          //通过对比baseSaleAttrList的name属性是否与当前spuSaleAttrList的saleAttrName属性相同
          //例如：第一次循环，baseItem==>颜色，item==>尺码 baseItem!=item，every则返回true,那么filter则会保留当前的元素，反之则返回false,filter则会删除改元素
          return baseItem.name != item.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
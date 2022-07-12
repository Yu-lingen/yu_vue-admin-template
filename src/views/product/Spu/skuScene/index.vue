<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="spu名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="规格描述"
          v-model="skuInfo.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :value="`${attr.id}:${attrValue.id}`"
                :label="attrValue.valueName"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttrList.saleAttrName"
            v-for="saleAttrList in spuSaleAttrList"
            :key="saleAttrList.id"
          >
            <el-select
              placeholder="请选择"
              v-model="saleAttrList.saleIdAndSaleValueId"
            >
              <el-option
                :value="`${saleAttrList.id}:${saleAttrValue.id}`"
                :label="saleAttrValue.saleAttrValueName"
                v-for="saleAttrValue in saleAttrList.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          :data="spuImgList"
          border
          @selection-change="handleSelectionChange"
          >>
          <el-table-column
            prop="prop"
            label="label"
            width="80"
            type="selection"
          >
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                style="width: 100px; height: 100px"
                :src="row.imgUrl"
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <div>
                <el-button
                  type="primary"
                  v-if="row.isDefault == 0"
                  @click="changeDefault(row, spuImgList)"
                  >设置默认</el-button
                >
                <el-button v-else>默认</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="changeScene">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "skuScene",
  data() {
    return {
      //存储服务器返回的图片列表数据
      spuImgList: [],
      //存储服务器返回的销售属性数据
      spuSaleAttrList: [],
      //存储服务器返回的平台属性数据
      attrInfoList: [],
      skuInfo: {
        //第一类数据，通过父组件可以获取到
        spuId: 0,
        tmId: 0,
        category3Id: 0,
        //第二类数据，通过v-model收集
        price: 0,
        weight: "",
        skuDesc: "",
        skuName: "",
        //第三类,通过自己写代码收集
        //默认图片
        skuDefaultImg: "",

        //平台属性数据
        skuAttrValueList: [
          {
            attrId: 0,
            valueId: 0,
          },
        ],

        //销售属性列表数据
        skuSaleAttrValueList: [
          {
            saleAttrId: 0,
            saleAttrValueId: 0,
          },
        ],

        //图片列表
        skuImageList: [
          {
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            spuImgId: 0,
          },
        ],
      },
      //收集父组件传来的数据
      spu: {},
      //收集图片信息，用于发送请求时携带给服务器(整理前)
      skuImg: {},
    };
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      //父组件通知给当前子组件的获取数据的方法
      //存储相关数据
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.skuInfo.category3Id = spu.category3Id;

      this.spu = spu;
      //发送请求，获取相关数据

      //获取图片数据
      let imgResult = await this.$API.spu.reqGetImgList(spu.id);
      if (imgResult.code == 200) {
        //因为服务器返回的数据中缺少一个isDefault属性,所以在服务器返回数据时，为其添加上该属性
        let list = imgResult.data;
        list.forEach((item) => {
          //isDefault属性，0==>设置默认，1==>默认
          item.isDefault = 0;
        });
        this.spuImgList = list;
      }

      //获取销售属性
      let saleAttrResult = await this.$API.spu.reqGetSaleAttrList(spu.id);
      if (saleAttrResult.code == 200) {
        this.spuSaleAttrList = saleAttrResult.data;
      }

      //获取平台属性
      let attrInfoResult = await this.$API.spu.reqGetAttrInfo(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrInfoResult.code == 200) {
        this.attrInfoList = attrInfoResult.data;
      }
    },
    //点击图片前单选框的回调
    handleSelectionChange(params) {
      //获取选中了的图片数据
      this.skuImg = params;
    },
    //点击操作按钮的回调
    changeDefault(row, spuImgList) {
      //排他,先全部都设置为设置默认状态，然后把点击的那个设置为默认状态
      spuImgList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //点击取消按钮回调
    changeScene() {
      this.$emit("changeScenes", 0);
    },
    //点击保存按钮回调
    async saveSkuInfo() {
      //整理参数
      //接口所需参数为skuInfo,其中分三类参数,第一类通过父组件已经获取成功，第二类通过v-model也已经获取成功，第三类需要整理

      //解构参数
      const { attrInfoList, skuInfo, spuSaleAttrList, skuImg } = this;

      //平台属性数据  skuAttrValueList
      skuInfo.skuAttrValueList = attrInfoList.reduce((prv, item) => {
        //遍历每个平台属性，如果携带了attrIdAndValueId属性,则为已经选择了具体属性，需要整理到skuInfo中的skuAttrValueList,提交给服务器
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prv.push({ attrId, valueId });
        }
        return prv;
      }, []);

      //销售属性列表数据  skuSaleAttrValueList  方法同上
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prv, item) => {
        if (item.saleIdAndSaleValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.saleIdAndSaleValueId.split(":");
          prv.push({ saleAttrId, saleAttrValueId });
        }
        return prv;
      }, []);

      //图片列表
      //收集到的图片数据存储于skuImg中，
      skuInfo.skuImageList = skuImg.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });

      //最后发送请求
      let result = await this.$API.spu.reqSaveSkuInfo(this.skuInfo);
      if(result.code==200){
        this.$message({type:'success',message:'保存成功!'});
        //跳转页面
        this.$emit("changeScenes", 0);
      };

    },
  },
};
</script>

<style>
</style>
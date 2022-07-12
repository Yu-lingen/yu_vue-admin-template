//引入axios
import request from '@/utils/request';

//获取Spu列表接口
// GET /admin/product/{page}/{limit}  接口需要三个参数 page(当前页),limit(每一页显示多少条数据),category3Id,category3Id按照接口需要以params参数形式传递过去
export const reqGetSpuList = (page,limit,category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });

//spu这里一共需要发送4个接口，分别为1.获取当前spu信息，2.获取平台全部销售属性，3.获取spu品牌信息，4.获取SPU图片

//获取当前spu信息
// GET /admin/product/getSpuById/{spuId}
export const reqGetSpuAttr = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'});

//获取平台全部的基础销售属性
//GET /admin/product/baseSaleAttrList
export const reqGetBaseSaleAttrList = ()=>request({url:`/admin/product/baseSaleAttrList`,method:'get'});

//获取spu品牌信息
//GET /admin/product/baseTrademark/getTrademarkList
export const reqGetBaseTradeMarkList = ()=>request({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get'});

//获取SPU图片
//GET /admin/product/spuImageList/{spuId}
export const reqGetSpuImgList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});

//修改或者添加SPU属性
// POST /admin/product/updateSpuInfo   POST /admin/product/saveSpuInfo
export const reqAddSpuOrUpdateSpu = (spuInfo)=>{
    if(spuInfo.id){
        //如果传入的参数中携带ID,则是修改Spu
        return request({url:`/admin/product/updateSpuInfo`,method:'post',data:spuInfo});
    }else{
        //否则就是添加Spu
        return request({url:`/admin/product/saveSpuInfo`,method:'post',data:spuInfo});
    }
}

//删除spu
//DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'});


//spu下关于sku的请求
//获取图片列表接口
//GET /admin/product/spuImageList/{spuId}
export const reqGetImgList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:`get`});

//获取spu销售属性列表
//GET /admin/product/spuSaleAttrList/{spuId}
export const reqGetSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});

//获取平台属性
//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrInfo = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

//保存sku属性
//POST /admin/product/saveSkuInfo
export const reqSaveSkuInfo = (skuInfo)=>request({url:`/admin/product/saveSkuInfo`,method:`post`,data:skuInfo});

//根据spuid获取点击的那个spu的详细sku属性列表
//GET /admin/product/findBySpuId/{spuId}
export const reqFindBySpuId = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:`get`});

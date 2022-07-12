//引入axios
import request from '@/utils/request';

//获取sku列表的接口
//GET /admin/product/list/{page}/{limit}
export const reqGetSkuList = (page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:`get`});

//商品上架接口
//GET /admin/product/onSale/{skuId}
export const reqSale = (skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:`get`});

//商品下架接口
//GET /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:`get`});

//获取skuById右侧抽屉效果内的数据
//GET /admin/product/getSkuById/{skuId}
export const reqGetSkuById = (skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:`get`});
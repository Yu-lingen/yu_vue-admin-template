//平台属性管理模块请求文件

//引入axios
import request from '@/utils/request';

//对外暴露一个获取一级分类菜单的请求接口
// GET /admin/product/getCategory1
export const reqCategory1Id = () => request({ url: `/admin/product/getCategory1`, method: 'get' });

//对外暴露一个获取二级分类菜单的请求接口
//GET /admin/product/getCategory2/{category1Id}
export const reqCategory2Id = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' });

//对外暴露一个获取三级分类菜单的请求接口
//GET /admin/product/getCategory3/{category2Id}
export const reqCategory3Id = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })

//对外暴露一个获取商品基础属性的请求接口
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqGetAttrList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:`get`})

//对外暴露一个添加或者修改商品基础属性的接口
//携带的数据格式解析
/* {
    "attrName": "string", 商品属性名称
    "attrValueList": [ 因为添加的属性可能不止一条，所以使用数组
      {
        "attrId": 0,
        "valueName": "string"
      }
    ],
    "categoryId": 0, category3Id
    "categoryLevel": 0, 三级ID
  } */
//POST /admin/product/saveAttrInfo
export const reqAddOrUpdataAttrInfo = (data)=>request({url:`/admin/product/saveAttrInfo`,method:'post',data});

//删除平台属性
//DELETE /admin/product/deleteAttr/{attrId}
export const reqDeleteAttrList = (attrId)=>request({url:`/admin/product/deleteAttr/${attrId}`,method:`delete`});
//获取分页列表接口

//引入axios
import request from '@/utils/request'

//对外暴露一个请求接口函数
///admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `admin/product/baseTrademark/${page}/${limit}`, method: 'get' });

//对外暴露一个接口，处理添加商品或者修改商品，通过携带的参数是否带id来判断是修改还是添加，如果带id则是修改商品
// /admin/product/baseTrademark/save
// /admin/product/baseTrademark/update
export const reqAddTradeMarkOrUpdataTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        //携带id,则是修改
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        //不携带id，则是添加
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}

//对外暴露一个删除商品的接口
// /admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id)=> request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete',data:id})
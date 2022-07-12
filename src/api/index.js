//统一管理product接口
import * as tradeMark from '@/api/product/tradeMark';
import * as attr from '@/api/product/attr';
import * as sku from '@/api/product/sku';
import * as spu from '@/api/product/spu';

import * as user from '@/api/acl/user';
import role from '@/api/acl/role';
import permission from '@/api/acl/permission';

//统一暴露
export default {
    tradeMark,
    attr,
    sku,
    spu,
    user,
    role,
    permission
}

/**
* @Description: 基本图元-顶点
* @Author: wanggang
* @Date: 2022-03-28 23:04:07
* */
import {
    Points, Vector3, BufferGeometry, PointsMaterial,
} from 'three';

export type CPointAttrs = {
    vertex?:Vector3 | Array<number>// 顶点
    vertexs?:Array<Vector3> | Array<Array<number>> | Array<number>// 多个顶点
    color?:number// 颜色
    size?:number// 大小
    index?:number// 标记
    uuid?:string// uuid
    transparent?:boolean// 是否透明
    url?:string// url 材质链接
    depthTest?:boolean// 开启深度测试
    state?:string// 状态 默认状态/选中/高亮状态
    type?:string// 类型
}
export class CPoint extends Points {
    geometry:BufferGeometry

    material:PointsMaterial

    name:string

    userData:{[k:string]:any} // TODO 索引签名了解一下??

    constructor(attrs?:CPointAttrs) {
        super();
        this.name = 'cpoint';
        this.initialize(attrs);
    }

    /* 初始化 */
    initialize(attrs:CPointAttrs) {
        this.initData(attrs);
        this.initUI(attrs);
    }

    /* 数据初始化 */
    initData(attrs:CPointAttrs) {
        this.setId(attrs?.uuid || this.uuid);
    }

    /* UI初始化 */
    initUI(attrs:CPointAttrs) {
        console.log('UI初始化');
    }

    /* 设置uuid */
    setId(uuid:string) {
        this.userData.uuid = uuid;
        return this;
    }

    /* 获取uuid */
    getId() {
        return this.userData.uuid;
    }

    /* 设置下标 */
    setIndex(index:number) {
        this.userData.index = index;
        return this;
    }

    /* 获取下标 */
    getIndex(index:number) {
        return this.userData.index;
    }
}

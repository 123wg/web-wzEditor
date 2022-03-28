import { Vector3 } from 'three';
import { LineSegmentsGeometry } from '../libs/lines/LineSegmentsGeometry.d';
import { Line2 } from '../libs/lines/Line2.d';
import { LineMaterial } from '../libs/lines/LineMaterial';
/**
* @Description: 基本图元 直线
* @Author: wanggang
* @Date: 2022-03-28 22:39:00
* */
// TODO windows底层渲染d3d -- 了解一下
export type CLineAttrs = {
    vertexs?:Array<Vector3> | Array<Array<number>> | Array<number> // 顶点
    dashed?:boolean // 虚线
    color?:number // 颜色
    lineWidth?:number // 线宽
    transparent?:boolean// 开启透明
    opacity?:number// 透明度
    uuid?:string// uuid
    dashSize?:number// 虚线长度
    gapSize?:number// 虚线间隔
    state?:'default' | 'selected' | 'hightlight' // 当前状态 默认状态/选中状态/高亮状态
    multistage?:boolean // 是否为多段的线段 2个顶点为一段(顶点数量是否大于2)
    renderOrder?:number // z-index
    name?:string// 类型区分
    createPoints?:boolean// 是否自动创建顶点
}
export class CLineSegments extends Line2 {
    geometry:LineSegmentsGeometry;

    material:LineMaterial;

    name:string;

    userData: { [key: string]: any; };

    // constructor(attrs:CLineAttrs) {
    // }
}

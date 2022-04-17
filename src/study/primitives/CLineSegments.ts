import { Object3D, Vector3 } from 'three';
import { CPoint } from './CPoint';
import { Line2 } from '../libs/lines/Line2';
import { LineMaterial } from '../libs/lines/LineMaterial';
import { LineSegmentsGeometry } from '../libs/lines/LineSegmentsGeometry';
import {
    COLOR_BASIC_GEOMETRY, COLOR_HELPER_GEOMETRY, COLOR_MOVE_GEOMETRY, LINE_DASH_SIZE, LINE_GAP_SIZE,
} from '../constant/primitives';
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
    data?:any
    type?:string
}
export class CLineSegments extends Line2 {
    geometry:LineSegmentsGeometry;

    material:LineMaterial;

    name:string;

    userData: { [key: string]: any; };

    constructor(attrs:CLineAttrs) {
        super(new LineSegmentsGeometry());
        this.name = attrs?.name || 'lineSegments';
        // 初始化
        this.initialize(attrs);
    }

    initialize(attrs?:CLineAttrs) {
        this.initData(attrs);
        this.initUI(attrs);
        this.hidePoints();
    }

    /* 初始化数据 往userData里面塞 */
    initData(attrs?:CLineAttrs) {
        this.userData = {
            points: [],
            uuid: '',
        };
        this.setId(attrs?.uuid || this.uuid);
        this.setMultistage(attrs?.multistage || false);
        this.setCreatePoints(attrs?.createPoints || true);
        if (attrs?.data) this.userData.data = attrs.data;
        if (attrs?.type) this.userData.type = attrs.type;
    }

    /* 初始化三维部分 */
    initUI(attrs?:CLineAttrs) {
        if (!this.getMultiStage() && this.getCreatePoints()) this.initPoints();// 顶点大于2的线段不绘制顶点
        if (attrs && attrs.vertexs !== undefined) this.setVertexs(attrs.vertexs);
        if (attrs && attrs.dashed !== undefined) this.setDashed(attrs.dashed);
        if (attrs && attrs.lineWidth !== undefined) this.setLineWidth(attrs.lineWidth);
        if (attrs && attrs.opacity !== undefined) this.setOpacity(attrs.opacity);
        if (attrs && attrs.transparent !== undefined) this.setTransparent(attrs.transparent);
        if (attrs && attrs.renderOrder !== undefined) this.setRenderOrder(attrs.renderOrder);

        // 设置颜色、状态
        this.setColor((attrs && attrs.color !== undefined) ? attrs.color : COLOR_BASIC_GEOMETRY);
        this.setState((attrs && attrs.state !== undefined) ? attrs.state : 'default');
        // dashed
        this.setDashSize((attrs && attrs.dashSize !== undefined) ? attrs.dashSize : LINE_DASH_SIZE);
        this.setGapSize((attrs && attrs.gapSize !== undefined) ? attrs.gapSize : LINE_GAP_SIZE);
    }

    /* 初始化 起点/终点/中点 index:0/1/2 */
    initPoints() {
        const start = new CPoint({ index: 0 });
        const end = new CPoint({ index: 1 });
        const mid = new CPoint({ index: 2 });
        this.userData.points.push(start.getId(), end.getId(), mid.getId());
        this.add(start, end, mid);
    }

    /* 设置顶点 */
    setVertexs(vertexs:Array<Vector3> | Array<Array<number>> | Array<number>) {
        let points:Array<number> = [];
        if (!vertexs || vertexs.length === 0) {
            throw new Error('vertexs is not defined or vertexs array is empty');
        }
        if ((vertexs[0] as any).isVector3) {
            vertexs.forEach((v:any) => {
                points.push(v.x, v.y, v.z);
            });
        } else if (vertexs[0] instanceof Array) {
            vertexs.forEach((v:any) => {
                points.push(v[0], v[1], v[2]);
            });
        } else {
            points = vertexs.slice() as Array<number>;
        }

        this.geometry.setPositions(points);
        this.computeLineDistances();

        // 更新控制点 这里考虑的是只有两个点的情况
        if (!this.getMultiStage()) {
            if (this.getPointByIndex(0)) (this.getPointByIndex(0) as CPoint).setVertex([points[0], points[1], points[2]]);
            if (this.getPointByIndex(1)) (this.getPointByIndex(1) as CPoint).setVertex([points[3], points[4], points[5]]);
            if (this.getPointByIndex(2)) (this.getPointByIndex(2) as CPoint).setVertex([(points[3] + points[0]) / 2, (points[4] + points[1]) / 2, (points[5] + points[2]) / 2]);
        }
    }

    /* 获取控制点 */
    getPoints() {
        const points:Array<Object3D> = [];
        this.children.forEach((m:Object3D) => {
            if (m.name === 'cpoint' && this.userData.points.indexOf((m as CPoint).getIndex() !== -1)) {
                points.push(m);
            }
        });
        return points;
    }

    /* 隐藏控制点 */
    hidePoints() {
        this.getPoints().forEach((p:CPoint) => {
            p.visible = false;
        });
        return this;
    }

    /* 显示控制点 */
    showPoints() {
        this.getPoints().forEach((p:CPoint) => {
            p.visible = true;
        });
        return this;
    }

    /* 材质：虚线 */
    setDashed(dashed:boolean) {
        this.material.dashed = dashed;
        if (dashed) {
            this.material.defines.USE_DASH = '';
        } else {
            delete this.material.defines.USE_DASH;
        }
        this.material.needsUpdate = true;
        return this;
    }

    /* 颜色 */
    setColor(color?:number) {
        this.userData.color = color;
        this.material.color.set(color);
        return this;
    }

    /* 获取颜色 */
    getColor() {
        return this.userData.color;
    }

    /* 设置状态 */
    setState(state?:string, color?:number) {
        if (!state) return;
        this.userData.state = state;
        if (state === 'default') {
            this.material.color.set(color || this.getColor());
        } else if (state === 'selected') {
            this.material.color.set(color || COLOR_HELPER_GEOMETRY);
        } else if (state === 'highlight') {
            this.material.color.set(color || COLOR_MOVE_GEOMETRY);
        }
        return this;
    }

    /* 材质:虚线长度 */
    setDashSize(size:number) {
        this.userData.dashSize = size;
        this.material.dashSize = size;
    }

    /* 材质:虚线间隔 */
    setGapSize(size:number) {
        this.userData.gapSize = size;
        this.material.gapSize = size;
    }

    /* 设置线宽 */
    setLineWidth(lineWidth:number) {
        this.material.linewidth = lineWidth;
        // this.material.resolution.set(window.innerWidth, window.innerHeight);
        return this;
    }

    /* 透明度 */
    setOpacity(opacity:number) {
        this.material.opacity = opacity;
        return this;
    }

    /* 开启透明 */
    setTransparent(transparent) {
        this.material.transparent = transparent;
        return this;
    }

    /* 渲染层级 */
    setRenderOrder(renderOrder:number) {
        this.renderOrder = renderOrder;
        return this;
    }

    /* 设置id */
    setId(uuid:string) {
        this.userData.uuid = uuid;
        return this;
    }

    /* 根据索引查找控制点 */
    getPointByIndex(index:number | Array<number>) {
        if (!isNaN(index as any)) {
            let p:CPoint;
            this.children.forEach((m:Object3D) => {
                if (m.name === 'cpoint' && (m as CPoint).getIndex() === index) {
                    p = m as CPoint;
                }
            });
            return p;
        } if (index instanceof Array) {
            const points:Array<CPoint> = [];
            index.forEach((i:number) => {
                this.children.forEach((m:Object3D) => {
                    if (m.name === 'cpoint' && (m as CPoint).getIndex() === i) {
                        points.push(m as CPoint);
                    }
                });
            });
            return points;
        }
    }

    /* 是否是连续线段 */
    setMultistage(multistage:boolean) {
        this.userData.multistage = multistage;
        return this;
    }

    /* 获取是否自动生成连续线段 */
    getMultiStage() {
        return this.userData.multistage;
    }

    /* 设置是否自动生成顶点 */
    setCreatePoints(createPoints:boolean) {
        this.userData.createPoints = createPoints;
        return this;
    }

    /* 获取是否自动生成顶点 */
    getCreatePoints() {
        return this.userData.createPoints;
    }
}

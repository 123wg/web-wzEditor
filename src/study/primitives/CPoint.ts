import {
    BufferGeometry, Float32BufferAttribute, Intersection, Points, PointsMaterial, Raycaster, RepeatWrapping, TextureLoader, Vector2, Vector3,
} from 'three';
import {
    POINT_BASIC_GEOMETRY, POINT_CLICK_GEOMETRY, POINT_DRAW_GEOMETRY, POINT_HOVER_GEOMETRY,
} from '../constant/primitives';
// import {
//     POINT_BASIC_GEOMETRY, POINT_CLICK_GEOMETRY, POINT_DRAW_GEOMETRY, POINT_HOVER_GEOMETRY,
// } from '../config';

export const ADSORPTION_RADIUS = 10; // 点吸附半径

export type CPointAttrs = {
    vertex?: Vector3 | Array<number>
    vertexs?: Array<Vector3> | Array<Array<number>> | Array<number>
    color?: number
    size?: number
    index?: number
    uuid?: string
    transparent?: boolean
    url?: string
    depthTest?: boolean
    state?: 'default' | 'selected' | 'highlight' // 状态：分别代表元素的 默认状态/选中状态/高亮状态
    constraint?: any // 约束缓存
    marks?: any // 标注缓存
    id?: number;
    type?: string;
    sketchId?: string;
}

export class CPoint extends Points {
    geometry: BufferGeometry

    material: PointsMaterial

    name: string

    userData: { [k: string]: any }

    constructor(attrs?: CPointAttrs) {
        super();

        this.name = 'cpoint';

        this.initialize(attrs);
    }

    getType() {
        return 'Point';
    }

    initData(attrs?: CPointAttrs) {
        // 约束/标注/uuid/索引缓存
        this.userData = {
            constraint: {
                links: [],
                dof: {
                    x: true,
                    y: true,
                    r_z: true,
                },
            },
            marks: [],
            uuid: '',
            index: -1,
        };
        this.setId((attrs && attrs.uuid) || this.uuid);
        if (attrs && attrs.constraint !== undefined) this.userData.constraint = attrs.constraint; // constraint data cache
        if (attrs && attrs.marks !== undefined) this.userData.marks = attrs.marks; // marks data cache

        // if (process.env.VUE_APP_SCSS_SWITCH === 'true') {
        if (attrs?.id) this.userData.id = attrs.id;
        if (attrs?.type) this.userData.type = attrs.type;
        //     if (attrs?.sketchId) this.userData.sketchId = attrs.sketchId;
        // }
    }

    initUI(attrs?: CPointAttrs) {
        // state 元素状态
        this.setState(attrs && attrs.state !== undefined ? attrs.state : 'default');

        (attrs && attrs.size !== undefined) ? this.setSize(attrs.size) : this.setSize(8); // 默认大小 9

        // 默认坐标原点
        if (attrs) {
            if (attrs.vertexs !== undefined) {
                this.setVertexs(attrs.vertexs);
            } else if (attrs.vertex !== undefined) {
                this.setVertex(attrs.vertex);
            } else {
                this.setVertexs([0, 0, 0]);
            }
        } else {
            this.setVertexs([0, 0, 0]);
        }
        // (attrs && attrs.vertex !== undefined) ? this.setVertex(attrs.vertex) : this.setVertex([0, 0, 0]);
        (attrs && attrs.transparent !== undefined) ? this.setTransparent(attrs.transparent) : this.setTransparent(true); // 透明

        if (attrs && attrs.url !== undefined) this.loadTexture(attrs.url); // 默认纹理
        if (attrs && attrs.color !== undefined) this.setColor(attrs.color); // 颜色
        if (attrs && !isNaN(attrs.index)) this.setIndex(attrs.index); // 设置点位相关信息
        // - 所有情况下点都是 depthtest 为false
        this.setDepthTest(false);
    }

    initialize(attrs?: CPointAttrs) {
        this.initData(attrs);
        this.initUI(attrs);
    }

    // @override 重写 点射线拾取
    raycast(raycaster: Raycaster, intersects: Intersection[]) {
        const v1 = (raycaster as any).mouse as Vector2;
        const position = new Vector3(this.geometry.attributes.position.array[0], this.geometry.attributes.position.array[1], this.geometry.attributes.position.array[2]);
        const current = position.clone().project((window as any).view.camera);
        const v2 = new Vector2((0.5 + current.x / 2) * window.innerWidth, (0.5 - current.y / 2) * window.innerHeight);

        if (v1.distanceToSquared(v2) <= ADSORPTION_RADIUS * ADSORPTION_RADIUS) {
            intersects.push({
                distance: current.clone().distanceTo((window as any).view.camera.position),
                object: this,
                point: position,
            } as any);
        }
    }

    loadTexture(url: string) {
        const t = new TextureLoader().load(url);
        t.wrapS = t.wrapT = RepeatWrapping;
        this.material.map = t;
        return this;
    }

    // - 绘制状态的样式
    setDrawTexture() {
        return this.loadTexture(POINT_DRAW_GEOMETRY);
    }

    // - 基本状态的样式
    setBasicTexture() {
        return this.loadTexture(POINT_BASIC_GEOMETRY);
    }

    // - 高亮状态的样式 move
    setHoverTexture() {
        return this.loadTexture(POINT_HOVER_GEOMETRY);
    }

    // - 选中高亮 click
    setClickTexture() {
        return this.loadTexture(POINT_CLICK_GEOMETRY);
    }

    //
    setDepthTest(depthTest: boolean) {
        this.material.depthTest = depthTest;
        return this;
    }

    setTransparent(transparent: boolean) {
        this.material.transparent = transparent;
        return this;
    }

    // 顶点位置： 多段数据
    setVertexs(vertexs: Array<Vector3> | Array<Array<number>> | Array<number>) {
        let positions: Array<number> = [];
        if (!vertexs || vertexs.length === 0) {
            throw new Error('vertexs is not defined or vertexs array is empty.');
        }

        if ((vertexs[0] as any).isVector3) {
            vertexs.forEach((v: any) => {
                positions.push(v.x, v.y, v.z);
            });
        } else if (vertexs[0] instanceof Array) {
            vertexs.forEach((v: any) => {
                positions.push(v[0], v[1], v[2]);
            });
        } else {
            positions = vertexs.slice() as Array<number>;
        }

        if (!this.geometry.attributes.position || (this.geometry.attributes.position as any).array.length < positions.length) {
            this.geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
        } else {
            (this.geometry.attributes.position as any).array.set(positions);
            (this.geometry.attributes.position as any).needsUpdate = true;
        }

        // 位置改变，需要重新计算包围球属性
        this.geometry.computeBoundingSphere();

        return this;
    }

    getVertexs() {
        const vertexs = [];
        if (!this.geometry.attributes.position) return [];
        const bufferData = this.geometry.attributes.position.array;

        for (let i = 0; i < bufferData.length; i += 3) {
            vertexs.push(new Vector3(bufferData[i], bufferData[i + 1], bufferData[i + 2]));
        }
        return vertexs;
    }

    // 顶点位置： 单个数据
    setVertex(vertex: Vector3 | Array<number>) {
        let vertices = [];

        if (!vertex || vertex.length === 0) {
            throw new Error('vertex is not defined or vertex array is empty.');
        }

        if ((vertex as any).isVector3) {
            vertices.push((vertex as any).x, (vertex as any).y, (vertex as any).z);
        } else if (vertex instanceof Array) {
            vertices = vertex.slice();
        }

        if (!this.geometry.attributes.position) {
            this.geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        } else {
            (this.geometry.attributes.position as any).array.set(vertices);
            (this.geometry.attributes.position as any).needsUpdate = true;
        }
        // 位置改变，需要重新计算包围球属性
        this.geometry.computeBoundingSphere();

        return this;
    }

    getVertex() {
        const bufferData = this.geometry.attributes.position.array;
        return new Vector3(bufferData[0], bufferData[1], bufferData[2]);
    }

    // 点大小
    setSize(size: number) {
        this.material.size = size;
        return this;
    }

    getSize() {
        return this.material.size;
    }

    // 颜色
    setColor(color: number) {
        this.material.color.set(color);
        return this;
    }

    getColor() {
        return this.material.color;
    }

    // 设置元素状态
    setState(state?: string) {
        if (!state) return;
        // data cache
        this.userData.state = state;
        // 'default' | 'selected' | 'highlight'
        if (state === 'default') {
            this.setBasicTexture();
        } else if (state === 'selected') {
            this.setClickTexture();
        } else if (state === 'highlight') {
            this.setHoverTexture();
        }
        return this;
    }

    getState() {
        return this.userData.state;
    }

    // 获取第一次绘制时的uuid
    getId() {
        return this.userData.uuid;
    }

    // 设置uuid
    setId(uuid: string) {
        this.userData.uuid = uuid;
        return this;
    }

    // 获取当前点位信息相关: index = -1为独立点位 , index != -1代表在线上
    getIndex() {
        return this.userData.index;
    }

    setIndex(index: number) {
        this.userData.index = index;
        return this;
    }
}

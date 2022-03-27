/**
* @Description: 实现一遍dragcontrol
* @Author: wanggang
* @Date: 2022-03-23 19:04:42
* */
// import * as THREE from 'three';
import {
    EventDispatcher, Matrix4, Plane, Raycaster, Vector3,
} from 'three';
import * as THREE from 'three';

export default class DragControlNew extends EventDispatcher {
    private dragObjects:THREE.Object3D[]; // 可以拖拽的物体

    private camera:THREE.Camera; // 相机

    private dom:HTMLElement; // dom元素

    private mouse:{ // 当前指针标准坐标系
        x:number,
        y:number
    }

    private plane:THREE.Plane; // 辅助平面 将拖拽看成二维的移动

    private selected:THREE.Object3D | null // 当前选中的物体

    private selectPoint:THREE.Vector3// 选中物体时候的坐标

    private centerPoint:THREE.Vector3 // 选中物体世界坐标

    private offset:THREE.Vector3 // 物体中心和开始拖拽时候的偏移量

    private inverseMatrix:THREE.Matrix4 // 父逆矩阵

    constructor(objects:THREE.Object3D[], camera:THREE.Camera, dom:HTMLElement) {
        super();
        this.dragObjects = objects;
        this.camera = camera;
        this.dom = dom;
        this.plane = new Plane();
        this.selected = null;
        this.selectPoint = new Vector3();
        this.centerPoint = new Vector3();
        this.offset = new Vector3();
        this.inverseMatrix = new Matrix4();

        this.initEvent();
    }

    /* 事件绑定 */
    private initEvent():void {
        this.dom.addEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.dom.addEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.dom.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    }

    /* 事件移除 */
    private removeEvent() :void {
        this.dom.removeEventListener('mousemove', this.handleMouseMove.bind(this), false);
        this.dom.removeEventListener('mousedown', this.handleMouseDown.bind(this), false);
        this.dom.addEventListener('mouseup', this.handleMouseUp.bind(this), false);
    }

    /* 鼠标移动事件 */
    private handleMouseMove(evt:MouseEvent):void {
        // evt.preventDefault();
        const rect = this.dom.getBoundingClientRect();
        const x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
        const y = 1 - ((evt.clientY - rect.top) / rect.height) * 2;
        this.mouse = { x, y };

        const raycaster = new Raycaster();
        raycaster.setFromCamera(this.mouse, this.camera);

        // 鼠标移动的时候 选中过物体的 处理拖动
        // 未选中物体的 更新平面
        if (this.selected) {
            // 计算当前物体中心应该在的位置 当前鼠标和平面的交点 - offset 为中心点在的位置 在使用父亲的变换矩阵的逆矩阵
            // 计算当前射线和平面的交点
            if (raycaster.ray.intersectPlane(this.plane, this.selectPoint)) {
                this.selected.position.copy(this.selectPoint.sub(this.offset).applyMatrix4(this.inverseMatrix));
                return;
            }
        }

        const intersections:THREE.Intersection[] = raycaster.intersectObjects(this.dragObjects, false);
        if (intersections.length > 0) {
            const intersection = intersections[0];
            const object = intersection.object;
            // 根据当前相机朝向为法向 改变辅助平面
            this.plane.setFromNormalAndCoplanarPoint(this.camera.getWorldDirection(this.plane.normal), this.centerPoint.setFromMatrixPosition(object.matrixWorld));
        }
    }

    /* 鼠标按下事件 */
    private handleMouseDown(evt:MouseEvent) {
        // evt.preventDefault();
        // 鼠标点击的时候 判断有没有选中物体 记录选中的物体 设置为选中状态
        const rect = this.dom.getBoundingClientRect();
        const x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
        const y = 1 - ((evt.clientY - rect.top) / rect.height) * 2;
        this.mouse = { x, y };
        const raycaster = new Raycaster();
        raycaster.setFromCamera(this.mouse, this.camera);
        const intersections = raycaster.intersectObjects(this.dragObjects, false);

        if (intersections.length > 0) {
            console.log('选中物体');
            this.selected = intersections[0].object;
            this.inverseMatrix.getInverse(this.selected.parent.matrixWorld);
            // 射线和平面的交点
            if (raycaster.ray.intersectPlane(this.plane, this.selectPoint)) {
                this.offset.copy(this.selectPoint).sub(this.centerPoint.setFromMatrixPosition(this.selected.matrixWorld));
            }
        }
    }

    /* 鼠标抬起事件 */
    private handleMouseUp() {
        if (this.selected) {
            this.selected = null;
        }
    }

    /* 鼠标抬起事件 */
}

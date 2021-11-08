/**
* @Description: 绘制管理器 --用于与物料区交互
* @Author: wg
* @Date: 2021-11-05 15:22:48
* */

import * as THREE from 'three';
import Ground from './Ground';

class DrawManager {
    constructor(app, parent) {
        this.app = app;
        this.parent = parent;
        this.scene = parent.scene;
        this.dom = parent.dom;
        this.camera = parent.camera;
        this.renderer = parent.renderer;
        // 当前是否正在绘制
        this.is_creating = false;
        // 当前正在绘制的参数 drag_drop-拖拽绘制 click_display-点击摆放 draw_fence-绘制围墙
        this.draw_attr = {};
    }

    // 开始绘制模型
    begin_draw(obj) {
        this.parent.controls.enableRotate = false;
        this.is_creating = true;
        this.draw_attr = obj;

        // 执行绘制方法
        this[obj.mode](true);

        // 取消绘制
        let down_right = false;
        let is_drag = false;
        this.stop_mousedown_fun = (evt) => {
            if (evt.button === 2) down_right = true;
        };
        this.stop_mousemove_fun = () => {
            if (down_right) is_drag = true;
        };
        this.stop_mouseup_fun = () => {
            if (down_right && !is_drag) {
                // 停止绘制
                this.is_creating = false;
                this[obj.mode](false);
                this.parent.controls.enableRotate = true;

                // 禁用事件
                this.dom.removeEventListener('mousedown', this.stop_mousedown_fun);
                this.dom.removeEventListener('mousemove', this.stop_mousemove_fun);
                this.dom.removeEventListener('mouseup', this.stop_mouseup_fun);
            }
            // 属性恢复
            down_right = false;
            is_drag = false;
        };
        this.dom.addEventListener('mousedown', this.stop_mousedown_fun);
        this.dom.addEventListener('mousemove', this.stop_mousemove_fun);
        this.dom.addEventListener('mouseup', this.stop_mouseup_fun);
    }

    // FIXME 屏幕坐标转三维坐标 -- 需要提取出公共类
    get_mouse_plane_pos(evt) {
        const mouse = {};
        const raycaster = new THREE.Raycaster();
        evt.preventDefault();
        const rect = this.renderer.domElement.getBoundingClientRect();
        mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera); // 通过摄像机和鼠标位置更新射线
        const intersection = new THREE.Vector3();
        const Plane = new THREE.Plane(new THREE.Vector3(0, 0.01, 0), 0);
        if (raycaster.ray.intersectPlane(Plane, intersection)) {
            return intersection;
        }
        return null;
    }

    /**
    *@description: 注册圈地事件
    *@param{Bool} 注册和解除
    *@return:
    */
    drag_drop(evt_type) {
        if (!evt_type) {
            this.dom.removeEventListener('click', this.ground_clickFun);
            this.dom.removeEventListener('mousemove', this.ground_moveFun);
            return;
        }
        // 是否正在绘制矩形
        let is_drawing_ground = false;
        let ground = null;

        // 鼠标移动事件
        this.ground_moveFun = (e_evt) => {
            if (!is_drawing_ground) return;
            // 先删除之前的
            ground._auxiliary_line.forEach((item) => this.scene.remove(item));
            ground._end = this.get_mouse_plane_pos(e_evt);
            ground._update_aux_line();
            ground.show_aux_line(true);
            ground._auxiliary_line.forEach((item) => this.scene.add(item));
        };

        // 鼠标点击事件
        this.ground_clickFun = (s_evt) => {
            if (is_drawing_ground) {
                // 创建地板
                ground._create_node().then(() => {
                    this.scene.add(ground._node);
                    ground.show_aux_line(false);
                    ground = null;
                    is_drawing_ground = false;
                    this.dom.removeEventListener('mousemove', this.ground_moveFun);
                });
                return null;
            }
            ground = new Ground();
            is_drawing_ground = true;
            ground._start = this.get_mouse_plane_pos(s_evt);
            ground._create_aux_line();
            this.dom.addEventListener('mousemove', this.ground_moveFun);
        };

        this.dom.addEventListener('click', this.ground_clickFun);
    }
}

export default DrawManager;

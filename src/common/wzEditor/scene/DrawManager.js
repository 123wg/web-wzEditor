/**
* @Description: 绘制管理器 --用于与物料区交互
* @Author: wg
* @Date: 2021-11-05 15:22:48
* */

import * as THREE from 'three';
import Ground from './Ground';
import Fence from './Fence';
import Substance from './Substance';
import BuildSign from './BuildSign';

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
        this[obj.mode](true);// 执行绘制方法
    }

    // 右键停止事件 地板和围墙使用
    _right_stop_draw_event() {
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
                this._stop_draw();
            }
            // 属性恢复
            down_right = false;
            is_drag = false;
        };
        this.dom.addEventListener('mousedown', this.stop_mousedown_fun);
        this.dom.addEventListener('mousemove', this.stop_mousemove_fun);
        this.dom.addEventListener('mouseup', this.stop_mouseup_fun);
    }

    // 停止绘制
    _stop_draw() {
        // 停止绘制
        this.is_creating = false;
        this.parent.controls.enableRotate = true;
        this[this.draw_attr.mode](false);

        // 禁用事件
        this.dom.removeEventListener('mousedown', this.stop_mousedown_fun);
        this.dom.removeEventListener('mousemove', this.stop_mousemove_fun);
        this.dom.removeEventListener('mouseup', this.stop_mouseup_fun);
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

    // 圈地事件
    drag_drop(evt_type) {
        if (!evt_type) {
            this.dom.removeEventListener('click', this.ground_clickFun);
            this.dom.removeEventListener('mousemove', this.ground_moveFun);
            return;
        }
        this._right_stop_draw_event();
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

    // 绘制围栏方法
    draw_fence(evt_type) {
        if (!evt_type) {
            this.dom.removeEventListener('click', this.fence_clickFun);
            this.dom.removeEventListener('mousemove', this.fence_moveFun);
            // FIXME 测试这种写法
            delete this.fence_clickFun;
            delete this.fence_moveFun;
            return;
        }

        this._right_stop_draw_event();
        // 是否正在绘制围栏
        let is_drawing_fence = false;
        let fence = null;

        //  鼠标移动事件
        this.fence_moveFun = (m_evt) => {
            if (!is_drawing_fence) return;
            fence._node.remove(...fence._node.children);
            fence._end = this.get_mouse_plane_pos(m_evt);
            fence._create_node();
            this.scene.add(fence._node);
        };
        // 点击事件
        this.fence_clickFun = async (c_evt) => {
            if (is_drawing_fence) {
                // 添加到场景中
                is_drawing_fence = false;
                return;
            }
            is_drawing_fence = true;
            fence = new Fence();
            fence._model_url = this.draw_attr.model_url;
            await fence._load_model();
            fence._start = this.get_mouse_plane_pos(c_evt);
            this.dom.addEventListener('mousemove', this.fence_moveFun);
        };
        // 加载模型对象
        this.dom.addEventListener('click', this.fence_clickFun);
    }

    // 点击摆放模型
    async click_display(evt_type) {
        if (!evt_type) {
            this.dom.removeEventListener('click', this.substance_click_fun);
            return;
        }
        const substance = new Substance();
        substance._model_url = this.draw_attr.model_url;
        await substance._create_node();
        this.substance_move_fun = (m_evt) => {
            const m_pos = this.get_mouse_plane_pos(m_evt);
            substance._node.position.set(m_pos.x, m_pos.y, m_pos.z);
            this.scene.add(substance._node);
        };
        this.substance_click_fun = () => {
            this.dom.removeEventListener('mousemove', this.substance_move_fun);
            this._stop_draw();
        };
        this.dom.addEventListener('mousemove', this.substance_move_fun);
        this.dom.addEventListener('click', this.substance_click_fun);
    }

    // 点击绘制建筑
    build_sign(evt_type) {
        if (!evt_type) {
            this.dom.removeEventListener('click', this.build_sign_click);
            return;
        }
        const build_sign = new BuildSign();
        build_sign._create_node();
        this.build_sign_click = () => {
            this.dom.removeEventListener('mousemove', this.build_sign_move);
            this._stop_draw();
        };
        this.build_sign_move = (m_evt) => {
            const pos = this.get_mouse_plane_pos(m_evt);
            build_sign._node.position.set(pos.x, pos.y, pos.z);
            this.scene.add(build_sign._node);
        };
        // 创建物体
        this.dom.addEventListener('mousemove', this.build_sign_move);
        this.dom.addEventListener('click', this.build_sign_click);
    }
}

export default DrawManager;

/**
* @Description: 场景管理器
* @Author: wanggang
* @Date: 2021-10-17 11:52:18
* */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class WzScene {
    constructor() {
        this.init();
    }

    init() {
        this.get_element();//  获取目标元素
        this.init_scene();//  初始化场景
        this.init_camera();//  初始化相机
        this.init_renderer();//  初始化渲染器
        this.start_render();//  执行渲染方法
        this.on_resize();//  窗口自适应
        this.init_sky(); // 初始化天空盒
        this.init_refer_line();// 初始化参考线
        this.init_mouse_control();// 开启鼠标控制
        this.add_box();// FIXME  添加立方体 --测试完成后删除
    }

    get_element() {
        const target = document.getElementById('editor-main');
        this.ele_target = {
            obj: target,
            width: target.clientWidth,
            height: target.clientHeight,
        };
    }

    init_scene() {
        this.scene = new THREE.Scene();
    }

    init_camera() {
        const { width, height } = this.ele_target;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 5;
    }

    init_renderer() {
        const { width, height } = this.ele_target;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.ele_target.obj.appendChild(this.renderer.domElement);
    }

    start_render() {
        // FIXME requestAnimationFrame this指向问题
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.start_render.bind(this));
    }

    on_resize() {
        const resizeFun = () => {
            this.get_element();
            const { width, height } = this.ele_target;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', resizeFun, false);
    }

    init_sky() {

    }

    init_refer_line() {

    }

    init_mouse_control() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.addEventListener('change', this.renderer.render(this.scene, this.camera));
    }

    // FIXME 测试完成后删除
    add_box() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }
}

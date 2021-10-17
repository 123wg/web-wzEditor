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
        // 监听拖放事件
    }

    get_element() {
        const target = document.getElementById('editor-main');
        // FIXME 测试监听拖动事件 获取三维坐标中的位置
        target.addEventListener('dragover', (evt) => {
            const mouse = {};
            const raycaster = new THREE.Raycaster();
            evt.preventDefault();
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera); // 通过摄像机和鼠标位置更新射线
            const intersection = new THREE.Vector3();
            const Plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
            if (raycaster.ray.intersectPlane(Plane, intersection)) {
                // console.log('坐标');
                // console.log(intersection);
                // const geometry = new THREE.CircleGeometry(1);
                // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
                // const circle = new THREE.Mesh(geometry, material);
                // circle.position.copy(intersection);
                // circle.position.y = 10;
                // circle.rotateX(Math.PI / 2);
                // this.scene.add(circle);
                const geometry = new THREE.BoxGeometry(2, 2, 2);
                const material = new THREE.MeshBasicMaterial({ color: 0xFFB6C1 });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.copy(intersection);
                this.scene.add(cube);
            }
        });

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
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
        this.camera.position.x = -26.927091840370167;
        this.camera.position.z = 30.793487404966882;
        this.camera.position.y = 19.578588807939695;
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
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/static/img/skybox/');
        const pictures = ['right.jpg', 'left.jpg', 'top.jpg', 'bottom.jpg', 'front.jpg', 'back.jpg'];
        const fun = () => new Promise((resolve) => {
            loader.load(pictures, (t) => resolve(t));
        });
        fun().then((texture) => {
            this.scene.background = texture;
        });
    }

    init_refer_line() {
        const size = 10000;
        const divisions = 1000;
        this.gridHelper = new THREE.GridHelper(size, divisions);
        console.log('辅助线');
        console.log(this.gridHelper);
        this.scene.add(this.gridHelper);
    }

    init_mouse_control() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.addEventListener('change', this.renderer.render(this.scene, this.camera));
    }

    // FIXME 测试完成后删除
    add_box() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
    }
}

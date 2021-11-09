/**
* @Description: 场景管理器
* @Author: wg
* @Date: 2021-11-05 13:35:13
* */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import DrawManager from './DrawManager';

class SceneManager {
    constructor(app) {
        this.app = app;
        this.scene = {}; // 场景
        this.camera = {}; // 相机
        this.renderer = {};// 渲染器
        this.controls = {}; // 控制器
        this.dom_container = ''; // 绑定的domId
        this.dom = {}; // 绑定的dom节点
        this.render_size = {}; // 渲染区大小
        this.draw_manager = null; // 绘图控制器
    }

    // 初始化方法
    _init(attr) {
        this.dom_container = attr.container;
        this._init_dom();
        this.scene = new THREE.Scene();
        this._init_camera();
        this._init_render();
        this._init_refer_line();
        this._add_axes();
        this._init_sky(attr.skyUrl);
        this._init_mouse_control();
        this._init_light();
        this._start_render();
        this._on_resize();

        // 绘制管理器
        this.draw_manager = new DrawManager(this.app, this);
    }

    // 初始化dom节点
    _init_dom() {
        this.dom = document.getElementById(this.dom_container);
        this.render_size = {
            width: this.dom.clientWidth,
            height: this.dom.clientHeight,
        };
    }

    // 初始化相机
    _init_camera() {
        this.camera = new THREE.PerspectiveCamera(75, this.render_size.width / this.render_size.height, 0.1, 100000);
        this.camera.position.set(37.05153270423892, 161.17531084718553, 258.35751388362866);
        this.camera.rotation.set(-0.3849588417545965, -0.07204303525066746, -0.029156464042305794);
    }

    // 初始化渲染器
    _init_render() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, // 抗锯齿
            // logarithmicDepthBuffer: true, // 使用对数深度缓存
        });
        this.renderer.setSize(this.render_size.width, this.render_size.height);
        this.renderer.setClearColor(new THREE.Color(0, 0, 0), 1);
        this.dom.appendChild(this.renderer.domElement);
    }

    // 初始化参考线
    _init_refer_line() {
        const size = 10000;
        const divisions = 300;
        this.gridHelper = new THREE.GridHelper(size, divisions, '#8c8c8c', '#8c8c8c');
        this.gridHelper.position.y = 0;
        this.scene.add(this.gridHelper);
    }

    // 坐标轴辅助线
    _add_axes() {
        const axesHelper = new THREE.AxesHelper(500);
        this.scene.add(axesHelper);
    }

    // 初始化天空盒
    _init_sky(url) {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath(url);
        const pictures = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'];
        const fun = () => new Promise((resolve) => {
            loader.load(pictures, (t) => resolve(t));
        });
        fun().then((texture) => {
            this.scene.background = texture;
        });
    }

    // 开启鼠标控制
    _init_mouse_control() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 开启惯性
        this.controls.dampingFactor = 0.8;
    }

    // 开启光照
    _init_light() {
        // 点光源
        const point = new THREE.PointLight(0xffffff);
        point.position.set(400, 200, 300);
        this.scene.add(point);

        // 环境光
        const ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        // 平行光
        const light = new THREE.DirectionalLight();
        light.position.set(200, 500, 300);
        this.scene.add(light);
    }

    // 开启渲染
    _start_render() {
        this.renderer.render(this.scene, this.camera);
        if (this.controls) this.controls.update();
        requestAnimationFrame(this._start_render.bind(this));
    }

    // 窗口自适应
    _on_resize() {
        const resizeFun = () => {
            this._init_dom();
            const { width, height } = this.render_size;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', resizeFun, false);
    }
}

export default SceneManager;

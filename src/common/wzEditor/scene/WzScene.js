/**
* @Description: 场景管理器
* @Author: wanggang
* @Date: 2021-10-17 11:52:18
* */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import Stats from 'stats.js';
// FIXME CSG 暂时只支持 Geometry生成的mesh 先测试一下enable3d 使用的布尔运算工具
// import { CSG } from 'three-csg-ts';
// 测试证明 Geometry 使用情况良好 未测试bufferGeometry 情况
// import { CSG } from '@enable3d/three-graphics/jsm/csg';
import bus from '@/common/EventBus';
import Wall from '@/common/WzEditor/scene/Wall';

export default class WzScene {
    constructor() {
        this.init();
    }

    init() {
        this.get_element();//  获取目标元素
        this.init_scene();//  初始化场景
        this.init_camera();//  初始化相机
        this.init_renderer();//  初始化渲染器
        this.init_light(); // 开启光照;
        // this.scene_fog();// 场景雾化效果
        this.start_render();//  执行渲染方法
        this.on_resize();//  窗口自适应
        this.init_mouse_control();// 开启鼠标控制

        this.init_sky(); // 初始化天空盒
        this.init_refer_line();// 初始化参考线

        this.add_axes();// 添加辅助线

        this.add_performance();// 性能监控面板

        // this.add_box();// FIXME  添加立方体 --测试完成后删除
        // this.add_gltf(); // 加载gltf 小人
        // this.listen_create_model();
        // this.add_floor(); // 添加地板
        // this.select_model(); // 开启物体选中效果

        // 基础功能测试------start-----

        // 测试创建管道
        // this.test_pipe();

        // 墙上绘制门窗
        this.draw_door();

        // 基础功能测试------end-----

        // 交互功能测试区 ----- start---
        // 测试射线拾取
        // this.test_pick_up();
        // 测试拉伸生成几何体
        // this.test_tensile();
        // 测试几何体合并
        // this.enable3d_csg();

        // 交互功能测试区 ----- end-----

        // ---------效果测试start------
        // 毛玻璃材质使用
        // this.test_maoboli();
        // ---------效果测试end--------
    }

    get_element() {
        this.dom = document.getElementById('editor-main');
        this.size = {
            width: this.dom.clientWidth,
            height: this.dom.clientHeight,
        };
    }

    init_scene() {
        this.scene = new THREE.Scene();
    }

    /**
    *如何保存视点后恢复
    *
    */
    init_camera() {
        const { width, height } = this.size;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
        this.camera.position.set(37.05153270423892, 161.17531084718553, 258.35751388362866);
        this.camera.rotation.set(-0.3849588417545965, -0.07204303525066746, -0.029156464042305794);
    }

    init_renderer() {
        const { width, height } = this.size;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true, // 抗锯齿
        });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(new THREE.Color(0, 0, 0), 1); // 设置背景颜色
        this.dom.appendChild(this.renderer.domElement);
    }

    start_render() {
        if (this.stats) this.stats.begin();
        // FIXME requestAnimationFrame this指向问题
        this.renderer.render(this.scene, this.camera);
        if (this.testaaa) this.testaaa.render();
        if (this.controls) this.controls.update();
        if (this.stats) this.stats.end();
        requestAnimationFrame(this.start_render.bind(this));
    }

    on_resize() {
        const resizeFun = () => {
            this.get_element();
            const { width, height } = this.size;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', resizeFun, false);
    }

    init_mouse_control() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 开启惯性
        this.controls.dampingFactor = 0.8;
        // this.controls.addEventListener('click', (evt) => {
        //     evt.preventDefault();
        // });
    }

    init_sky() {
        const loader = new THREE.CubeTextureLoader();
        loader.setPath('/static/img/skybox/Night/');
        const pictures = ['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg'];
        const fun = () => new Promise((resolve) => {
            loader.load(pictures, (t) => resolve(t));
        });
        fun().then((texture) => {
            this.scene.background = texture;
        });
    }

    init_refer_line() {
        const size = 10000;
        const divisions = 300;
        this.gridHelper = new THREE.GridHelper(size, divisions, '#8c8c8c', '#8c8c8c');
        this.gridHelper.position.y = 0;
        this.scene.add(this.gridHelper);
    }

    // 添加坐标辅助线 红-x 蓝-z 绿-y
    add_axes() {
        const axesHelper = new THREE.AxesHelper(500);
        this.scene.add(axesHelper);
    }

    // 性能监控面板
    add_performance() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        document.body.appendChild(this.stats.dom);
    }

    // 初始化灯光
    init_light() {
        // 点光源
        // const point = new THREE.PointLight(0xffffff);
        // point.position.set(400, 200, 300); // 点光源位置
        // this.scene.add(point); // 点光源添加到场景中

        // 环境光
        const ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        // 平行光
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(200, 500, 300);
        this.scene.add(light);
    }

    /**
    * FIXME 自带的指数雾和线性雾 效果都不好 -- 暂时注释
    */
    scene_fog() {
        // this.scene.fog = new THREE.Fog('#e6e6e6', 1000, 10000);
        // this.scene.fog = new THREE.FogExp2(0xffffff, 0.0025); // 指数雾
    }

    // FIXME 测试完成后删除
    add_box() {
        const geometry = new THREE.BoxGeometry(100, 0.1, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        cube.name = 'box';
    }

    add_gltf() {
        const loader = new GLTFLoader();
        loader.load('/static/model/matilda/scene.gltf', (gltf) => {
            console.log(gltf);
            const model = gltf.scene;
            // console.log('加载的模型');
            // console.log(model);
            this.scene.add(model);
        }, undefined, (error) => {
            console.error(error);
        });
    }

    // 监听新建模型
    listen_create_model() {
        const that = this;
        bus.$on('create_model', (data) => {
            this.is_create = true;
            this.model_data = data;
        });
        this.renderer.domElement.addEventListener('mousemove', (evt) => {
            evt.preventDefault();
            if (this.is_create) {
                this.is_create = false;
                // 获取鼠标和平面交点坐标
                const position = this.get_mouse_plane_pos(evt);
                if (position) {
                // 创建模型并且生成在对应坐标
                    const loader = new GLTFLoader();
                    loader.load(that.model_data.model_url, (gltf) => {
                        that.creating_model = gltf.scene;
                        that.scene.add(this.creating_model);
                        that.creating_model.position.copy(position);
                        this.creating_model.name = 'girl';
                        // console.log('新建的数据为');
                        // console.log(this.creating_model);
                    }, undefined, (error) => {
                        console.error(error);
                    });
                }
            } else {
                // 获取鼠标和平面交点坐标
                const position = this.get_mouse_plane_pos(evt);
                if (position && that.creating_model) {
                    that.creating_model.position.copy(position);
                } else {
                    return null;
                }
            }
        });

        this.renderer.domElement.addEventListener('click', () => {
            if (this.creating_model) {
                this.creating_model = null;
            }
        });
    }

    // FIXME 添加地板测试
    add_floor() {
        const loader = new THREE.TextureLoader();
        loader.load('/static/img/floor.jpg', (texture) => {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(10, 10);
            const geometry = new THREE.BoxGeometry(500, 400, 1);
            const geometryMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
            });
            const floor = new THREE.Mesh(geometry, geometryMaterial);
            floor.position.y = 1;
            floor.position.x = 20;
            floor.position.z = 30;
            floor.rotation.x = Math.PI / 2;
            // floor.name = '地面';
            floor._type = 'Campus';
            this.scene.add(floor);
        });
    }

    // 鼠标选中物体外发光
    select_model() {
        const { width, height } = this.size;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        let selectedObjects = [];
        composer.addPass(renderPass);
        const outlinePass = new OutlinePass(new THREE.Vector2(width, height), this.scene, this.camera);
        outlinePass.edgeStrength = 5;// 包围线浓度
        outlinePass.edgeGlow = 0.5;// 边缘线范围
        outlinePass.edgeThickness = 2;// 边缘线浓度
        outlinePass.pulsePeriod = 4;// 包围线闪烁频率
        outlinePass.visibleEdgeColor.set('#ff5050');// 包围线颜色
        outlinePass.hiddenEdgeColor.set('#190a05');// 被遮挡的边界线颜色
        composer.addPass(outlinePass);
        const effectFXAA = new ShaderPass(FXAAShader);
        effectFXAA.uniforms.resolution.value.set(1 / width, 1 / height);
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);
        this.renderer.domElement.addEventListener('click', (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            // 转换的过程 将屏幕的坐标 转换为已threejs 中标准的坐标 原点位置变化，范围为[-1,1]
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            raycaster.setFromCamera(mouse, this.camera);
            selectedObjects = [];
            const getParent = (e) => {
                if (e.parent && e.parent !== this.scene) {
                    getParent(e.parent);
                } else {
                    this.selectMesh = e;
                }
            };
            const intersects = raycaster.intersectObjects(this.scene.children, true);
            // 如果选中的是身体的某一部分的话 查找所有祖先是不是有name为girl的
            if (intersects.length !== 0) {
                getParent(intersects[0].object);
                selectedObjects.push(this.selectMesh);
                outlinePass.selectedObjects = selectedObjects;// 给选中的线条和物体加发光特效
                this.testaaa = composer;
            } else {
                outlinePass.selectedObjects = [];
            }
        });
    }

    // 屏幕坐标转三维坐标
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

    // 创建管道
    test_pipe() {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-80, -40, 0),
            new THREE.Vector3(-70, 40, 0),
            new THREE.Vector3(70, 40, 0),
            new THREE.Vector3(80, -40, 0),
        ]);
        const tubeGeometry = new THREE.TubeGeometry(curve, 100, 2, 200, false);
        const texture_loader = new THREE.TextureLoader();
        const texture = texture_loader.load('/static/img/tube.png');
        // 设置阵列模式为 RepeatWrapping
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(100, 4);
        const tubeMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8,
            // side: THREE.DoubleSide,
        });
        setInterval(() => {
            texture.offset.x -= 0.05;
        }, 10);
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        this.scene.add(tube);
    }

    // 测试毛玻璃效果
    // 参考 https://twitter.com/kellymilligannz/status/1451113620419473408
    test_maoboli() {
        const geometrey = new THREE.BoxGeometry(20, 20, 20);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            roughness: 0.75,
            transmission: 1,
            thickness: 0.5,
            transparent: true,
        });
        const box = new THREE.Mesh(geometrey, material);
        this.scene.add(box);
    }

    // FIXME 测试在墙上画门
    draw_door() {
        // 注册点击事件拾取位置
        const wall = new Wall(this.scene);
        const start = new THREE.Vector3(-44.275354894211006, 0, -25.706564439374404);
        const end = new THREE.Vector3(227.83783249779577, 0, -166.84207427248873);
        wall.start = start;
        wall.end = end;
        wall._create_node();
        this.scene.add(wall.node);
    }

    // 测试射线拾取
    test_pick_up() {
        console.log(this.scene.children);
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.dom.addEventListener('mousemove', (m_evt) => {
            const mouse = {};
            mouse.x = ((m_evt.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((m_evt.clientY - rect.top) / rect.height) * 2 + 1;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, this.camera);

            const intersects = raycaster.intersectObjects(this.scene.children, true);

            if (intersects.length > 0) {
                const first = intersects[0];
                const obj = first.object; // 判断
                let sel_obj = null;

                // 查找墙体 这里需要思考，编辑器基类对象的设计
                if (obj.name === 'Wall') {
                    sel_obj = obj;
                } else {
                    obj.object.traverseAncestors((parent) => {
                        if (parent.name === 'Wall') sel_obj = parent;
                    });
                }

                if (sel_obj) {
                    // this.create_point(first.point);
                    // 测试拉伸门窗
                    this.create_door(first.point);
                }
            }
        });
    }

    // 测试鼠标拾取点坐标
    create_point(points) {
        const geometry = new THREE.BufferGeometry();
        geometry.setFromPoints(vertices);
        const material = new THREE.PointsMaterial({
            color: 'red',
            size: 2,
        });
        const mesh = new THREE.Points(geometry, material);
        this.scene.add(mesh);
    }

    create_door(pos) {
        pos.y = 0;
        const start = new THREE.Vector3(-44.275354894211006, 0, -25.706564439374404);
        const end = new THREE.Vector3(227.83783249779577, 0, -166.84207427248873);
        const dir = new THREE.Vector3().subVectors(end, start);
        dir.normalize();
        dir.multiplyScalar(3);
        const bottom_dir = new THREE.Vector3(0, -1, 0);
        const normal_dir = new THREE.Vector3().crossVectors(dir, bottom_dir).normalize().multiplyScalar(30);
        // const normal_dir = new THREE.Vector3(0, 0, 30);

        const p1 = new THREE.Vector3().addVectors(pos, dir);
        const p2 = new THREE.Vector3().subVectors(pos, dir);
        const p3 = new THREE.Vector3().subVectors(p1, normal_dir);
        const p4 = new THREE.Vector3().subVectors(p2, normal_dir);

        const points = [p1, p2, p3, p4];
        this.create_point(points);
    }

    // 测试拉伸几何体
    test_tensile() {
        const start = new THREE.Vector3(-44.275354894211006, 0, -25.706564439374404);
        const end = new THREE.Vector3(227.83783249779577, 0, -166.84207427248873);
        const dir = new THREE.Vector3().subVectors(end, start);
        const x_dir = new THREE.Vector3(1, 0, 0);
        const angle = dir.angleTo(x_dir);

        const shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(30, 0);
        shape.lineTo(30, 30);
        shape.lineTo(0, 30);

        const extrudeSetting = {
            amount: 20,
            bevelEnabled: false,
        };

        const extrude_geometry = new THREE.ExtrudeGeometry(shape, extrudeSetting);
        extrude_geometry.rotateY(angle);
        extrude_geometry.translate(0, 0, -55);

        const material = new THREE.MeshLambertMaterial({
            color: 'red',
            size: 1, // 点对象像素尺
            curveSegments: 5,
        });
        const mesh = new THREE.Mesh(extrude_geometry, material);
        this.scene.add(mesh);

        // FIXME 获取墙 mesh合并
        // const wall = this.scene.getObjectByName('Wall');

        // 这里报错 type为Group 和 type 为mesh 的无法一起计算
        // const meshC = CSG.intersect(wall.children[0], mesh);
        // console.log(meshC);
    }

    // enable3d_csg() {
    //     // 第一种情况 两个 Geometry
    //     const geometry1 = new THREE.BoxGeometry(30, 30, 30);
    //     const geometry2 = new THREE.BoxGeometry(10, 10, 10);
    //     geometry2.translate(0, 15, 0);
    //     const material1 = new THREE.MeshPhongMaterial({
    //         color: '#3399ff',
    //         wireframe: true,
    //     });
    //     const material2 = new THREE.MeshPhongMaterial({
    //         color: '#3399ff',
    //     });
    //     const box1 = new THREE.Mesh(geometry1, material1);
    //     const box2 = new THREE.Mesh(geometry2, material2);

    //     box1.updateMatrix();
    //     box2.updateMatrix();

    //     const new_mesh = CSG.subtract(box1, box2);
    //     console.log(new_mesh);
    //     new_mesh.material = material1;
    //     this.scene.add(new_mesh);

    //     // 第二种情况 两个bufferGeometry
    //     // const geometry = new THREE.BufferGeometry();
    //     // const position = new Float32Array([
    //     // ]);
    // }
}

/**
* @Description: 场景管理器
* @Author: wanggang
* @Date: 2021-10-17 11:52:18
* */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import bus from '@/common/EventBus';

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
        this.init_mouse_control();// 开启鼠标控制

        // this.init_sky(); // 初始化天空盒
        this.init_refer_line();// 初始化参考线

        // this.add_box();// FIXME  添加立方体 --测试完成后删除
        this.add_gltf();
        // this.listen_create_model();
        // // this.add_floor(); // 添加地板
        // this.select_model(); // 选中模型外发光

        this.draw_rect(); // 绘制矩形
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

    init_camera() {
        const { width, height } = this.size;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100000);
        this.camera.position.x = -26.927091840370167;
        this.camera.position.z = 30.793487404966882;
        this.camera.position.y = 19.578588807939695;
    }

    init_renderer() {
        const { width, height } = this.size;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色
        this.dom.appendChild(this.renderer.domElement);
    }

    start_render() {
        // FIXME requestAnimationFrame this指向问题
        this.renderer.render(this.scene, this.camera);
        if (this.testaaa) this.testaaa.render();
        if (this.controls) this.controls.update();
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

    // 初始化灯光
    init_light() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);// 模拟远处类似太阳的光源
        directionalLight.color.setHSL(0.1, 1, 0.95);
        directionalLight.position.set(0, 200, 0).normalize();
        this.scene.add(directionalLight);

        const ambient = new THREE.AmbientLight(0xffffff, 1); // AmbientLight,影响整个场景的光源
        ambient.position.set(0, 0, 0);
        this.scene.add(ambient);
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
            const model = gltf.scene;
            console.log('加载的模型');
            console.log(model);
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
                        console.log('新建的数据为');
                        console.log(this.creating_model);
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
            floor.name = '地面';
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
        outlinePass.edgeThickness = 1;// 边缘线浓度
        outlinePass.pulsePeriod = 3;// 包围线闪烁频率
        outlinePass.visibleEdgeColor.set('#ffffff');// 包围线颜色
        outlinePass.hiddenEdgeColor.set('#190a05');// 被遮挡的边界线颜色
        composer.addPass(outlinePass);
        const effectFXAA = new ShaderPass(FXAAShader);
        console.log(effectFXAA.uniforms);
        effectFXAA.uniforms.resolution.value.set(1 / width, 1 / height);
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);
        this.renderer.domElement.addEventListener('click', (event) => {
            console.log(this.scene);
            const rect = this.renderer.domElement.getBoundingClientRect();
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
            console.log(intersects);
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

    // 绘制矩形
    draw_rect() {
        // 是否正在绘制矩形
        this.is_draw_rect = false;
        this.dom.addEventListener('click', (evt) => {
            if (this.is_draw_rect) return;
            this.rect_box = [];

            const start = this.get_mouse_plane_pos(evt);
            this.rect_start = start;
            for (let i = 0; i < 4; i += 1) {
                const geometry = new THREE.BoxGeometry(5, 0.1, 5);
                console.log(geometry.parameters);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const cube = new THREE.Mesh(geometry, material);
                cube.visible = false;
                cube.position.x = start.x;
                cube.position.z = start.z;
                this.rect_box.push(cube);
                this.scene.add(cube);
            }
            this.is_draw_rect = true;

            this.create_floor = () => {
                if (!this.is_draw_rect) return;
                this.is_draw_rect = false;
                for (let i = 0; i < this.rect_box.length; i += 1) {
                    this.scene.remove(this.rect_box[i]);
                }
                this.rect_box = [];

                // 绘制地板
                const loader = new THREE.TextureLoader();
                loader.load('/static/img/floor.jpg', (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(10, 10);
                    const geometry = new THREE.BoxGeometry(this.rect_width, 1, this.rect_height);
                    const geometryMaterial = new THREE.MeshBasicMaterial({
                        map: texture,
                        side: THREE.DoubleSide,
                    });
                    const floor = new THREE.Mesh(geometry, geometryMaterial);
                    floor.position.y = 1;
                    floor.position.x = this.rect_cenx;
                    floor.position.z = this.rect_cenz;
                    // floor.rotation.x = Math.PI / 2;
                    floor.name = '地面';
                    this.scene.add(floor);
                    this.dom.removeEventListener('click', this.create_floor);
                });
            };
            this.dom.addEventListener('click', this.create_floor);
        });
        this.dom.addEventListener('mousemove', (evt) => {
            if (!this.is_draw_rect) return;
            const end = this.get_mouse_plane_pos(evt);
            const startx = this.rect_start.x;
            const startz = this.rect_start.z;
            const endx = end.x;
            const endz = end.z;
            const cenx = (startx + endx) / 2;
            const cenz = (startz + endz) / 2;
            this.rect_cenx = (startx + endx) / 2;
            this.rect_cenz = (startz + endz) / 2;
            const pos = [[startx, startz], [endx, startz], [endx, endz], [startx, endz]];
            const width = endx - startx;
            const height = endz - startz;
            this.rect_width = width;
            this.rect_height = height;
            for (let i = 0; i < this.rect_box.length; i += 1) {
                this.rect_box[i].visible = true;

                if (i % 2 !== 0) {
                    this.rect_box[i].position.z = cenz;
                    [this.rect_box[i].position.x] = pos[i];
                    this.rect_box[i].scale.z = height / 5;
                } else {
                    this.rect_box[i].position.x = cenx;
                    [, this.rect_box[i].position.z] = pos[i];
                    this.rect_box[i].scale.x = width / 5;
                }
            }
        });
    }
}

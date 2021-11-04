/**
* @Description: 场景管理器
* @Author: wanggang
* @Date: 2021-10-17 11:52:18
* */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { CSG } from 'three-csg-ts'; // 交集并集计算
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
        this.init_light(); // 开启光照;
        // this.scene_fog();// 场景雾化效果
        this.start_render();//  执行渲染方法
        this.on_resize();//  窗口自适应
        this.init_mouse_control();// 开启鼠标控制

        this.init_sky(); // 初始化天空盒
        this.init_refer_line();// 初始化参考线
        this.add_axes();// 添加辅助线

        // this.add_box();// FIXME  添加立方体 --测试完成后删除
        // this.add_gltf();
        // this.listen_create_model();
        // this.add_floor(); // 添加地板
        // this.select_model(); // 开启光线追踪

        // 基础功能测试------start-----
        // 测试贴图
        // this.test_texture();
        // 测试创建窗户
        // this.test_window();
        // 测试创建管道
        // this.test_pipe();
        // 测试group的使用
        // this.test_group();

        // 基础功能测试------end-----

        // 交互功能测试区 ----- start-------
        // 拖拽绘制矩形
        // this.draw_rect();
        // 点击绘制建筑盒子
        // this.draw_build_facade();
        // FIXME 测试模型复制 为拖拽做准备
        // this.test_clone();
        //  TODO 拖拽绘制围墙
        this.draw_fence();
        // 测试改变缩放中心点
        // this.change_scale_center();

        // 测试几何体合并
        // this.test_merge_geometry();
        // 拖拽绘制线条
        // this.drag_draw_line();
        // 交互功能测试区 ----- end-------

        // ---------效果测试start----------
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

    // 初始化灯光
    init_light() {
        // 点光源
        const point = new THREE.PointLight(0xffffff);
        point.position.set(400, 200, 300); // 点光源位置
        this.scene.add(point); // 点光源添加到场景中
        // 环境光
        const ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        // 平行光
        const light = new THREE.DirectionalLight();
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
        outlinePass.edgeStrength = 2;// 包围线浓度
        outlinePass.edgeGlow = 0.5;// 边缘线范围
        outlinePass.edgeThickness = 1;// 边缘线浓度
        outlinePass.pulsePeriod = 3;// 包围线闪烁频率
        outlinePass.visibleEdgeColor.set('#ff5050');// 包围线颜色
        outlinePass.hiddenEdgeColor.set('#190a05');// 被遮挡的边界线颜色
        composer.addPass(outlinePass);
        const effectFXAA = new ShaderPass(FXAAShader);
        // console.log(effectFXAA.uniforms);
        effectFXAA.uniforms.resolution.value.set(1 / width, 1 / height);
        effectFXAA.renderToScreen = true;
        composer.addPass(effectFXAA);
        this.renderer.domElement.addEventListener('click', (event) => {
            // console.log(this.scene);
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

    // 绘制建筑盒子
    draw_build_facade() {
        this.draw_build_facade = false;
        this.dom.addEventListener('mousedown', (evt) => {
            if (this.draw_build_facade) return;
            const pos = this.get_mouse_plane_pos(evt);
            const width = 100;
            const depth = 100;
            const text = '建筑';
            // 创建立方体盒子
            const geometry = new THREE.BoxGeometry(width, 20, depth);
            const material = new THREE.MeshBasicMaterial({
                color: '#47c2de',
                transparent: true,
                opacity: 0.6,
            });
            const cube = new THREE.Mesh(geometry, material);
            this.scene.add(cube);
            cube.position.x = pos.x;
            cube.position.z = pos.z;
            cube.position.y = 0.1;

            // 绑定点击事件
            cube.addEventListener('click', (cube_evt) => {
                console.log(cube_evt);
            });

            // 创建文字
            const loader = new FontLoader();
            console.log(loader);
            loader.load('/static/font/KaiTi_Regular.json', (font) => {
                const facade_text = new TextGeometry(text, {
                    font,
                    size: 10,
                    height: 0.1,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.1,
                    bevelSize: 0.05,
                    bevelSegments: 3,
                });
                const text_material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
                const text_cube = new THREE.Mesh(facade_text, text_material);

                // 计算包围球 使文字居中
                text_cube.geometry.computeBoundingSphere();
                const { radius } = text_cube.geometry.boundingSphere;
                this.scene.add(text_cube);
                text_cube.position.y = 10;
                text_cube.position.x = pos.x - radius;
                text_cube.position.z = pos.z;
                text_cube.rotation.set(-0.5 * Math.PI, 0, 0); // 几何体旋转的使用

                this.draw_build_facade = true;
            });
        });

        this.dom.addEventListener('mouseup', () => {
            if (!this.draw_build_facade) return;
            this.draw_build_facade = false;
        });
    }

    /**
    *测试贴图
    *aoMap:环境光遮蔽 物体距离越近 光照效果越暗
    数组材质
    */
    test_texture() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/static/img/wall.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(10, 2);
        texture.needsUpdate = true;
        const geometry = new THREE.BoxGeometry(150, 30, 5);
        const material_1 = new THREE.MeshLambertMaterial({
            map: texture,
        });
        // 材质对象1
        const material_2 = new THREE.MeshPhongMaterial({
            color: '#B3B3B3',
        });
        const material = [material_2, material_2, material_2, material_2, material_1, material_1];
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 8;
        cube.position.x = 50;
        this.scene.add(cube);
        console.log(cube);
    }

    // 测试创建窗户 -- 使用这个库贴图没了 坑逼
    // https://www.npmjs.com/package/three-csg-ts
    test_window() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/static/img/wall.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;
        const geometry = new THREE.BoxGeometry(150, 30, 5);
        const cube = new THREE.Mesh(geometry);

        const window_box = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 5));

        const material_1 = new THREE.MeshLambertMaterial({
            map: texture,
        });
        const new_wall = CSG.subtract(cube, window_box);
        new_wall.material = material_1;
        new_wall.position.x = 50;
        new_wall.position.y = 10;
        this.scene.add(new_wall);
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

    // 测试group的使用
    test_group() {
        const group = new THREE.Group();
        const geometry_1 = new THREE.BoxGeometry(10, 10, 10);
        const grometry_2 = new THREE.BoxGeometry(5, 20, 5);
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/static/img/grass/brown_mud_leaves_01_diff_1k.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(5, 5);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            opacity: 0.8,
        });
        const box_1 = new THREE.Mesh(geometry_1, material);
        const box_2 = new THREE.Mesh(grometry_2, material);
        box_1.name = 'test_box';
        box_2.name = 'test_box';
        group.add(box_1);
        group.add(box_2);
        this.scene.add(group);

        // 对象遍历
        group.traverse((obj) => {
            console.log(obj);
        });
    }

    // 绘制围墙
    draw_fence() {
        let is_drawing = false; // 当前是否在绘制状态
        const loader = new FBXLoader();
        loader.load('/static/model/fence/fence.FBX', (obj) => {
            // 位置纠正
            obj.traverse((item) => {
                if (item.type === 'Mesh') {
                    item.rotation.z = Math.PI / 2;
                }
            });

            const box3 = new THREE.Box3();
            box3.expandByObject(obj);
            const { max, min } = box3;
            const per_width = max.x - min.x;
            const per_height = max.y - min.y;
            obj.translateY(per_height / 2);

            let start = new THREE.Vector3();
            let end = new THREE.Vector3();
            let group = new THREE.Group();

            // // 清除现有的
            const clear_group = () => {
                group.remove(...group.children);
            };
            const moveFun = (e_evt) => {
                clear_group();
                end = this.get_mouse_plane_pos(e_evt);
                end.y = 0;
                // 计算两点之间的距离
                const dis = start.distanceTo(end);

                // 计算旋转的角度
                const vec1 = new THREE.Vector3(1, 0, 0);
                const vec2 = end.clone().sub(start.clone());// 直接使用sub方法会改变之前的对象
                let angle = vec2.angleTo(vec1);
                const direc = vec2.cross(vec1).y;
                if (direc > 0) angle = 0 - angle;

                const number = dis / per_width;
                const number_bottom = Math.floor(number);// 计算阵列的数量
                const number_top = Math.ceil(number);
                // 总数 判断是否有小数 有的话 最后一个缩放
                for (let i = 0; i < number_top; i += 1) {
                    const wrapper_group = new THREE.Group();
                    const temp = obj.clone();
                    temp.position.x = per_width / 2;
                    wrapper_group.add(temp);
                    wrapper_group.position.x = i * per_width;

                    // 判断上下数量是否相等 不想等的情况下 缩放最后一个
                    if (number_bottom !== number_top && i === number_top - 1) {
                        wrapper_group.scale.x = number - number_bottom;
                    }
                    group.add(wrapper_group);
                }
                group.rotation.y = angle;
                this.scene.add(group);
            };

            // // 注册鼠标点击事件
            const clickFun = (s_evt) => {
                if (!is_drawing) { // 进入编辑状态
                    clear_group();
                    start = this.get_mouse_plane_pos(s_evt);
                    group.position.set(start.x, start.y, start.z);
                    this.dom.addEventListener('mousemove', moveFun);
                    is_drawing = true;
                } else { // 退出编辑状态
                    group = new THREE.Group();
                    clear_group();
                    this.dom.removeEventListener('mousemove', moveFun);
                    is_drawing = false;
                }
            };

            this.dom.addEventListener('click', clickFun);
        });
    }

    /**
    *@description:改变缩放中心
    * 将物体的中心移动
    * 放入group中 对group进行缩放
    */
    change_scale_center() {
        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry(80, 10, 5);
        const material = new THREE.MeshLambertMaterial({
            color: 'red',
        });
        const box = new THREE.Mesh(geometry, material);
        box.position.x = 40;
        group.add(box);
        this.scene.add(group);
        let scalex = 1;
        setInterval(() => {
            scalex -= 0.001;
            group.scale.set(scalex, 1, 1);
        }, 18);
    }

    // 测试模型复制 --clone
    test_clone() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshLambertMaterial({
            color: 'green',
        });
        const box = new THREE.Mesh(geometry, material);
        this.scene.add(box);
        const box_1 = box.clone();
        box_1.position.x = 20;
        this.scene.add(box_1);
        box_1.scale.x = 2;
        box_1.material = new THREE.MeshLambertMaterial({
            color: 'RED',
        });
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

    /**
    * 测试阵列
    * 1.测试简单的矩形和球形合并
    * 2.测试有贴图的两个物体合并
    * 3.测试有旋转角度的物体合并
    * 4.测试旋转的时候物体合并效果
    * 5.解决实时更新的问题
    */
    test_merge_geometry() {
        // 数据准备
        let start = new THREE.Vector3();
        let end = new THREE.Vector3();
        const groups = new THREE.Group();
        const material = new THREE.MeshLambertMaterial({
            color: 'green',
        });

        // 删除所有的几何体
        const clear_group = () => {
            groups.remove(...groups.children);
        };

        // 鼠标移动方法
        const moveFun = (end_evt) => {
            clear_group();
            end = this.get_mouse_plane_pos(end_evt);
            end.y = 0;
            const vec1 = new THREE.Vector3(1, 0, 0);
            const vec2 = end.clone().sub(start.clone());// 直接使用sub方法会改变之前的对象
            let angle = vec2.angleTo(vec1);
            const direc = vec2.cross(vec1).y;
            if (direc > 0) angle = 0 - angle;
            const dis = start.distanceTo(end); // 计算两点之间的距离
            const per_width = 10;// 计算包围盒的width
            let number = Math.floor(dis / per_width);// 计算阵列的数量
            if (number <= 0) number = 1;
            for (let i = 0; i < number; i += 1) {
                const geometry = new THREE.BoxGeometry(10, 50, 5);
                const box = new THREE.Mesh(geometry, material);
                box.name = 'move_box';
                box.position.x += i * 10;
                box.position.y = 25;
                groups.add(box);
            }

            // FIXME 这里不使用group 的方法 考虑修改为 几何体合并
            groups.rotation.y = angle;// 阵列变换
            this.scene.add(groups);
        };

        // 点击方法
        const clickFun = (evt) => {
            clear_group();
            this.dom.removeEventListener('mousemove', moveFun);
            start = this.get_mouse_plane_pos(evt);
            start.y = 0;

            // 创建开始点
            groups.position.x = start.x;
            groups.position.z = start.z;
            this.dom.addEventListener('mousemove', moveFun);
        };

        // 鼠标移动方法
        this.dom.addEventListener('click', clickFun);
    }

    // 拖拽绘制线条
    drag_draw_line() {
        let points = [];
        const line_geometry = new THREE.BufferGeometry();
        const line_material = new THREE.LineBasicMaterial({ color: 'red' });
        const line = new THREE.Line(line_geometry, line_material);
        this.scene.add(line);

        this.dom.addEventListener('click', (evt) => {
            points = [];
            const start = this.get_mouse_plane_pos(evt);
            start.y = 0;
            points.push(start);
            this.dom.addEventListener('mousemove', (end_evt) => {
                const end = this.get_mouse_plane_pos(end_evt);
                end.y = 0;
                if (points.length === 2) points.pop();
                points.push(end);
                line.geometry.setFromPoints(points);
            });
        });
    }
}

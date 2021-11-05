/**
* @Description: 绘制管理器 --用于与物料区交互
* @Author: wg
* @Date: 2021-11-05 15:22:48
* */
import * as THREE from 'three';

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
        this.parent.ban_scene_rotate();
        this.is_creating = true;
        this.draw_attr = obj;
        this[obj.mode]();

        // 添加鼠标右击退出绘制事件
    }

    // 结束绘制
    end_draw() {
        // 根据当前绘制的类型 关闭响应的事件
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

    // 圈地
    drag_drop() {
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

    // 拖拽绘制围墙
    draw_fence() {

    }

    // 点击摆放模型
    click_display() {
        // const { model_url } = this.draw_attr;
        // 获取模型地址
        // 加载模型
        // 创建鼠标移动事件
        // 创建鼠标点击事件
    }
}

export default DrawManager;

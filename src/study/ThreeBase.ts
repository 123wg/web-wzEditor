import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class BaseCad {
    dom: HTMLElement;

    size: { width: number; height: number; };

    scene: THREE.Scene;

    camera: THREE.PerspectiveCamera;

    controls: OrbitControls;

    renderer: any;

    get_dom() {
        this.dom = document.getElementById('yt-three');
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
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(-30, 40, 30);
        this.camera.lookAt(0,0,0)
    }

    init_light() {
        const point = new THREE.PointLight('white');
        point.position.set(400, 200, 300); // 点光源位置
        this.scene.add(point); // 点光源添加到场景中
        // // 环境光
        const ambient = new THREE.AmbientLight('white', 0.2);
        this.scene.add(ambient);

        // // 平行光
        const light = new THREE.DirectionalLight('white');
        light.position.set(20, 200, 20);
        this.scene.add(light);
    }

    init_control() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 开启惯性
        this.controls.dampingFactor = 0.8;
        this.controls.mouseButtons = {
            LEFT:5555,
            MIDDLE:  THREE.MOUSE.ROTATE,
            RIGHT: THREE.MOUSE.PAN
        }
    }

    init_render() {
        const { width, height } = this.size;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.renderer.setClearColor(new THREE.Color(0, 0, 0), 1);
        this.renderer.setSize(width, height);
        this.dom.appendChild(this.renderer.domElement);
    }

    start_render() {
        if (this.controls) this.controls.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.start_render.bind(this));
    }

    on_resize() {
        const resizeFun = () => {
            this.get_dom();
            const { width, height } = this.size;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', resizeFun, false);
    }
}

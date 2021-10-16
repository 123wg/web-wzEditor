/**
* @Description: 编辑器管理器
* @Author: wg
* @Date: 2021-10-15 15:26:43
* */
import * as THREE from 'three';

export default class WzEditor {
    constructor() {
        this.init();
    }

    // 加载中间画布
    init() {
        const target = document.getElementById('editor-main');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, target.clientWidth / target.clientHeight, 0.1, 1000);
        this.render = new THREE.WebGLRenderer();
        this.render.setSize(target.clientWidth, target.clientHeight);

        target.appendChild(this.render.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        this.camera.position.z = 5;
        const animate = () => {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            this.render.render(this.scene, this.camera);
        };

        animate();
    }
}

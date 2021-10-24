/**
* @Description: 渲染管理器
* @Author: wanggang
* @Date: 2021-10-24 20:23:39
* */
import * as THREE from 'three';

export default class RenderManager {
    constructor(parent) {
        this.app = parent;
        this.node = null;
        this.init();
    }

    init() {
        this.node = new THREE.WebGLRenderer();
        const { size } = this.app.dom;
        this.node.setSize(size.width, size.height);
        this.app.dom.node.appendChild(this.node.domElement);
        this.start_render();
    }

    // 开启渲染
    start_render() {
        this.node.render(this.app.scene.node, this.app.camera.node);
        requestAnimationFrame(this.start_render.bind(this));
    }
}

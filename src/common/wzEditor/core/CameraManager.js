/**
* @Description: 相机管理器
* @Author: wanggang
* @Date: 2021-10-24 20:19:55
* */
import * as THREE from 'three';

export default class CameraManager {
    constructor(parent) {
        this.app = parent;
        this.node = null;
        this.fov = 75;
        this.aspect = {};
        this.near = 0.1;
        this.far = 100;
        this.init();
    }

    init() {
        this.aspect = Object.assign(this.app.dom.size);
        this.node = new THREE.PerspectiveCamera(this.fov, this.aspect.width / this.aspect.height, this.near, this.far);
    }
}

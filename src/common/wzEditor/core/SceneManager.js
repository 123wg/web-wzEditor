/**
* @Description: 场景管理器
* @Author: wanggang
* @Date: 2021-10-24 20:24:09
* */
import * as THREE from 'three';

export default class SceneManager {
    constructor(parent) {
        this.app = parent;
        this.node = null;
        this.init();
    }

    init() {
        this.node = new THREE.Scene();
    }
}

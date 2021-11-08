/**
* @Description:一般的物体
* @Author: wanggang
* @Date: 2021-11-08 20:04:30
* */
// import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

class Substance {
    constructor(scene) {
        this.scene = scene;
        // this._pos = new THREE.Vector3(); // 初始的位置
        this._model_url = '';
        this._node = null;
    }

    // 创建模型
    _create_node() {
        return new Promise((resolve) => {
            const loader = new GLTFLoader();
            loader.load(this._model_url, (gltf) => {
                this._node = gltf.scene;
                resolve();
            });
        });
    }
}
export default Substance;

/**
* @Description:一般的物体
* @Author: wanggang
* @Date: 2021-11-08 20:04:30
* */
// import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

class Substance {
    constructor(scene) {
        this.scene = scene;
        this._model_url = '';
        this._node = new THREE.Group();
        this._node._type = 'Substance';
    }

    // 创建模型
    _create_node() {
        return new Promise((resolve) => {
            const file_type = this._model_url.substring(this._model_url.lastIndexOf('.') + 1);
            let loader = null;
            switch (file_type) {
                case 'gltf':
                    loader = new GLTFLoader();
                    loader.load(this._model_url, (gltf) => {
                        this._node = gltf.scene;
                        console.log(this._node);
                        resolve();
                    });
                    break;
                case 'fbx':
                    loader = new FBXLoader();
                    loader.load(this._model_url, (gltf) => {
                        this._node = gltf;
                        resolve();
                    });
                    break;
                default: break;
            }
        });
    }
}
export default Substance;

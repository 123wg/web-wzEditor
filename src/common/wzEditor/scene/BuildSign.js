/**
* @Description:建筑标识类
* @Author: wg
* @Date: 2021-11-09 09:07:05
* */
import * as THREE from 'three';

class BuildSign {
    constructor(scene) {
        this.scene = scene;
        this._node = new THREE.Group();
        this._node._type = 'BuildSign';
    }

    // 创建节点
    _create_node() {
        // 创建立方体盒子
        const geometry = new THREE.BoxGeometry(100, 20, 100);
        const material = new THREE.MeshLambertMaterial({
            color: '#47c2de',
            transparent: true,
            opacity: 0.6,
        });
        const box = new THREE.Mesh(geometry, material);
        // 创建文字
        const loader = new THREE.FontLoader();
        loader.load('/static/font/KaiTi_Regular.json', (font) => {
            const facade_text = new THREE.TextGeometry('建筑', {
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

            this._node.add(box, text_cube);

            text_cube.geometry.center();

            text_cube.position.y = 10;
            text_cube.rotation.set(-0.5 * Math.PI, 0, 0); // 几何体旋转的使用
        });
    }
}

export default BuildSign;

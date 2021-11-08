/**
* @Description: 围栏类
* @Author: wg
* @Date: 2021-11-08 15:54:57
* */
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

class Fence {
    constructor(scene) {
        this.scene = scene;
        this.node = new THREE.Group();
        this._start = new THREE.Vector3();
        this._end = new THREE.Vector3();
        this._node = new THREE.Group(); // 围栏节点
        this._model_url = '';// 模型地址
        // 原始模型对象
        this._model_obj = null;
    }

    // FIXME 加载模型 -将此部分剥离出去 做成工具类引入 可加载不同类型的模型
    _load_model() {
        return new Promise((resolve) => {
            const loader = new FBXLoader();
            loader.load(this._model_url, (obj) => {
                // FIXME 位置纠正 有些模型 不需要
                obj.traverse((item) => {
                    if (item.type === 'Mesh') {
                        item.rotation.z = Math.PI / 2;
                    }
                });
                this._model_obj = obj;
                const { max, min } = this._get_bounding_box();
                const per_height = max.y - min.y;
                this._model_obj.translateY(per_height / 2);
                resolve();
            });
        });
    }

    // 计算包围盒
    _get_bounding_box() {
        const box3 = new THREE.Box3();
        box3.expandByObject(this._model_obj);
        return box3;
    }

    // 创建围墙
    _create_node() {
        this._node.position.set(this._start.x, this._start.y, this._start.z);
        const { max, min } = this._get_bounding_box();
        const per_width = max.x - min.x;

        // 距离
        const dis = this._start.distanceTo(this._end);
        // 旋转角度
        // 计算旋转的角度
        const vec1 = new THREE.Vector3(1, 0, 0);
        const vec2 = this._end.clone().sub(this._start.clone());// 直接使用sub方法会改变之前的对象
        let angle = vec2.angleTo(vec1);
        const direc = vec2.cross(vec1).y;
        if (direc > 0) angle = 0 - angle;

        const number = dis / per_width;
        const number_bottom = Math.floor(number);// 计算阵列的数量
        const number_top = Math.ceil(number);

        for (let i = 0; i < number_top; i += 1) {
            const wrapper_group = new THREE.Group();
            const temp = this._model_obj.clone();
            temp.position.x = per_width / 2;
            wrapper_group.add(temp);
            wrapper_group.position.x = i * per_width;

            // 判断上下数量是否相等 不想等的情况下 缩放最后一个
            if (number_bottom !== number_top && i === number_top - 1) {
                wrapper_group.scale.x = number - number_bottom;
            }
            this._node.add(wrapper_group);
        }
        this._node.rotation.y = angle;
    }
}
export default Fence;

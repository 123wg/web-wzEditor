/**
* @Description: 墙 对象
* @Author: wg
* @Date: 2021-11-12 13:50:20
* */
import * as THREE from 'three';

// import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper'; // 法线辅助对象

class Wall {
    constructor(scene) {
        this.scene = scene;
        this.start = new THREE.Vector3();
        this.end = new THREE.Vector3();
        this.thick = 2; // 厚度
        this.heigth = 30;
        this.node = new THREE.Group();
        this.face_texture_url = '/static/img/wall.png';// 墙面贴图
        this.edge_texture_url = '/static/img/wall_side.png';// 边缘贴图
        this._init_material();
    }

    // 初始化贴图材质
    _init_material() {
        const loader = new THREE.TextureLoader();
        const face_texture = loader.load(this.face_texture_url);
        const edge_texture = loader.load(this.edge_texture_url);
        this.face_material = new THREE.MeshPhongMaterial({ map: face_texture });
        this.edge_material = new THREE.MeshPhongMaterial({ map: edge_texture });
    }

    // 计算基础属性
    _cal_base() {
        const { start, end } = this;
        start.y = 0;
        end.y = 0;
        const h_dir = new THREE.Vector3(0, this.heigth, 0);
        const down_dir = new THREE.Vector3(0, -1, 0); // 上下法向
        const up_dir = new THREE.Vector3(0, 1, 0);

        const line_dir1 = new THREE.Vector3(); // 两侧法向
        const line_dir2 = new THREE.Vector3();

        const normal_dir1 = new THREE.Vector3(); // 面法向
        const normal_dir2 = new THREE.Vector3();

        line_dir1.subVectors(end, start);
        line_dir1.normalize();
        line_dir2.copy(line_dir1.clone().negate());

        normal_dir1.crossVectors(down_dir, line_dir1);
        normal_dir1.normalize();
        normal_dir2.copy(normal_dir1.clone().negate());

        const half_tick = this.thick / 2;

        const r_len = normal_dir1.clone().multiplyScalar(half_tick);
        const l_len = normal_dir2.clone().multiplyScalar(half_tick);
        const l_b = start.clone().add(r_len); // 顶点数据
        const r_b = end.clone().add(r_len);
        const l_t = start.clone().add(l_len);
        const r_t = end.clone().add(l_len);

        const plan_v = [l_b, r_b, r_t, l_t];
        const top_v = plan_v.map((item) => item.clone().add(h_dir));
        const vertices = [...plan_v, ...top_v];
        vertices.map((item) => item.toArray());

        const normals = [up_dir, down_dir, line_dir2, line_dir1, normal_dir1, normal_dir2]; // 上下左右前后
        normals.map((item) => item.toArray());

        const vertices_1 = [ // right
            ...vertices[0], ...vertices[1], ...vertices[5], ...vertices[4],
        ];
        const vertices_2 = [ // left
            ...vertices[2], ...vertices[3], ...vertices[7], ...vertices[6],
        ];
        const vertices_3 = [
            ...vertices[7], ...vertices[4], ...vertices[5], ...vertices[6], // 上
            ...vertices[3], ...vertices[2], ...vertices[1], ...vertices[0], // 下
            ...vertices[7], ...vertices[3], ...vertices[0], ...vertices[4], // 左
            ...vertices[5], ...vertices[1], ...vertices[2], ...vertices[6], // 右
        ];

        const normal_1 = [...normals[4], ...normals[4], ...normals[4], ...normals[4]];
        const normal_2 = [...normals[5], ...normals[5], ...normals[5], ...normals[5]];
        const normal_3 = [
            ...normals[0], ...normals[0], ...normals[0], ...normals[0],
            ...normals[1], ...normals[1], ...normals[1], ...normals[1],
            ...normals[2], ...normals[2], ...normals[2], ...normals[2],
            ...normals[3], ...normals[3], ...normals[3], ...normals[3],
        ];

        const index_1 = [
            0, 1, 2,
            0, 2, 3,
        ];
        const index_2 = index_1;
        const index_3 = [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
        ];
        const uv_1 = [
            0, 0,
            1, 0,
            1, 1,
            0, 1,
        ];
        const uv_2 = uv_1;
        const uv_3 = [
            ...uv_1,
            ...uv_1,
            ...uv_1,
            ...uv_1,
        ];

        this.right_face = {
            vertices: vertices_1,
            index: index_1,
            normal: normal_1,
            uv: uv_1,
            material: this.face_material,
        };
        this.left_face = {
            vertices: vertices_2,
            index: index_2,
            normal: normal_2,
            uv: uv_2,
            material: this.face_material,
        };
        this.edge_face = {
            vertices: vertices_3,
            index: index_3,
            normal: normal_3,
            uv: uv_3,
            material: this.edge_material,
        };
    }

    // 创建左侧面和右侧面
    _init_mesh(mesh) {
        const face_geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array(mesh.vertices);
        const index = new Uint16Array(mesh.index);
        const normal = new Float32Array(mesh.normal);
        const uv = new Float32Array(mesh.uv);
        face_geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);
        face_geometry.attributes.normal = new THREE.BufferAttribute(normal, 3);
        face_geometry.index = new THREE.BufferAttribute(index, 1);
        face_geometry.attributes.uv = new THREE.BufferAttribute(uv, 2);
        const cube = new THREE.Mesh(face_geometry, mesh.material);
        return cube;
    }

    // 创建节点
    _create_node() {
        this.node.remove(...this.node.children);
        this._cal_base();// 计算基础属性
        this.left_mesh = this._init_mesh(this.left_face);
        this.right_mesh = this._init_mesh(this.right_face);
        this.edge_mesh = this._init_mesh(this.edge_face);
        this.node.add(this.left_mesh, this.right_mesh, this.edge_mesh);
    }
}

export default Wall;

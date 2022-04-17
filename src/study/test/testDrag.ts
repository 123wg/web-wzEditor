import * as THREE from 'three';
import {
    AxesHelper,
    BufferGeometry, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, PlaneBufferGeometry, PlaneGeometry, Points, PointsMaterial, Quaternion, Vector3,
} from 'three';
import { CLineSegments } from '../primitives/CLineSegments';
import { CPoint, CPointAttrs } from '../primitives/CPoint';
// import { DragControls } from '@/study/util/DragControl';
import BaseCad from '../ThreeBase';
import DragControl from '../util/DragControls';

export default class Cad extends BaseCad {
    constructor() {
        super();
        this.get_dom();
        this.init_scene();
        this.init_camera();
        this.init_light();
        this.init_render();
        this.start_render();
        this.init_control();
        this.on_resize();
        this.add_axis();
        // this.add_plane();
        // this.test_drag();
        // this.test_line();
        // 测试加载stl
        // 测试加载

        // 测试平面旋转
        this.test_rotate();
    }

    add_axis() {
        const axis = new AxesHelper(20);
        this.scene.add(axis);
    }

    test_rotate() {
        console.log('测试平面旋转');
        const geometry = new PlaneGeometry(20, 30);
        const material = new MeshBasicMaterial({
            color: 'pink',
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
        });
        const plane = new Mesh(geometry, material);

        const normal = new Vector3(2, 3, 0).normalize();

        const position = new Vector3(10, 10, 3);
        const matrix = new Matrix4().makeRotationFromQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal)).setPosition(position);

        plane.applyMatrix4(matrix);
        this.scene.add(plane);

        // 测试绕着法向 旋转90度
        const angle = Math.PI / 2;
        setInterval(() => {
            plane.rotateOnWorldAxis(normal, angle);
            console.log('111');
            plane.updateMatrixWorld();
        }, 100);
    }

    /* 添加参考平面 */
    add_plane() {
        const material = new THREE.MeshBasicMaterial({
            color: 'red',
            side: THREE.DoubleSide,
        });
        const plane = new THREE.PlaneBufferGeometry(30, 30);
        const mesh = new THREE.Mesh(plane, material);
        mesh.rotateY(Math.PI / 2);
        this.scene.add(mesh);
    }

    /* 测试拖拽 */
    test_drag() {
        const box = new THREE.BoxBufferGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({ color: 'green' });
        const mesh = new THREE.Mesh(box, material);
        mesh.position.set(1, 0, 0);
        this.scene.add(mesh);

        // 添加拖拽控制器
        const controls = new DragControl([mesh], this.camera, this.dom);
        controls.addEventListener('dragstart', (event) => {
            console.log(event.object);
            // event.object.material.emissive.set( 0xaaaaaa );
        });
    }

    /* 测试CPoint 和 CLineSegment类 */
    test_line() {
        const point1 = new Vector3(2, 0, 0);
        const point2 = new Vector3(10, 5, 0);
        const line = new CLineSegments({
            vertexs: [point1, point2],
            lineWidth: 2,
            // multistage: false,
        });
        const aaa = line.getPointByIndex([0, 1]) as Array<CPoint>;

        aaa.forEach((p:CPoint) => {
            p.visible = true;
        });
        this.scene.add(line);
    }
}

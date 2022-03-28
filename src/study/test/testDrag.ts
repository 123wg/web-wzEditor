import * as THREE from 'three';
import { Vector3 } from 'three';
import { CPoint, CPointAttrs } from '../primitives/CPoint';
import { DragControls } from '@/study/util/DragControl';
import BaseCad from '../ThreeBase';

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
        this.add_plane();
        this.init_arrow();
        this.test_line();
        // TODO 绘制点
        this.draw_point();
        // TODO 绘制直线
        // TODO 绘制矩形
        // TODO 绘制圆弧
        // TODO 绘制椭圆
        // TODO 绘制六边形
        // TODO 绘制marker
        // TODO 绘制input框
    }

    add_plane() {
        const material = new THREE.MeshBasicMaterial({
            color: 'red',
            // transparent: true,
            // opacity: 0.3,
            side: THREE.DoubleSide,
        });
        const plane = new THREE.PlaneBufferGeometry(30, 30);
        const mesh = new THREE.Mesh(plane, material);
        mesh.rotateY(Math.PI / 2);
        this.scene.add(mesh);
    }

    init_arrow() {
        const box = new THREE.BoxBufferGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({ color: 'green' });
        const mesh = new THREE.Mesh(box, material);
        mesh.position.set(1, 0, 0);
        this.scene.add(mesh);

        // 添加拖拽控制器
        const controls = new DragControls([mesh], this.camera, this.dom);
        controls.addEventListener('dragstart', (event) => {
            console.log(event.object);
            // event.object.material.emissive.set( 0xaaaaaa );
        });
    }

    // three自带的Line 与 LineSigments
    test_line() {
        const material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
        });

        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 10, 0),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(10, 20, 0),
        );

        const line = new THREE.LineSegments(geometry, material);
        this.scene.add(line);
    }

    // 绘制点
    draw_point() {
        const attrs:CPointAttrs = {
            vertex: new Vector3(5, 5, 5),
            color: 0xff45b4,
            size: 8,
            state: 'default',
        };
        const point = new CPoint(attrs);
        this.scene.add(point);
    }
}

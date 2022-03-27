// import { Vector3 } from 'three';
import * as THREE from 'three';
import { DragControls } from '@/study/util/DragControl';
// import { DragControls } from 'three/examples/jsm/controls/DragControls';
// import DragControlNew from '@/study/util/DragControlsNew';
import BaseCad from '../ThreeBase';
// import ManipulatorArrowControl from '../figure/ManipulatorArrowControl';
// 拖放控制器
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
        // this.add_box();
        this.init_arrow();

        // this.test_cylinder();
    }

    protected add_box() {
        const geometry = new THREE.BoxBufferGeometry(2, 1, 1);
        geometry.translate(-1, 0, 0);
        const material = new THREE.MeshLambertMaterial({
            color: 'red',
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 4;
        console.log(mesh.position);
        this.scene.add(mesh);
        mesh.scale.set(2, 1, 1);

        const box = new THREE.BoxHelper(mesh, 0xffff00);
        this.scene.add(box);

        // const geometry1 = new THREE.BoxBufferGeometry(2, 2, 2);
        // geometry1.translate(3, 0, 0);
        // const material1 = new THREE.MeshLambertMaterial({
        //     color: 'red',
        // });
        // const mesh1 = new THREE.Mesh(geometry1, material1);
        // this.scene.add(mesh1);
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
        // const dir = new Vector3(1, 0, 0);
        // const origin = new Vector3(0, 0, 0);
        // const hex = 0x19669e;
        // const length = 2;
        // const headLength = 1;
        // const headWidth = 1;

        // const arrow = new ManipulatorArrowControl(dir, origin, length, hex, headLength, headWidth);
        // this.scene.add(arrow);

        // let box = new THREE.BoxHelper(arrow, 0xffff00);
        // this.scene.add(box);
        // const group = new THREE.Group();
        // group.position.set(5, 3, 1);

        const box = new THREE.BoxBufferGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({ color: 'green' });
        const mesh = new THREE.Mesh(box, material);
        mesh.position.set(1, 0, 0);
        this.scene.add(mesh);
        // this.scene.add(mesh)

        // group.add(mesh);
        // this.scene.add(group);

        // 添加拖拽控制器

        const controls = new DragControls([mesh], this.camera, this.dom);
        controls.addEventListener('dragstart', (event) => {
            console.log(event.object);
            // event.object.material.emissive.set( 0xaaaaaa );
        });

        // controls.addEventListener('drag', () => {
        //     console.log('拖拽中');
        // });

        // controls.addEventListener('dragend', (event) => {
        //     console.log(event.object);
        // });
    }

    test_cylinder() {
        const cylinderGeom = new THREE.CylinderBufferGeometry(0, 0.5, 1, 20, 1);
        // cylinderGeom.translate(0, -0.5, 0);
        const material = new THREE.MeshLambertMaterial({
            color: 'green',
        });
        const mesh = new THREE.Mesh(cylinderGeom, material);

        mesh.scale.set(1, 2, 1);
        this.scene.add(mesh);

        // let sphere = new THREE.SphereGeometry(0.5);
        // let object = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({
        //     color: 'yellow',
        // }));
        // let box = new THREE.BoxHelper(mesh, 0xffff00);
        // this.scene.add(box);
    }
}

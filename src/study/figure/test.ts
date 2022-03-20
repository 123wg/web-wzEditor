import * as THREE from 'three';
import BaseCad from '../index';

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
        this.add_box();
    }

    add_box() {
        const geometry = new THREE.BoxGeometry(10, 10, 10);
        const material = new THREE.MeshLambertMaterial({
            color: 'red',
        });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
    }
}

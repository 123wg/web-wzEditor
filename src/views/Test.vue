<template>
    <div class='test'>
        <button @click="change">切换</button>
        <button @click="exportFile">导出</button>
        <canvas id="three" ref="canvas"></canvas>
    </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

export default {
    components: {},
    data() {
        return {
            cur: 0,
        };
    },
    computed: {},
    watch: {},
    created() {
        this.init();
    },
    mounted() {
        this.init();
    },
    unmounted() {},
    methods: {
        init() {
            this.init_scene();//  初始化场景
            this.init_camera();//  初始化相机
            this.init_renderer();//  初始化渲染器
            this.start_render();
            this.on_resize();
            this.addBox();
        },

        addBox() {
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const cube = new THREE.Mesh(geometry, material);
            cube.name = '第一个';
            this.scene.add(cube);
        },

        addLine() {
            const geometry = new THREE.BoxGeometry(3, 1, 1);
            const material = new THREE.MeshBasicMaterial({ color: '#ff4d4d' });
            const cube = new THREE.Mesh(geometry, material);
            const a = Math.random() * 5;
            cube.name = a;
            this.scene.add(cube);
        },

        change() {
            if (this.cur === 0) {
                this.scene = this.scene2;
                this.cur = 1;
                this.addLine();
            } else {
                this.scene = this.scene1;
                this.cur = 0;
            }
        },

        init_scene() {
            this.scene2 = new THREE.Scene();
            this.scene1 = new THREE.Scene();
            this.scene = this.scene1;
        },

        init_camera() {
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
            this.camera.position.x = 0;
            this.camera.position.z = 30;
            this.camera.position.y = 10;
        },

        init_renderer() {
            const { canvas } = this.$refs;
            this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },

        start_render() {
        // FIXME requestAnimationFrame this指向问题
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(this.start_render.bind(this));
        },

        on_resize() {
            const resizeFun = () => {
                this.renderer.setSize(window.innerWidth, window.innerHeight);
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
            };
            window.addEventListener('resize', resizeFun, false);
        },
        save(blob, filename) {
            const link = document.createElement('a');
            link.style.display = 'none';
            document.body.appendChild(link); // Firefox workaround, see #6594
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
        },
        saveString(text, filename) {
            this.save(new Blob([text], { type: 'text/plain' }), filename);
        },
        exportFile() {
            this.exportGLTF([this.scene1, this.scene2]);
        },
        exportGLTF(input) {
            const gltfExporter = new GLTFExporter();

            const options = {
                trs: false,
                onlyVisible: true,
                truncateDrawRange: true,
                binary: false,
                maxTextureSize: 4096,
            };
            gltfExporter.parse(input, (result) => {
                if (result instanceof ArrayBuffer) {
                    this.saveArrayBuffer(result, 'scene.glb');
                } else {
                    const output = JSON.stringify(result, null, 2);
                    console.log(output);
                    this.saveString(output, 'scene.gltf');
                }
            }, options);
        },
        saveArrayBuffer(buffer, filename) {
            this.save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
        },

    },
};
</script>
<style lang='scss' scoped>
.test {
    width: 100%;
    height: 100%;
}

#three {
    width: 100%;
    height: 100%;
}
</style>

<template>
    <div class='yt-three' id="yt-three"></div>
</template>

<script lang="ts">
import Cad from '@/study/test/testDrag';
export default {
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.init();
    },
    unmounted() {},
    methods: {
        init() {
            (window as any).yt = new Cad();
            console.log((window as any).yt);
        },
    },
};
</script>
<style lang='scss' scoped>
.yt-three{
    width: 100%;
    height: 100%;
}
</style>

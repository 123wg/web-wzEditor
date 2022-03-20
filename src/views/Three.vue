<template>
    <div class='yt-three' id="yt-three"></div>
</template>

<script>
import Cad from '@/study/figure/test';

export default {
    components: {},
    data() {
        return {

        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        this.init();
    },
    unmounted() {},
    methods: {
        init() {
            const yt = new Cad();
            console.log(yt);
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

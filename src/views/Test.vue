<template>
    <div class='editor-main' id="editor-main"></div>
</template>

<script>
import WzScene from '@/common/wzEditor/scene/WzScene';

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
        wzEditor = new WzScene();
    },
    unmounted() {},
    methods: {},
};
</script>
<style lang='scss' scoped>
.editor-main{
    width: 100%;
    height: 100%;
}
</style>

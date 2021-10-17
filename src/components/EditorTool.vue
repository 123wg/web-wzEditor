<template>
    <div class="editor-tool">
        <div class="tool-left"></div>
        <div class="tool-middle">
            三维可视化编辑器
        </div>
        <div class="tool-right"></div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'EditorTool',
    components: {},
    data() {
        return {

        };
    },
});
</script>
<style lang='scss' scoped>
// 工具区
.editor-tool {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    font-size: 40px;
    color: white;
    background: #303131;
    border-bottom: 1px solid rgba(151,151,151,0.21);
}
</style>

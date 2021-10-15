<template>
    <div class="editor-tool">
        上方工具区
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
    height: 70px;
    background: #303131;
    border-bottom: 1px solid rgba(151,151,151,0.21);
}
</style>

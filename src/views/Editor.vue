<template>
    <EditorTool></EditorTool>
    <div class="editor-panel">
        <EditorMaterial></EditorMaterial>
        <EditorMain></EditorMain>
        <EditorPlugin v-if="show_editor_plugin"></EditorPlugin>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import WzEditor from '../common/wzEditor/WzEditor';
import EditorMain from '@/components/EditorMain.vue';
import EditorTool from '@/components/EditorTool.vue';
import EditorMaterial from '@/components/EditorMaterial.vue';
import EditorPlugin from '@/components/EditorPlugin.vue';

export default defineComponent({
    components: {
        EditorMain, EditorTool, EditorMaterial, EditorPlugin,
    },
    data() {
        return {

        };
    },
    computed: {
        show_editor_plugin() {
            return this.$store.state.editor.show_editor_plugin;
        },
    },
    created() {
        console.log('我才刚开始');
    },
    mounted() {
        wzEditor = new WzEditor();
        wzEditor.init();
    },
});
</script>
<style lang='scss' scoped>
.editor-panel {
    position: relative;
    display: flex;
    height: calc(100% - 70px);
    justify-content: space-between;
}
</style>

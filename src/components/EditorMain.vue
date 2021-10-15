/**
* @Description: 核心区组件
* @Author: wg
* @Date: 2021-10-15 11:11:28
**/
<template>
    <div class='editor-main'>我是中间核心区</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    components: {},
    data() {
        return {

        };
    },
});
</script>
<style lang='scss' scoped>
.editor-main {
    width: calc(100% - 300px);
}
</style>

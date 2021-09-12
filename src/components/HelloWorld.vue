<script>
import {
    defineComponent,
} from 'vue';

export default defineComponent({
    name: 'ContextMenu',
    computed: {
        user() {
            return this.$store.state.user.name;
        },
    },
    created() {
        console.log(this.user);
    },
});
</script>

<template>
  <div>111</div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>

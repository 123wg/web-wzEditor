<template>
    <div>111</div>
</template>

<script>
import {
    defineComponent,
} from 'vue';

export default defineComponent({
    name: 'HelloWorld',
    computed: {
        user() {
            return this.$store.state.user.name;
        },
    },
    created() {
        // console.log(this.user);
    },
});
</script>

<style scoped>
a {
  color: #42b983;
}
</style>

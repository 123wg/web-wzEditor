<script>
import {
  defineComponent,
} from 'vue'
export default defineComponent({
  name: 'ContextMenu',
  computed:{
    user(){
      return this.$store.state.user.name
    }
  },
  created(){
    console.log(this.user)
  }
})
</script>

<template>
 1111
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
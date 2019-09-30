<template>
  <div>
    <br/>
    <br/>
    <br/>
    <h2 class="text-center">您没有操作权限</h2>
  </div>
</template>

<script>
    export default {
      name: "PermError",
      mounted() {
        this.$emit('sideBarClose'); // sideBarClose:菜单栏隐藏
      }
    }
</script>

<style scoped>

</style>

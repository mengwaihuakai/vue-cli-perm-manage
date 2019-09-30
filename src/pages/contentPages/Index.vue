<template>
  <div>
    <br/>
    <br/>
    <br/>
    <h2 class="text-center">W&nbsp;E&nbsp;L&nbsp;C&nbsp;O&nbsp;M&nbsp;E</h2>
  </div>
</template>

<script>
    export default {
      name: "Index",
      mounted() {
        this.$emit('sideBarClose'); // sideBarClose:菜单栏隐藏
      }
    }
</script>

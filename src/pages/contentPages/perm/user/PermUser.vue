<template>
  <div>
    permuser
  </div>
</template>

<script>
    export default {
      name: "PermUser",
      mouted () {
        //1、左侧菜单栏对应选中
        document.querySelector("#permUser").classList.add("active");
        //2、面包屑
        document.querySelector("#breadcrumbModule").textContent = "User Manage";
        document.querySelector("#breadcrumbPage").classList.add("hide");
      }
    }
</script>

<style scoped>

</style>

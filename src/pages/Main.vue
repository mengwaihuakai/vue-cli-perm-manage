<template>
  <div>
    <header class="main-header">
      <nav class="navbar navbar-static-top">
        <span class="menu-icon" id="menuIcon">
            <i class="el-icon-s-unfold"></i>
        </span>
        <span class="logo">
            SUBSCRIBE
        </span>
        <ol class="breadcrumb" id="breadcrumb">
          <li id="breadcrumbModule"></li>
          <li id="breadcrumbModuleSec" class="hide"></li>
          <li class="active" id="breadcrumbPage"></li>
        </ol>
        <span class="login-info float-right">
            <a @click="logout">Logout</a>
      </span>
        <span class="user-info float-right">
            {{getAccount}}<!--获取vuex中的属性-->
      </span>
      </nav>
    </header>
    <aside class="main-sidebar">
      <section class="sidebar">
        <ul class="sidebar-menu">

          <li class="treeview" id="perm">
            <p>
              <img class="menu-icon" src="../assets/images/menu/perm-icon.svg">
              <span>Permission</span>
            </p>
            <ul>
              <li class="treeview-item" id="permUser">
                <a href="/perm/user/permUser">
                  <span>User Manage</span>
                </a>
              </li>
              <li class="treeview-item" id="permRole">
                <a href="/perm/role/permRole">
                  <span>Role Manage</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <div style="width: 100%; height: 100px"></div>
    </aside>
  </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
      name: "Main",
      computed: {
        ...mapGetters(['getAccount']),
      },
      methods: {
        ...mapActions(['truncatState']),
        logout () {
          let vm = this;
          vm.api.post("logout")
            .then((r) => {
              document.cookie = "";
              window.localStorage.removeItem('store');
              vm.truncatState();
              vm.$router.push({path: '/login'});
            })
            .catch((e) => {
              document.cookie = "";
              window.localStorage.removeItem('store');
              vm.truncatState();
              vm.$router.push({path: '/login'});
            })
        }
      },
      mounted () {
        document.querySelector("#menuIcon").addEventListener("click", function () {
          document.querySelector("body").classList.toggle("sidebar-close");
        });
      }
    }
</script>

<style scoped>
  @import '../assets/sass/common.scss';
</style>

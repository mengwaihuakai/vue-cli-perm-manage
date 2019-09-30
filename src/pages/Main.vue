<template>
  <div class="main-page sidebar-close">
    <header class="main-header">
      <nav class="navbar navbar-static-top">
        <span class="menu-icon" id="menuIcon">
            <i class="el-icon-s-unfold"></i>
        </span>
        <span class="logo">
            SUBSCRIBE
        </span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, index) in $route.meta.breadcrumb" :key="index">
            <router-link v-if="item.url" :to="item.url">{{item.name}}</router-link>
            <a v-else>
              {{item.name}}
            </a>
          </el-breadcrumb-item>
        </el-breadcrumb>
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

          <li class="treeview" v-if="containsPerms(['perm_user', 'perm_role'])">
            <p>
              <img class="menu-icon" src="../assets/images/menu/perm-icon.svg">
              <span>Permission</span>
            </p>
            <ul>
              <li class="treeview-item" v-if="containsPerms(['perm_user'])">
                <router-link to="/perm/user/permUser">
                  <span>User Manage</span>
                </router-link>
              </li>
              <li class="treeview-item" v-if="containsPerms(['perm_role'])">
                <router-link to="/perm/role/permRole">
                  <span>Role Manage</span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <div style="width: 100%; height: 100px"></div>
    </aside>
    <div class="content">
      <router-view></router-view>
      <div style="width: 100%; height: 30px"></div>
    </div>
  </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
      name: "Main",
      computed: {
        ...mapGetters(['getAccount', 'getPerms'])
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
        },
        containsPerms (perms) {
          let vm = this;
          return perms.some(item => {
            return vm.getPerms.includes(item)
          })
        }
      },
      mounted () {
        document.querySelector("#menuIcon").addEventListener("click", function () {
          document.querySelector(".main-page").classList.toggle("sidebar-close");
        });
      }
    }
</script>

<style scoped>
  @import '../assets/sass/common.scss';
</style>

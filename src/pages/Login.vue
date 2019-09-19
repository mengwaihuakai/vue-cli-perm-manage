<template>
  <div class="container">
    <h2>ADX</h2>
    <el-form :model="login" :rules="rules" ref='loginForm'>
      <el-form-item label="" prop="account">
        <i class="icon el-icon-user-solid"></i>
        <el-input autocomplete="off" v-model="login.account" clearable @focus="focus" placeholder="Please input account"></el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <i class="icon el-icon-lock"></i>
        <el-input :type="pwdValShow ? 'text' : 'password'" v-model="login.password" @focus="focus" autocomplete="off"  placeholder="Please input password"></el-input>
        <i class="icon-pwd el-icon-view" v-show="!!login.password" @click="pwdValShow = !pwdValShow"></i>
      </el-form-item>
      <el-row class="hint"><small>{{hint}}</small></el-row>
      <el-row>
        <el-button type="primary" size="small" class="login_btn" @click="submitForm('loginForm')">LOGIN</el-button>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  let ref = null;

  export default {
        name: "Login",
        data(){
          return {
            login: {
              account: '',
              password: '',
            },
            pwdValShow: false,
            hint: '',
            rules: {
              account: [
                {required: true, message: '用户名不能为空'},
              ],
              password: [
                {required: true, message: '密码不能为空'},
              ]
            }
          }
        },
        mounted: function () {
          ref = this.$refs;
        },
        methods: {
          focus: () => {
            app.hint = '';
          },
          submitForm: formName => {
            app.hint = '';
            let vm = this;
            ref[formName].validate((valid) => {
              if (valid) {
                console.log(vm.api)
                vm.api.post("tologin", app.login)
                  .then((r) => {
                    if (r.data.code === 0) {
                      window.location.href = "/";
                    } else {
                      app.hint = r.data.message;
                    }
                  })
                  .catch((e) => {
                    app.hint = r.data.message;
                  })
              }
            })
          }
        }
    }
</script>

<style lang="scss">
  #app{
    background: url(../assets/images/login/bg.jpg) repeat;
    color: #fff;
    font-family: "微软雅黑";
    font-size: 14px;
  }

  @media (max-width: 767px) {
    .el-form {
      padding: 30px 40px;
    }
  }

  .el-form{
    background: url(../assets/images/login/main_bg.png) repeat;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    float: none;
    border-radius: 8px;
    padding: 50px;

    .el-form-item__error {
      position: relative;
      color: #f60507;
    }

    .el-input__inner {
      height: 45px;
      padding-left: 40px;
    }

    .el-form-item.is-error .el-input__inner,
    .el-form-item.is-error .el-input__inner:focus,
    .el-form-item.is-error .el-textarea__inner,
    .el-form-item.is-error .el-textarea__inner:focus,
    .el-message-box__input input.invalid,
    .el-message-box__input input.invalid:focus {
      border-color: #3872f6;
    }
  }

</style>

<style scoped>
  @media (max-width: 767px) {
    .container {
      width: 80vw;
    }
  }

  .container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 500px;
    height: 500px;
  }

  .hint{
    color: #3872f6;
    font-size: 14px;
  }

  .icon-pwd{
    position: absolute;
    top: 14px;
    z-index: 100;
    right: 10px;
    font-size: 18px;
    color: #c0c4cc;
    cursor: pointer;
  }

  h2{
    text-align: center;
    font-size: 30px
  }

  .icon{
    position: absolute;
    display: inline-block;
    z-index: 10;
    font-size: 24px;
    left: 12px;
    top: 10px;
    color: #3872f6;
  }

  .login_btn {
    display: block;
    background: #3872f6!important;
    color: #fff;
    font-size: 15px;
    width: 100%;
    line-height: 40px;
    border-radius: 3px;
    border: none;
  }

  .login_btn:hover, .login_btn:active{
    background: #3872f6;
    color: #fff;
    opacity: 0.6;
  }

  footer{
    position: fixed;
    width: 100%;
    bottom: 0;
    color: #444444;
    text-align: center;
  }
</style>

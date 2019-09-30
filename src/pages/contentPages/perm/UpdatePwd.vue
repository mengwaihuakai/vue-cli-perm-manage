<template>
  <div class="form form-inline-center">
    <el-form :model="updatePwd" :rules="rules" ref='updatePwd' label-width="160px" label-position="right">
      <el-form-item label="Account" prop="account">
        <el-input v-model="updatePwd.account" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="New Password" prop="password">
        <el-input type="password" v-model="updatePwd.password" clearable></el-input>
      </el-form-item>
      <el-form-item label="Confirm Pwd" prop="confirmPwd">
        <el-input type="password" v-model="updatePwd.confirmPwd" clearable></el-input>
      </el-form-item>
    </el-form>

    <el-row class="operate-row text-center">
      <el-button type="primary" @click="submitForm('updatePwd')">Save</el-button>
      <el-button @click="resetForm('updatePwd')" class="reset">Reset</el-button>
    </el-row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  let ref;

  export default {
    name: "UpdatePwd",
    computed: {
      ...mapGetters(['getAccount'])
    },
    data () {
      return {
        updatePwd: {
          account: null,
          password: null,
          confirmPwd: null
        },
        rules: {
          account: [
            {required: true, message: 'cannot be bull'},
            {min: 1, max: 50, message: 'cannot more than 50 characters'}
          ],
          password: [
            {required: true, message: 'cannot be bull'},
            {min: 1, max: 100, message: 'cannot more than 100 characters'}
          ],
          confirmPwd: [
            {required: true, message: 'cannot be bull'},
            {min: 1, max: 100, message: 'cannot more than 100 characters'},
            {validator: (rule, value, callback) => {
                if (value && value !== this.updatePwd.password) {
                  callback(new Error('the two password is inconsistent'));
                } else {
                  callback();
                }
              }}
          ]
        }
      }
    },
    mounted (){
      ref = this.$refs;
      this.updatePwd.account = this.getAccount
    },
    methods: {
      submitForm (formName) {
        let vm = this;
        ref[formName].validate((valid) => {
          if (valid) {
            vm.api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            vm.api.post("perm/user/updatePwd", vm.$qs.stringify(vm.updatePwd, { arrayFormat: 'repeat' }))
              .then((r) => {
                vm.loading = false;
                if (r.data.code === 0){
                  vm.$alert('重置密码成功', {
                    center: true,
                    callback: action => {
                      vm.$router.push({path: 'index'})
                    }
                  });
                } else {
                  vm.$alert('重置密码失败', {
                    center: true,
                    callback: action => {}
                  })
                }
              })
              .catch((e) => {
                vm.loading = false;
                vm.$alert('' + e, '数据保存异常', {
                  center: true,
                  callback: action => {}
                })
              })
          } else {
            return false;
          }
        });
      },
      resetForm: formName =>{
        ref[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>

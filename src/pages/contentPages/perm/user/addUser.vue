<template>
  <div class="form form-inline-center">
    <el-form :model="user" :rules="rules" ref='user' label-width="160px" label-position="right">
      <el-form-item label="Account" prop="account">
        <el-input v-model="user.account" clearable></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="user.password" clearable></el-input>
      </el-form-item>
      <el-form-item label="Confirm Pwd" prop="confirmPwd">
        <el-input type="password" v-model="user.confirmPwd" clearable></el-input>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="user.status">
          <el-radio v-for="item of statusRadio" :label="item.value" :key="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Role List" prop="roleIdArr">
        <el-checkbox-group v-model="user.roleIdArr">
          <el-checkbox v-for="item of roleCheckbox" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>

    <el-row class="operate-row text-center">
      <el-button type="primary" @click="submitForm('user')">Create</el-button>
      <el-button @click="resetForm('user')" class="reset">Reset</el-button>
    </el-row>
  </div>
</template>

<script>
  let ref;
  export default {
    name: "AddUser",
    data () {
      return {
        user: {
          account: null,
          password: null,
          confirmPwd: null,
          status: null,
          roleIdArr: []
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
                if (value && value !== this.user.password) {
                  callback(new Error('the two password is inconsistent'));
                } else {
                  callback();
                }
              }}
          ],
          status: [
            {required: true, message: 'cannot be bull'},
          ],
          roleIdArr: [
            {required: true, message: 'cannot be bull', type: 'array'},
          ]
        },
        statusRadio: [
          {
            label: 'Valid',
            value: 0
          },
          {
            label: 'Invalid',
            value: 1
          },
          {
            label: 'Frozen',
            value: 2
          }
        ],
        roleCheckbox: []
      }
    },
    mounted (){
      ref = this.$refs;
      this.$emit('sideBarClose'); // sideBarClose:菜单栏隐藏
      this.getRoleList();
    },
    methods: {
      submitForm (formName) {
        let vm = this;
        ref[formName].validate((valid) => {
          if (valid) {
            vm.api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
            vm.api.post("perm/user/addUser", vm.$qs.stringify(vm.user, { arrayFormat: 'repeat' }))
              .then((r) => {
                vm.loading = false;
                if (r.data.code === 0){
                  vm.$alert('创建user成功', {
                    center: true,
                    callback: action => {
                      vm.$router.push({path: 'permUser'})
                    }
                  });
                } else {
                  vm.$alert('创建user失败', {
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
      },
      getRoleList () {
        let vm = this;
        vm.loading = true;
        vm.api.get("/perm/user/getRoleListAndUserInfo")
          .then((r) => {
            vm.loading = false;
            if (r.data.code === 0){
              vm.roleCheckbox = r.data.resultMap.roleList;
              if (!vm.roleCheckbox || vm.roleCheckbox.length === 0){
                vm.$alert('请先在角色管理模块 创建角色', {
                  center: true,
                  callback: action => {}
                })
              }
            } else {
              vm.$alert('页面数据获取失败', {
                center: true,
                callback: action => {}
              })
            }
          })
          .catch((e) => {
            vm.loading = false;
            vm.$alert('' + e, '页面数据获取异常', {
              center: true,
              callback: action => {}
            })
          })
      }
    }
  }
</script>

<style scoped>

</style>

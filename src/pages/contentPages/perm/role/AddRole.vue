<template>
  <div class="form form-inline-center">
    <el-form :model="role" :rules="rules" ref='role' label-width="150px" label-position="right">
      <el-form-item label="Name" prop="name">
        <el-input v-model="role.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="Code" prop="code">
        <el-input v-model="role.code" clearable></el-input>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio-group v-model="role.status">
          <el-radio v-for="item of statusRadio" :label="item.value" :key="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Permission List" prop="permissionIdArr">
        <el-table :data="permissionTableData" ref="permissionTable" width="100%">
          <el-table-column key="fatherName" prop="fatherName" label="Father Menu"></el-table-column>
          <el-table-column key="all" prop="" label="Child Menu">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.all" label="all" key="all"
                           @change="selectAll(scope.row.fatherCode, scope.row.all)">
                All
              </el-checkbox>
            </template>
          </el-table-column>
          <el-table-column key="childPermList" prop="childPermList" label="">
            <template slot-scope="scope">
              <el-checkbox-group v-model="role.permissionIdArr">
                <el-checkbox v-for="item of scope.row.childPermList" :label="item.id" :key="item.id"
                             @change="selectOne(scope.row.fatherCode, item.id)">
                  {{item.name}}
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

    </el-form>

    <el-row class="operate-row text-center">
      <el-button type="primary" @click="submitForm('role')">Save</el-button>
      <el-button @click="resetForm('role')" class="reset">Reset</el-button>
    </el-row>
  </div>
</template>

<script>
  let ref;
  export default {
    name: "AddRole",
    data () {
      return {
        role: {
          name: null,
          code: null,
          status: null,
          permissionIdArr: []
        },
        rules: {
          name: [
            {required: true, message: 'cannot be bull'},
            {min: 1, max: 100, message: 'cannot more than 100 characters'}
          ],
          code: [
            {required: true, message: 'cannot be bull'},
            {min: 1, max: 100, message: 'cannot more than 100 characters'}
          ],
          status: [
            {required: true, message: 'cannot be bull'},
          ],
          permissionIdArr: [
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
        permissionTableData: []
      }
    },
    mounted (){
      ref = this.$refs;
      //组织permlisttable数据
      this.getRoleList();
    },
    methods: {
      submitForm (formName) {
        let vm = this;
        ref[formName].validate((valid) => {
          if (valid) {
            vm.api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
            vm.api.post("perm/role/addRole", vm.$qs.stringify(vm.role, { arrayFormat: 'repeat' }))
              .then((r) => {
                vm.loading = false;
                if (r.data.code === 0){
                  vm.$alert('创建role成功', {
                    center: true,
                    callback: action => {
                      vm.$router.push({path: 'permRole'})
                    }
                  });
                } else {
                  vm.$alert('创建role失败', {
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
      resetForm (formName) {
        ref[formName].resetFields();
        this.permissionTableData = this.permissionTableData.map(item => {//权限表格取消全选
          item.all = [];
          return item;
        })
      },
      generatePermTableData (permissionList) {
        let tableData = [];
        for (let i = 0; i < permissionList.length; i++){
          let needAdd = true;
          for (let j = 0; j < tableData.length; j++){
            if (permissionList[i].fatherCode === tableData[j].fatherCode){
              needAdd = false;
              break;
            }
          }
          if (needAdd){
            tableData.push({
              fatherName: permissionList[i].fatherName,
              fatherCode: permissionList[i].fatherCode,
              all: [],
              childPermList: []
            })
          }
        }
        for (let i = 0; i < permissionList.length; i++){
          for (let j = 0; j < tableData.length; j++){
            if (permissionList[i].fatherCode === tableData[j].fatherCode){
              tableData[j].childPermList.push({
                id: permissionList[i].id,
                name: permissionList[i].name
              })
            }
          }
        }
        this.permissionTableData = tableData;
      },
      selectAll (fatherCode, all) {//全选联动
        let vm = this;
        vm.permissionTableData.forEach(pItem => {
          if (fatherCode === pItem.fatherCode){
            let permissionIdSet = new Set(vm.role.permissionIdArr);
            pItem.childPermList.forEach(cItem => {
              all.length === 0 ? permissionIdSet.delete(cItem.id) : permissionIdSet.add(cItem.id)
            });
            vm.role.permissionIdArr = [...permissionIdSet];
          }
        })
      },
      selectOne (fatherCode, id) {//联动全选
        let vm = this;
        vm.permissionTableData = this.permissionTableData.map(item => {
          let selectAll = false;
          if (item.fatherCode === fatherCode){
            selectAll = item.childPermList.every(item => {
              return vm.role.permissionIdArr.includes(item.id);
            });
            item.all = selectAll ? ['all']: [];
          }
          return item;
        })
      },
      getRoleList () {
        let vm = this;
        vm.loading = true;
        vm.api.get("/perm/role/getPermListAndRoleInfo")
          .then((r) => {
            vm.loading = false;
            if (r.data.code === 0){
              vm.generatePermTableData(r.data.resultMap.permList);
              if (!vm.permissionTableData || vm.permissionTableData.length === 0){
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

<style scoped lang="scss">
  .el-table{
    width: 700px;
    font-size: 16px;
    border: 1px solid #e2e1e1;
    border-bottom: none;

    td, th.is-leaf {
      border-bottom: 1px solid #e2e1e1;
      padding: 18px 20px;
    }
  }

  .form.form-inline-center .el-form-item {
    width: 1000px;
  }
</style>

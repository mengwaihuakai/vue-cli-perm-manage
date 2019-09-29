<template>
  <div>
    <div class="operate-row filter-row">
      <el-input type="text" clearable placeholder="Search Account" v-model="accountFilter"  class="filter-item"></el-input>
      <el-button type="primary" class="operate-item" icon="el-icon-plus" onclick="window.location.href='${rc.contextPath}/perm/user/toAddUser'">Create</el-button>
      <el-button @click="filterReport" type="primary" icon="el-icon-search" class="operate-item search">Search</el-button>
    </div>
    <div class="table-row">
      <el-table :data="displayData" ref="reportTable" v-loading="loading"
                @filter-change="handleTableFilterChange" @sort-change="handleTableSortChange">
        <el-table-column key="account" prop="account" label="Account" align="center" sortable></el-table-column>
        <el-table-column key="roleList" prop="roleList" label="Role List" sortable></el-table-column>
        <el-table-column key="status" prop="status" label="Status" align="center" sortable="custom"></el-table-column>
        <el-table-column key="createTime" prop="createTime" label="Create Time" align="center" sortable>
          <template slot-scope="scope">
            {{scope.row.createTime ? scope.row.createTime.substr(0,13).replace('T', ' ') : null}}
          </template>
        </el-table-column>
        <el-table-column key="updateTime" prop="updateTime" label="Update Time" align="center" sortable>
          <template slot-scope="scope">
            {{scope.row.updateTime ? scope.row.updateTime.substr(0,13).replace('T', ' ') : null}}
          </template>
        </el-table-column>
        <el-table-column key="actions" label="Actions" align="center" sortable="custom">
          <template slot-scope="scope">
            <a title="Edit">
              <i class="el-icon-edit" @click = 'edit(scope.row.id)' ></i>
            </a>
            <a title="Edit">
              <i class="el-icon-delete" @click = 'toDel(scope.row.id, scope.row.account)' ></i>
            </a>
          </template>
        </el-table-column>
      </el-table>
      <el-row >
        <el-col :span="8" :offset="0">
          <el-pagination background :layout="tablePagination.layout" :total="reportData.length" :page-size.sync="tablePagination.pageSize"
                         :current-page.sync="tablePagination.currentPage" :page-sizes="tablePagination.pageSizes"></el-pagination>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>{{dialogMessage}}</span>
      <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="del">Confirm</el-button>
                </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "PermUser",
      data () {
        return {
          dialogVisible: false,
          dialogMessage: "",
          dialogId: null,
          dialogAccount: null,
          loading: false,
          reportData: [],
          reportCopyData: [],
          accountFilter: "",
          tableColumnFilters: {},
          tableSorting: {
            prop: null,
            order: null // null, ascending, descending
          },
          tablePagination: {
            currentPage: 1,
            pageSize: 50,
            pageSizes: [50, 100, 200],
            layout: 'sizes, prev, pager, next, total'
          }
        }
      },
      computed: {
        filteredRows () {
          let data = this.reportData;
          for (let col in this.tableColumnFilters) {
            let vals = this.tableColumnFilters[col];
            if (vals.length !== 0) {
              data = data.filter(x => vals.includes(x[col]))
            }
          }
          return data;
        },
        displayData () {
          const pageNum = this.tablePagination.currentPage;
          const pageSize = this.tablePagination.pageSize;
          const sortKey = this.tableSorting.prop;
          const sortOrder = this.tableSorting.order;
          return _.slice(this.sortedRows(this.filteredRows, sortKey, sortOrder), (pageNum - 1) *
            pageSize, pageNum * pageSize);
        }
      },
      methods: {
        edit (id) {
          let f = document.createElement('form');
          f.style.display='none';
          f.action='toEditUser';
          f.method='post';
          f.innerHTML='<input type="hidden" name="id" value='+id+'>';
          document.body.appendChild(f);
          f.submit();
        },
        toDel (id, account){
          this.dialogMessage = account === "admin" ? ("该账号:" + account + "不可删除！") : ("确定要删除账号:" + account + "的用户吗？");
          this.dialogVisible = true;
          this.dialogId = id;
          this.dialogAccount = account;
        },
        del (){
          let vm = this;
          vm.loading = true;
          vm.dialogVisible = false;
          if(vm.dialogAccount !== "admin") {
            vm.api.post('deleteUser', {id: vm.dialogId})
              .then(function (r) {
                vm.loading = false;
                vm.$alert(r.data.message, '提示', {
                  callback: action => {
                  }
                });
                vm.reportData = vm.reportCopyData.filter(item => {
                  return item.id !== vm.dialogId;
                });
                vm.reportCopyData = vm.reportData;
              })
              .catch(function (e) {
                vm.loading = false;
                vm.$alert('删除该用户异常', '提示', {
                  callback: action => {
                  }
                });
              });
          }
        },
        generateData (result) {
          for (let item of result){
            let roleListStr = "";
            //status
            switch (item.status){
              case 0:
                item.status =  "正常";
                break;
              case 1:
                item.status =  "无效";
                break;
              case 2:
                item.status =  "冻结";
                break;
            }
            //roleList
            item.roleList.forEach(item => {
              roleListStr += item.name + " "
            });
            item.roleList = roleListStr;
          }
          return result;
        },
        refreshReportData () {
          let vm = this;
          vm.loading = true;
          vm.api.post('perm/user/search', {})
            .then(function (r) {
              vm.loading = false;
              if (r.status && r.status === 200) {
                vm.reportData = vm.generateData(r.data.result);
                vm.reportCopyData = vm.reportData;
                vm.$notify.success({
                  message: '数据加载成功',
                  duration: 1500
                });
              } else {
                vm.$alert('数据加载失败', '提示', {
                  callback: action => {}
                });
              }
            })
            .catch(function (e) {
              vm.loading = false;
              vm.$alert('数据加载异常', '提示', {
                callback: action => {}
              });
            });
        },
        filterReport () {
          let accountFilter = this.accountFilter;
          if (accountFilter) {
            this.reportData = this.reportCopyData.filter(item => {
              return item.account.includes(accountFilter);
            })
          } else {
            this.reportData = this.reportCopyData
          }
        },
        handleTableFilterChange (filters) {
          this.tableColumnFilters = _.cloneDeep(filters);
        },
        handleTableSortChange (sorting) {
          this.tableSorting.prop = sorting.prop;
          this.tableSorting.order = sorting.order;
        },
        sortedRows (rows, prop, order) {
          if (prop === null || order === null) {
            return rows;
          }
          if (order === 'ascending') {
            return _.sortBy(rows, [prop])
          } else {
            return _.reverse(_.sortBy(rows, [prop]));
          }
        }
      },
      mounted () {
        this.refreshReportData();
      }
    }
</script>

<style scoped>

</style>

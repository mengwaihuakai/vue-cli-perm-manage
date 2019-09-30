<template>
  <div>
    <div class="operate-row filter-row">
      <el-input type="text" clearable placeholder="Search Name" v-model="nameFilter"  class="filter-item"></el-input>
      <el-button type="primary" class="operate-item" icon="el-icon-plus" @click="create">Create</el-button>
      <el-button @click="filterReport" type="primary" icon="el-icon-search" class="operate-item search">Search</el-button>
    </div>
    <div class="table-row">
      <el-table :data="displayData" ref="reportTable" v-loading="loading"
                @filter-change="handleTableFilterChange" @sort-change="handleTableSortChange">
        <el-table-column key="name" prop="name" label="Name" align="center" sortable></el-table-column>
        <el-table-column key="status" prop="status" label="Status" align="center" sortable="custom"></el-table-column>
        <el-table-column key="permissionList" prop="permissionList" label="Permission List" min-width="300" sortable></el-table-column>
        <el-table-column key="createTime" prop="createTime" label="Create Time" align="center" sortable>
          <template slot-scope="scope">
            {{scope.row.createTime.substr(0,13).replace('T', ' ')}}
          </template>
        </el-table-column>
        <el-table-column key="updateTime" prop="updateTime" label="Update Time" align="center" sortable>
          <template slot-scope="scope">
            {{scope.row.updateTime.substr(0,13).replace('T', ' ')}}
          </template>
        </el-table-column>
        <el-table-column key="actions" label="Actions" align="center" sortable="custom">
          <template slot-scope="scope">
            <a title="Edit">
              <i class="el-icon-edit" @click = 'edit(scope.row.id)' ></i>
            </a>
            <a title="Edit">
              <i class="el-icon-delete" @click = 'toDel(scope.row.id, scope.row.name)' ></i>
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
      name: "PermRole",
      data () {
        return {
          dialogVisible: false,
          dialogMessage: "",
          dialogId: null,
          loading: false,
          reportData: [],
          reportCopyData: [],
          nameFilter: "",
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
        create () {
          this.$router.push({path: 'toAddRole'})
        },
        edit (id) {
          this.$router.push({path: 'toEditRole', query: {id: id}})
        },
        toDel (id, name){
          this.dialogMessage = "确定要删除名称:" + name + " 的角色吗？";
          this.dialogVisible = true;
          this.dialogId = id;
        },
        del (){
          let vm = this;
          vm.loading = true;
          vm.dialogVisible = false;
          vm.api.post('perm/role/deleteRole', {id: vm.dialogId})
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
              vm.$alert('' + e, '提示', {
                callback: action => {
                }
              });
            });
        },
        generateData (result) {
          for (let item of result){
            let permListStr = "";
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
            item.permissionList.forEach(item => {
              permListStr += item.name + ", "
            });
            item.permissionList =permListStr.lastIndexOf(", ") === permListStr.length - 2 ? permListStr.substring(0, permListStr.lastIndexOf(", ")) : permListStr;
          }
          return result;
        },
        refreshReportData () {
          let vm = this;
          vm.loading = true;
          vm.api.post('perm/role/search', {})
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
          let nameFilter = this.nameFilter;
          if (nameFilter) {
            this.reportData = this.reportCopyData.filter(item => {
              return item.name.includes(nameFilter);
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
        sortedRows: function (rows, prop, order) {
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
      mounted: function () {
        this.refreshReportData();
      }
    }
</script>

<style scoped>
  .filter-row .el-input{
    width: 240px;
  }
</style>

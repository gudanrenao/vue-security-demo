<template>
  <div>
    <el-tabs type="border-card" style="padding-top: 10px" @tab-click="tabClick">
      <el-tab-pane label="用户列表">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="账号名称:">
            <el-input v-model="criteria.name" placeholder="账号名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号码:">
            <el-input v-model="criteria.phone" placeholder="手机号码" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否禁用:">
            <el-select v-model="criteria.enabled" placeholder="请选择" clearable>
              <el-option v-for="item in enabledList" :key="item.value" :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="userListCriteria">查询</el-button>
            <el-button class="editProduct" type="success" @click="userEdit(0)" round>新建账号</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="userListData" border style="width: 100%">
          <el-table-column prop="name" label="用户姓名" align="center"></el-table-column>
          <el-table-column prop="username" label="账号名" align="center"></el-table-column>
          <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
          <el-table-column label="用户头像" align="center">
            <template slot-scope="scope"><img :src="scope.row.headUrl" style="height: 50px;width: auto"
                                              alt=""></template>
          </el-table-column>
          <el-table-column label="当前状态" align="center">
            <template slot-scope="item">{{ item.row.enabled === 1 ? '已启用' : '已禁用' }}</template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column align="center" width="300" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" @click="userEnabledEdit(scope.$index, scope.row)">
                {{ scope.row.enabled === 0 ? '启用' : '禁用' }}
              </el-button>
              <el-button size="mini" @click="userEdit(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="criteria.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="criteria.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalElements"
          style="padding-top: 15px;text-align: right">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="角色列表">
      </el-tab-pane>
      
    </el-tabs>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        criteria: {
          enabled: '',
          name: '',
          phone: '',
          currentPage: 1,
          pageSize: 10
        },
        startEnd: [],
        userListData: [],
        productStatData: [],
        totalStat: {},
        totalElements: 0,
        enabledList: [{
          value: 0,
          label: '已禁用'
        }, {
          value: 1,
          label: '已启用'
        }],
        stateList: [{
          value: 1,
          label: '已上架'
        }, {
          value: -1,
          label: '全部'
        }, {
          value: 0,
          label: '已下架'
        }],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        }
      }
    },
    created() {
      this.userListCriteria()
    },
    watch: {
      startEnd: function (newVal) {
        this.criteria.start = formatDate(newVal[0], date_time_format_2);
        this.criteria.end = formatDate(newVal[1], date_time_format_2)
      }
    },
    methods: {
      userListCriteria() {
        let _this = this;
        _this.postRequest('/permission/userSearch', _this.criteria).then(resp=> {
          if (resp && resp.status === 200 && resp.data.errCode === 0) {
            let result = resp.data.data;
            _this.userListData = result.resultList;
            _this.totalElements = result.totalCount;
          }
        });
      },
      productStatCriteria() {
        var _this = this;
        axios({
          url: '/manage/shareProduct/stat',
          method: 'post',
          data: this.criteria,
          contentType: "application/json;charset=UTF-8"
        }).then(function (response) {
          var result = response.data.data;
          _this.productStatData = result.content;
          _this.totalElements = result.totalElements;
        })
      },
      productTotalStat() {
        var _this = this;
        axios({
          url: '/manage/shareProduct/statAll',
          method: 'get',
          contentType: "application/json;charset=UTF-8"
        }).then(function (response) {
          _this.totalStat = response.data;
        })
      },
      handleSizeChange1: function (currSize) {
        this.criteria.pageSize = currSize;
        this.criteria.currentPage = 1;
        this.userListCriteria()
      },
      handleCurrentChange1: function (currentPage) {
        this.criteria.currentPage = currentPage;
        this.userListCriteria()
      },
      tabClick: function (tab, event) {
        console.log(event.target.getAttribute('id'))
        switch (event.target.getAttribute('id')) {
          case 'tab-0': {
            this.criteria.state = 1;
            this.userListCriteria();
            break
          }
          case 'tab-1': {
            this.criteria.state = 0;
            this.userListCriteria();
            break
          }
          default:
            break
        }
      },
      userEnabledEdit: function (index, row) {
        let _this = this;
        let msg = row.enabled === 0 ? '启用' : '禁用';
        _this.$confirm('确定将账号【' +row.username + '】' + (row.enabled === 0 ? '启用' : '禁用') + ' 吗？', '状态修改提示', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          _this.putRequest("/permission/updateUser", {
            enabled: 1 - row.enabled,
            id: row.id
          }).then(resp=> {
            if (resp && resp.status === 200 && resp.data.errCode === 0) {
              _this.$message.success({message: msg + '成功'});
              _this.userListCriteria();
            }
          })
        }).catch(action => {
          _this.$message.info({message: '已取消'});
        });
      },
      userEdit: function (userId) {
        this.$router.push({path: '/sys/userDetail', query: { userId: userId }});
      }
    }
  }
</script>

<style scoped>

</style>

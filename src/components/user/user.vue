<template>
<el-card class="box-card">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框和添加按钮 -->
    <div class="searchBox">
        <el-col :span='16'>
            <el-input @clear="clearSearch()" v-model="query" placeholder="请输入用户名" class="input-with-select" :clearable=true>
                <el-button @click="chaXun()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </el-col>
        <el-button @click="dialogFormVisibleAdd=true" type="success" plain class="successBtn">添加用户</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="userList" style="width: 100%">
        <el-table-column type='index' label="#" width="80">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间">
            <template slot-scope="scope">
                {{scope.row.create_time|fmtDate}}
            </template>
        </el-table-column>
        <el-table-column prop="mg_state" label="用户状态">
            <template slot-scope="scope">
                <el-switch @change="handleSwitchChange(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949">
                </el-switch>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope='scope'>
                <el-row>
                    <el-button @click="showEdit(scope.row)" type="primary" icon="el-icon-edit" circle size="mini"></el-button>
                    <el-button @click="showRole(scope.row)" type="success" icon="el-icon-check" circle size="mini"></el-button>
                    <el-button @click="handleDelete(scope.row.id)" type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>
    <!-- 开始写分页 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page='pagenum' :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 添加按钮弹出的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
        <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
                <el-input v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" label-width="100px">
                <el-input v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd=false">取 消</el-button>
            <el-button type="primary" @click="addUsers()">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 开始写编辑的弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
        <el-form v-model="form">
            <el-form-item label="用户名" label-width="100px">
                <el-input :disabled="true" v-model="form.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话" label-width="100px">
                <el-input v-model="form.mobile" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" label-width="100px">
                <el-input v-model="form.email" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleEdit=false">取 消</el-button>
            <el-button @click.prevent="editDone()" type="primary">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 开始写✔️按钮显示的弹窗 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleCheck">
        <el-form :model="form">
            <el-form-item label="用户名" label-width="100px">
                {{currUsername}}
            </el-form-item>
            <el-form-item label="角色" label-width="100px">
                <el-select v-model="currRoleId">
                    <el-option label="请选择角色" :value="-1"></el-option>
                    <el-option v-for="(items,i) in roles" :key="i" :label="items.roleName" :value="items.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleCheck = false">取 消</el-button>
            <el-button type="primary" @click="checkDone()">确 定</el-button>
        </div>
    </el-dialog>

</el-card>
</template>

<script>
export default {
    data() {
        return {
            userList: [{
                create_time: '',
                email: '',
                id: '',
                mg_state: '',
                mobile: '',
                role_name: '',
                username: ''
            }],
            query: '',
            // 获取用户数据时需要的请求的参数
            pagenum: 1,
            pagesize: 2,
            total: -1,
            // 添加用户
            dialogFormVisibleAdd: false,
            // 编辑用户
            dialogFormVisibleEdit: false,
            // check对号按钮,角色分配
            dialogFormVisibleCheck: false,
            form: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 分配角色的时候需要的数据
            currRoleId:-1,
            currUsername:'aa',
            roles:[],
            // 当前用户的id
            currUserId: -1

        }
    },
    created() {
        this.getUserList()
        
    },
    methods: {
        // 选好角色,点击,确认提交
        async checkDone(){
            this.dialogFormVisibleCheck = false
            const res= await this.$http.put(`users/${this.currUserId}/role`,{
               
                rid:this.currRoleId
            })
            console.log(res)
        },
        // 开始写点击check之后,开始出现的弹出框显示
        async showRole(users){
            // console.log(users)
            this.dialogFormVisibleCheck = true
            this.currUsername=users.username
            this.currUserId=users.id
            const res1=await this.$http.get(`roles`)
            // console.log(res1)
            this.roles=res1.data.data
            const res2=await this.$http.get(`users/${users.id}`)
            // console.log(res2)
            this.currRoleId=res2.data.data.rid
            
            
        },
        // 开始写编辑功能
        async editDone() {
            // 点击确定之后就开始提交表单的内容
            // console.log(this.form.id)
            const res = await this.$http.put(`users/${this.form.id}`, this.form)
            // console.log(res)
            const {
                meta: {
                    status,
                    msg
                }
            } = res.data
            if (status === 200) {
                this.dialogFormVisibleEdit = false
                this.getUserList()
            }

        },
        showEdit(a) {
            this.dialogFormVisibleEdit = true
            this.form.username = a.username
            this.form.email = a.email
            this.form.mobile = a.mobile
            this.form.id = a.id
        },

        // 开始写删除的功能
        handleDelete(ID) {
            this.$confirm('是否删除用户', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const res = await this.$http.delete(`users/${ID}`)
                this.getUserList()
                this.$message({
                    type: 'success',
                    message: res.data.meta.msg
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: res.data.meta.msg
                })
            })

        },
        // 下面是滑动键的代码
        async handleSwitchChange(user) {
            const res = await this.$http.put(
                `users/${user.id}/state/${user.mg_state}`
            )
            const data = res.data
            // console.log(data)
            const {
                meta: {
                    status,
                    msg
                }
            } = data
            if (status === 200) {
                this.$message.success(msg)
            } else {
                this.$message.error(msg)
            }
        },
        showAdd() {
            this.dialogFormVisibleAdd = true
        },
        // 开始添加用户并且发送添加请求
        async addUsers() {
            this.dialogFormVisibleAdd = false

            // 1. 发送请求
            const res = await this.$http.post('users', this.form)
            // console.log(res)
            const {
                meta: {
                    status,
                    msg
                },
                data
            } = res.data

            if (status === 201) {
                this.$message.success(msg)
                // 4. 更新视图
                this.getUserList()
                this.form = {}
            } else {
                this.$message.warning(msg)
            }
        },
        // 现在开始写点击小叉叉然后表格刷新
        clearSearch() {
            this.getUserList()
        },
        // 开始写添加用户
        showAdd() {

        },
        // 开始写搜索用户功能
        chaXun() {
            this.pagenum = 1
            this.getUserList()
        },
        // 下面是分页的相关方法
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pagesize = val
            this.pagenum = 1
            this.getUserList()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.pagenum = val
            this.getUserList()
        },
        // 这个是渲染表格页面
        async getUserList() {
            const AUTH_TOKEN = localStorage.getItem('token')
            this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
            const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
            // console.log(res)
            // 开始结构赋值我需要的数据
            const {
                meta: {
                    msg,
                    status
                },
                data: {
                    total,
                    users
                }
            } = res.data
            if (status === 200) {
                this.total = total
                this.userList = users
                this.$message.success(msg)
            } else {
                this.$message.warning(msg)
            }
        }
    }
}
</script>

<style>
.box-card {
    height: 100%;
}

.searchBox {
    margin-top: 20px;
}

.searchBox .successBtn {
    margin-left: 5px;
}
</style>

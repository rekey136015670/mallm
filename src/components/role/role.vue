<template>
<el-card class="box-card">
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <el-button class="addrole">添加角色</el-button>
    <!-- 角色权限表格 -->
    <el-table :data="roleRightList" style="width: 100%">
        <!-- 这里是一点击就能出现下拉框 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row v-for="(item1,i) in scope.row.children" :key='i'>
                    <el-col :span='4'>
                        <el-tag closable @close='deleRight(scope.row,item1.id)'> {{item1.authName}}</el-tag>
                        <i class="el-icon-arrow-right"></i>
                    </el-col>
                    <el-col :span='20'>
                        <el-row v-for="item2 in item1.children" :key='item2.id'>
                            <el-col :span='4'>
                                <el-tag closable @close='deleRight(scope.row,item2.id)' type="success"> {{item2.authName}}</el-tag><i class="el-icon-arrow-right"></i>
                            </el-col>
                            <el-col :span='20'>
                                <el-tag closable @close='deleRight(scope.row,item3.id)' type="warning" v-for="item3 in item2.children" :key='item3.id'> {{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row v-if='scope.row.children.length===0'>未分配权限,请分配</el-row>
            </template>
        </el-table-column>
        <!-- 正常的列表展示 -->
        <el-table-column type='index' label="#" width="80">
        </el-table-column>
        <el-table-column prop="roleName" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope='scope'>
                <el-row>
                    <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
                    <el-button @click="showSetRightDia(scope.row)" type="success" icon="el-icon-check" circle size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分配/修改 角色的权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRight">
        <el-tree ref="tree" :data="treelist" default-expand-all show-checkbox node-key="id" :default-checked-keys="arrcheck" :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
            <el-button type="primary" @click="setRoleRight()">确 定</el-button>
        </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data() {
        return {
            roleRightList: [],
            dialogFormVisibleRight: false,
            treelist: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            currRoleId: -1,
            arrcheck: [],
        }
    },
    mounted() {
        this.getroleRightList()
    },
    methods: {
        async setRoleRight() {
            // 获取全选或者半选的节点的id
            // 获取半选节点id的数组  getHalfCheckedKeys
            let arr2 = this.$refs.tree.getHalfCheckedKeys()
            // console.log(arr2)

            // 获取全选节点id的数组 getCheckedKeys
            let arr1 = this.$refs.tree.getCheckedKeys()
            let arr = [...arr1, ...arr2]
            const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
                rids: arr.join(',')
            })

            this.dialogFormVisibleRight = false,
                this.getroleRightList()
        },
        async showSetRightDia(role) {
            this.currRoleId = role.id
            const res = await this.$http.get(`rights/tree`)
            console.log(res)
            this.treelist = res.data.data
            // 已经知道当前角色，就可以点出来下面的children，还是循环每个children去找相应的id
            let arrtemp = []
            role.children.forEach(item1 => {
                // arrtemp.push(item1.id)
                item1.children.forEach(item2 => {
                    // arrtemp.push(item2.id)
                    item2.children.forEach(item3 => {
                        arrtemp.push(item3.id)
                    })
                })
            })
            this.arrcheck = arrtemp
            this.dialogFormVisibleRight = true
        },
        // 点❎删除对应权限
        // 要找到这个角色，然后发送删除请求，把所点击的角色里面的权限根据id删了
        async deleRight(role, rightId) {
            const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            // console.log(res)
            // 显示已经取消，现在变成局部更新组件这块，不要整个页面更新
            role.children = res.data.data

        },
        async getroleRightList() {
            const res = await this.$http.get('roles')

            this.roleRightList = res.data.data
            // console.log(this.roleRightList);

        }
    }
}
</script>

<style>
.addrole {
    margin-top: 20px;
}
</style>

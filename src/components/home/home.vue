<template>
<el-container class="container">
    <el-header class="header">
        <el-row>
            <el-col :span="4">
                <div class="grid-content bg-purple">

                </div>
            </el-col>
            <el-col :span="19" class="middle">
                <div class="grid-content bg-purple-light">
                    <h3>电商管理系统</h3>
                </div>
            </el-col>
            <el-col :span="1">
                <div class="grid-content bg-purple">
                    <a class="logout" href="javascript:;" @click="logOut()">退出</a>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside class="aside" width="200px">
            <el-menu :router="true" :unique-opened='true'  class="el-menu-vertical-demo">
                <el-submenu :index="''+item1.order" v-for="(item1,i) in menus" :key="i">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item1.authName}}</span>
                    </template>
                    <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
                        <template slot="title">
                            <i class="el-icon-sort"></i>
                            <span>{{item2.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>




            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data(){
return {
      menus: []
    }
  },
      // beforeCreate(){

      //   const token=localStorage.getItem('token')
      //   console.log(token);
      //   if(!token){
      //       this.$router.push({name:'login'})
      //   }

      // },
      created() {
    this.getMenus()
  },
      methods:{
        async getMenus(){
const res = await this.$http.get(`menus`)
      console.log(res)
      this.menus = res.data.data
        },
          logOut(){
              sessionStorage.clear()
              this.$router.push({name:'login'})
              this.$message.success('退出成功')
          },
          showUser(){
              this.$router.push({name:"user"})
          },
          showRightList(){
            this.$router.push({name:"right"})
          },
          showRoleList(){
            this.$router.push({name:"role"})
          }
      }
}
</script>

<style>
.container {
    height: 100%;
}

.container .header {
    background-color: #b3c0d1;
}

.container .aside {
    background-color: #d3dce6;
}

.container .main {
    background-color: #e9eef3;
    height: 100%;
}

.middle {
    text-align: center;
}

.logout {
    text-decoration: none;
    line-height: 60px;
}
</style>

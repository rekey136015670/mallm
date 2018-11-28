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
            <el-menu :unique-opened='true'  class="el-menu-vertical-demo">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-sort"></i>
                            <span @click="showUser()">用户列表</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <!-- 第二个 -->
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-view"></i>
                        <span>权限管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-tickets"></i>
                            <span>角色管理</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-document"></i>
                            <span>权限列表</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <!-- 第三个 -->
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-goods"></i>
                        <span>商品管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-sold-out"></i>
                            <span>商品列表</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>分类参数</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>商品分类</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <!-- 第四个 -->
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>订单管理</span>
                    </template>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>订单列表</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
                <!-- 第五个 -->
                <el-submenu index="5">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>数据统计</span>
                    </template>
                    <el-menu-item index="1-1">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>数据报表</span>
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
      beforeCreate(){
         
        const token=localStorage.getItem('token')
        console.log(token);
        if(!token){
            this.$router.push({name:'login'})
        }
          
      },
      methods:{
          logOut(){
              sessionStorage.clear()
              this.$router.push({name:'login'})
              this.$message.success('退出成功')
          },
          showUser(){
              this.$router.push({name:"user"})
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

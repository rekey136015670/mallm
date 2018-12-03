<template>
  <el-card>
    <!-- 1. 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert class="alert" title="只允许为第三级分类设置参数" type="error"></el-alert>
    <!-- 级联选择器 -->
    <el-form label-width="110px" class="formcas">
      <el-form-item label="商品分类">
{{selectedOptions}}
        <el-cascader
          clearable
          :show-all-levels="false"
          expand-trigger="hover"
          :options="options"
          :props="defaultProps"
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tab切换 -->
    <el-tabs v-model="active" @tab-click="handleClick">
    <el-tab-pane label="动态参数" name="1">
      <el-button type="info" disabled>设置动态参数</el-button>
      <!-- 开始写这个tab下面的表格 -->
      <el-table :data="arrDyparams" style="width: 100%">
        <el-table-column type="expand">
            <template slot-scope="scope">
               <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
        </el-table-column>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                @click="showEditUserDia(scope.row)"
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                @click="showMegBoxDele(scope.row.id)"
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-tab-pane>
    <el-tab-pane label="静态参数" name="2">
      <el-button type="info" disabled>设置静态参数</el-button>
      <!-- 静态的表格 -->
      <el-table :data="arrStaticparams" style="width: 100%">
          <el-table-column type="index" label="#" width="80"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="180"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button

                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-tab-pane>
  </el-tabs>

  </el-card>
</template>

<script>
export default {
data(){
  return{
    options:[],
    defaultProps:{
      // 分类id
                value: 'cat_id',
                // 是分类名称
                label: 'cat_name',
                // 下一级别数据的key
                children: 'children'
    },
    selectedOptions:[],
    active:'1',
    arrDyparams:[],
    inputVisible:false,
    inputValue:'',
  arrStaticparams:[]


  }
},
mounted(){
this.getGoodsCateList()
},
methods:{
  handleClick(){},

  showInput(){
        this.inputVisible = true;
        this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
        });
  },
  // 按下回撤之后，输入框回归正常，然后再多加一个tag
  async handleInputConfirm(attr){
    let inputValue = this.inputValue;
        if (inputValue) {
          attr.attr_vals.push(inputValue);
          const res = await this.$http.post(
          `categories/${this.selectedOptions[2]}/attributes`,
          {
            attr_name: attr.attr_name,
            attr_sel: "many",
            attr_vals: attr.attr_vals.join(",")
          }
        );
        }
        this.inputVisible = false;
        this.inputValue = '';
  },
  // 下面是点击叉叉关掉对应的参数
  async handleClose(attr, tag){
    attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
            // 发送请求
            // categories/:id/attributes/:attrid
            // console.log(attr.attr_id);

            const res = await this.$http.delete(
                `categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`
            );
  },
  // 这里就是及联样式表的一发生改变就就触发的函数，一旦选完分类，就显示下面的表格信息
 async handleChange(){
   if (this.selectedOptions.length === 3) {
                // 开始发请求，请求商品参数
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                console.log(res)
                this.arrDyparams = res.data.data
                this.arrDyparams.forEach(item => {
                    item.attr_vals = item.attr_vals.trim().split(',')
                });

            }
  },
  // 下面是tab发生切换变化的时候，触发的时间，还有就是判断是否选择了分类，如果有分类，开始发送请求，显示参数，静态的
   async handleClick() {
      //
      if (this.active === "2") {
        if (this.selectedOptions.length === 3) {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          // console.log(res);
          this.arrStaticparams = res.data.data;
        }
      }
    },
  // 把之前发送请求，请求商品参数的拿过来
   // 获取三级分类的商品数据
        async getGoodsCateList() {
            const res = await this.$http.get('categories?type=3')
            console.log(res)
            this.options = res.data.data
        },
}
}
</script>

<style>
.alert {
  margin-top: 20px;
}
.formcas {
  margin-top: 20px;
}

</style>

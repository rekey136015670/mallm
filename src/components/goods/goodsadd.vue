<template>
<el-card class="box-card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 灰色的提示框 -->
    <el-alert title="添加商品信息" type="info" center show-icon style='margin-top:20px'>
    </el-alert>
    <!-- 下面是进度条 -->
    <el-steps :active="1*active" style='margin-top:20px' align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 下面是侧边的切换栏 -->
    <el-form label-width="80px" :model="form" label-position="top" style="height:350px; overflow:auto;">
        <el-tabs @tab-click="tabChange()" v-model="active" tab-position="left" style="margin-top:50px">
            <el-tab-pane name="1" label="基本信息">
                <el-form-item label="商品分类">
                    <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions" :props="defaultProps" @change="handleChange">
                    </el-cascader>
                    <span>{{selectedOptions}}</span>
                </el-form-item>
                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>

            </el-tab-pane>
            <el-tab-pane name="2" label="商品参数">
                <el-form-item :label="item1.attr_name" v-for="(item1,i) in arrDyparams" :key="i">

                    <el-checkbox-group v-model="item1.attr_vals">
                        <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <!-- 下面这个是要写的商品静态参数 -->
            <el-tab-pane name="3" label="商品属性">
                <el-form-item :label="item3.attr_name" v-for="(item3,i) in arrStaticparams" :key='i'>
                    <el-input v-model="item3.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="4" label="商品图片">
                <el-form-item>
                    <el-upload action="http://localhost:8888/api/private/v1/upload" :headers="headers" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane name="5" label="商品内容">
                <el-form-item>
                    <el-button @click="addGood()">添加商品</el-button>
                    <!-- 下面是富文本编辑器 -->
                    <quill-editor v-model="form.goods_introduce"></quill-editor>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>
</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {
    quillEditor
} from 'vue-quill-editor'
export default {
    components: {
        quillEditor
    },
    data() {
        return {
            active: '1',
            form: {
                goods_name: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_introduce: '',
                goods_cat: '',
                pics: [],
                // 下面要同时绑定动态和静态参数，修改之后的最终值
                attrs: '',
            },
            // 下面是所有的数据源
            options: [],
            // 下面是能看见的lable所指的id值，的组数集合
            selectedOptions: [1, 3, 6],
            defaultProps: {
                // 分类id
                value: 'cat_id',
                // 是分类名称
                label: 'cat_name',
                // 下一级别数据的key
                children: 'children'
            },
            // 动态参数的数据
            arrDyparams: [],
            // 静态参数的数据
            arrStaticparams: [],
            headers: {
                Authorization: localStorage.getItem('token')
            }
        }
    },
    mounted() {
        this.getGoodsCateList()
    },
    methods: {
        // 添加商品

        async addGood() {
            // 但是在添加之前，要先对某些数据做一些单独处理
            this.form.goods_cat = this.selectedOptions.join(',')
            this.form.pics = []
            // 下面要同时绑定动态和静态参数，修改之后的最终值
            // this.form.attrs = '',下面就是如何获取这个attrs的值，通过文档知道，这是个数组
            // 1. 取出数组中的每个对象key和value
            // 2. 返回一个新数组
            let arr1 = this.arrDyparams.map(item => {
                // item.attr_id和item.attr_vals
                return {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                };
            });
            // console.log(arr1);
            // 静态参数
            let arr2 = this.arrStaticparams.map(item => {
                // item.attr_id和item.attr_vals
                return {
                    attr_id: item.attr_id,
                    attr_value: item.attr_vals
                };
            });
            // console.log(arr2);

            let attrs = [...arr1, ...arr2];

            // 处理完成之后，再开始发送数据
            const res = await this.$http.post(`goods`, this.form)
            // console.log(res);
            

            // 发送完之后，回到商品列表
            this.$router.push({
                name: 'goods'
            })

        },
        // 上传图片的方法
        handleRemove(file, fileList) {
            // console.log(file, fileList);
            // 移除之后这里的file会返回数据，在response里
            // file.response.data.tmp_path
            // 现在处理点击叉叉之后移除图片,所以要找到当前点击的图片的索引
            let index = this.form.pics.findIndex((item) => {
                return item.pics === file.response.data.tmp_path
            })
            this.form.pics.splice(index, 1)

        },
        handlePreview(file) {
            // console.log(file);

        },
        handleSuccess(file) {
            // console.log(file);
            // 成功之后这里的file会返回数据
            // file.data.tmp_path
            this.form.pics.push({
                pics: file.data.tmp_path
            })
        },

        // tab切换的时候，请求动态参数，但是好像只有第二个才要动态参数
        async tabChange() {
            // 先判断有没有选择分类，如果没有就不能点击其他的tab
            if (this.selectedOptions.length !== 3) {
                this.$message.warning('请先选择三级分类')
                return
            }
            if (this.active === '2') {
                // 开始发请求，请求商品参数
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                // console.log(res)
                this.arrDyparams = res.data.data
                this.arrDyparams.forEach(item => {
                    item.attr_vals = item.attr_vals.trim().split(',')
                });

            }
            if (this.active === '3') {
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                // console.log(res);
                this.arrStaticparams = res.data.data

            }
        },
        // 获取三级分类的商品数据
        async getGoodsCateList() {
            const res = await this.$http.get('categories?type=3')
            // console.log(res)
            this.options = res.data.data
        },
        handleChange() {}
    }
}
</script>

<style>
.ql-editor {
    min-height: 300px;
}
</style>

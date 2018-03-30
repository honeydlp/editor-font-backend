<template>
  <div class="editor-layout">
    <el-form ref="form" :model="form" label-width="80px" :inline="true" :rules="rules">
      <el-row >
        <el-col :md="12" :lg="12" >
          <el-form-item label="标题:" prop="title" class="form-item-title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="12" >
          <el-form-item label="时间:" class="time" prop="time">
            <el-date-picker type="date" format="yyyy-MM-dd" v-model="form.time"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      <el-row>
        <el-col :span="24">
          <div class="quill-editor">
            <div class="quill-wrap">
              <quill-editor
                v-model="content"
                ref="myQuillEditor"
                :options="editorOption"
              >
              </quill-editor>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col  :md="24" :lg="24">
          <div class="add-btn-box">
            <el-button type="primary" icon="search" @click="addArtilce">添加文章</el-button>
          </div>
        </el-col>
      </el-row>
  </div>
</template>

<script>
  // require sources
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

  import {quillEditor, Quill} from 'vue-quill-editor'
  import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
  import  ImageResize  from 'quill-image-resize-module'

  import service from '@/utils/fetch.js'
  import { Message } from 'element-ui';
  import '@/utils/tools';

  Quill.register('modules/ImageExtend', ImageExtend)
  Quill.register('modules/ImageResize', ImageResize)
  // export
  export default {
    name: 'editor',
    data() {
      return {
        form:{
          title:'',
          time:''
        },
        rules:{
          title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
          time: [
          { required: true, message: '请输入发布时间', trigger: 'blur' }
        ]
        },
        content:'',
        editorOption: {  
          modules: {
              // ImageResize: {
              //    modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
              // },
              ImageExtend: {  // 如果不作设置，即{}  则依然开启复制粘贴功能且以base64插入 
                  name: 'img',  // 图片参数名
                  size: 3,  // 可选参数 图片大小，单位为M，1M = 1024kb
                  action: '/apis/upload',  // 服务器地址, 如果action为空，则采用base64插入图片
                  // response 为一个函数用来获取服务器返回的具体图片地址
                  // 例如服务器返回{code: 200; data:{ url: 'baidu.com'}}
                  // 则 return res.data.url
                  response: (res) => {
                      return 'static/img/'+res.info
                  },
                  headers: (xhr) => {
                  // xhr.setRequestHeader('myHeader','myValue')
                  },  // 可选参数 设置请求头部
                  sizeError: () => {},  // 图片超过大小的回调
                  start: () => {},  // 可选参数 自定义开始上传触发事件
                  end: () => {},  // 可选参数 自定义上传结束触发的事件，无论成功或者失败
                  error: () => {},  // 可选参数 上传失败触发的事件
                  success: () => {},  // 可选参数  上传成功触发的事件
                  change: (xhr, formData) => {
                  // xhr.setRequestHeader('myHeader','myValue')
                  // formData.append('token', 'myToken')
                  } // 可选参数 每次选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
              },
              toolbar: {  // 如果不上传图片到服务器，此处不必配置
                  container: container,  // container为工具栏，此次引入了全部工具栏，也可自行配置
                  handlers: {
                      'image': function () {  // 劫持原来的图片点击按钮事件
                          QuillWatch.emit(this.quill.id)
                      }
                  }
              }
          }
        }
      }
    },
    components: {
      quillEditor
    },
    methods:{
     addArtilce(){
       if(!this.form.time||!this.form.title||!this.content){
        Message({
          message: '文章不能为空，时间，标题，内容',
          type: 'error',
          duration: 3 * 1000
        });
        return;
       }
       console.log(this.form.time)
        service({
            url: '/apis/content',
            method: 'post',
            data:{
              content:this.content,
              time:new Date(this.form.time).format('yyyy-MM-dd'),
              title:this.form.title
            }
        }).then(res=>{
          if(res.data.status){
            Message({
              message: '文章添加成功',
              type: 'success',
              duration: 3 * 1000
            });
          }
        })
     }
    }
  }
</script>

<style>
  .editor-layout{
    width: 1160px;
    margin: 0 auto;
  }
  .el-form--inline .el-form-item{
    float: left;
  }
  .add-btn-box{
    margin-top: 22px;
  }
  .el-form-item__content{
    width: 300px;
  }
  .ql-editor{
    min-height: 500px;
  }
</style>


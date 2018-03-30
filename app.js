const koa = require('koa')
const app = new koa()
const router = require('koa-router')()
const convert = require('koa-convert');
const json = require('koa-json');
const body = require('koa-body');

const index = require('./routes/index')

// middlewares
app.use(convert(require('koa-static2')("/public",__dirname + '/public/dist')));
app.use(convert(body({
  multipart: true,  // 允许上传多个文件
  formidable: { 
    uploadDir: __dirname+'/public/dist/static/img/',// 上传的文件存储的路径 
    keepExtensions: true  //  保存图片的扩展名
  }
})));
app.use(convert(json()));
router.use('/apis', index.routes(), index.allowedMethods());
app.use(router.routes(), router.allowedMethods());

// response
app.on('error', function(err, ctx){
  console.error(err);
});

app.listen(3000,()=>{
  console.log('[demo] server is starting at port 3000');
});

module.exports = app;


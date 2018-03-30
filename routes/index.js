// 主要内容接口
const router = require('koa-router')();
const { handleJson,writeJsons } = require('../controller/index');
const urlPath = require('../config/jsonPath');
const reg = /^(\d{4})-(\d{2})-(\d{2})$/

const koaBody = require('koa-body')({
  multipart: true,  // 允许上传多个文件
  formidable: { 
    uploadDir: '/public/static/',// 上传的文件存储的路径 
    keepExtensions: true  //  保存图片的扩展名
  }
});

router.post('/upload', async (ctx,next)=>{
  console.log(ctx.request.body)
  var tag = 'upload_';
  var hashName = ctx.request.body.files.img.path.split(tag)[1];
  var imgName = tag + hashName;
  ctx.body = {info:imgName};
})

//
router.post('/content', async (ctx,next)=>{
  let data = ctx.request.body
  if (!reg.test(data.time) || !data.content || !data.title) { 
    ctx.body = {
      errCode:'30000',
      errMsg:'参数错误'
    }
    next()
    return 
  } 
  let time = data.time
  let title = data.title
  await writeJsons(urlPath.detailUrl+data.time+'.json',JSON.stringify(data),ctx,next,'detail')
  let res = await handleJson(urlPath.listUrl,{"time":time,"title":title},ctx,next,'list')
  ctx.body = {
    status:res
  }
  next()
})

module.exports = router;
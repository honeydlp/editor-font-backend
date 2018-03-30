const fs = require('fs');

async function readJsons(url,ctx,next){
  let data = await new Promise((resolve,reject)=>{
    fs.readFile(url,'utf-8',function(err,data){
      if(err){
        ctx.body = {
          errCode:'10000',
          errMsg :url+'读文件错误，请稍后再试'
        }
      }
      resolve(data)
    });
  })
  return JSON.parse(data)
}

async function writeJsons(url,data,ctx,next) {
  let dataFlag = await new Promise((resolve,reject)=>{
    fs.writeFile(url,data,{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
      if(err){
        ctx.body = {
          errCode:'20000',
          errMsg :url+'写文件错误，请稍后再试'
        }
        next()
        return
      }
      resolve(true)
    }) 
  })
  return dataFlag
}

async function handleJson(url,data,ctx,next,type) {
  let tempJson = await readJsons(url,ctx,next)
  cloneObj(tempJson,data,type)
  let res = await writeJsons(url,JSON.stringify(cloneObj(tempJson,data,type)),ctx,next)
  return res;
}

function cloneObj(destObj,data,type){
  if(typeof data == 'string'){
    data = JSON.parse(data)
  }
  if(typeof destObj == 'string'){
    destObj = JSON.parse(destObj)
  }
  destObj[type].push(data)
  destObj[type] = sort(destObj[type])
  return {
    [type]:destObj[type]
  }
}

function sort(data){
  data.sort((a,b)=>{
    a.time > b.time
  })
  return data 
}

exports.handleJson = handleJson
exports.writeJsons = writeJsons
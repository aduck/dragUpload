const express = require('express')
const app = express()
const path = require('path')
const multer = require('multer')

app.use(express.static(path.resolve(__dirname,'public')))

// 上传配置
let imgReg=/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/
let updir = path.resolve(__dirname,'upload')
let storage = multer.diskStorage({
  destination(req,file,cb){
    cb(null,updir)
  },
  filename(req,file,cb){
    cb(null,`${file.fieldname}_${Date.now()}_${Math.round(Math.random()*99+1)}.jpg`)
  }
})
let upload=multer({
  storage,
  limits:{
    fileSize:2000*1024*1024
  },
  fileFilter(req,file,cb){
    imgReg.test(file.originalname) ? cb(null,true) : cb(null,false)
  }
}).fields([{name:'thumb',maxCount:20}])

// 路由
app.get('/', (req,res)=>{
  res.sendFile(path.resolve(__dirname, 'index.html'))
})
app.post('/upload',(req,res)=>{
  upload(req,res,err=>{
    if(err) return
    res.json(req.files)
  })
})

app.listen(process.env.PORT || 8080)
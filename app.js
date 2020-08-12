require("./db/mongoose")
const express=require('express')
const multer=require('multer')
const path=require('path')
const cors=require('cors')
const uploadFile=require('./fileUpload')
const readData=require('./readData')
const { fsyncSync, unlinkSync } = require("fs")

const upload = multer()

const app=express()
app.use(express.json());
app.use(cors());


data=[]
writeData=[]
num=0

app.post('/upload',upload.single('myFile'),async (req, res) => { 
        try{
            console.log(path.extname(req.file.originalname))
            if(req.file.originalname=="")
            {
                throw ({message:"The file is empty.Try Again"})
            }
            else if(path.extname(req.file.originalname)!==".csv")
            {
                throw({message:"Only CSV files are allowed"})
            }
            else{
                data=[]
                writeData=[]
                num=0
                await readData(req.file.buffer.toString())
                await uploadFile(fileName);
                unlinkSync(fileName)
                res.status(201).send({message:"Successful",data:writeData,rows:num,fileLink:location})
                console.log(data)
            }
        }catch(e){
            console.log(e);
            res.status(400).send(e);
        }   
})

module.exports=app
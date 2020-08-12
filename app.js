require("./db/mongoose")
const express=require('express')
const multer=require('multer')
const cors=require('cors')
const upload = multer()
const uploadFile=require('./fileUpload')
const readData=require('./readData')

const app=express()
app.use(express.json());
app.use(cors());

fileName="output.csv"

data=[]
writeData=[]
num=0

const eraseData=()=>{
    writeData=[]
    data=[]
}
app.post('/upload', upload.single('myFile'),async (req, res) => {
    try{
        await readData(req.file.buffer.toString())
        await uploadFile(fileName);
        res.status(201).send({message:"Successful",data:writeData,rows:num,fileLink:location})
    }catch(e){
        console.log(e);
        res.status(400).send({error:e});
    }
},eraseData)

module.exports=app
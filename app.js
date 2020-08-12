require("./db/mongoose")
const express=require('express')
const multer=require('multer')
const cors=require('cors')
const uploadFile=require('./fileUpload')
const readData=require('./readData')

const upload = multer()

const app=express()
app.use(express.json());
app.use(cors());

fileName="output.csv"

data=[]
writeData=[]
num=0

app.post('/upload',upload.single('myFile'),async (req, res) => { 
        try{
            if(!req.file)
            {
                throw ({message:"The file is empty.Try Again"})
            }else if(req.file.mimetype!='text/csv')
            {
                throw({message:"The file is not a CSV file"})
            }
            else{
                data=[]
                writeData=[]
                num=0
                await readData(req.file.buffer.toString())
                await uploadFile(fileName);
                res.status(201).send({message:"Successful",data:writeData,rows:num,fileLink:location})
            }
        }catch(e){
            console.log(e);
            res.status(400).send({error:e});
        }   
})

module.exports=app
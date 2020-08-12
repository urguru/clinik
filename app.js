require("./db/mongoose")
const express=require('express')
const {Readable}=require('stream')
const multer=require('multer')
const app=express()
const cors=require('cors')
const upload = multer()
const csv=require('csv-parser')
const User=require('./models/user')

app.use(express.json());
app.use(cors());
app.get('/', (req, res)=> {
      res.send("Hello there!")
})

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'firstName', title: 'FirstName'},
    {id: 'lastName', title: 'LastName'},
   {id:'phone',title:"Phone"}
  ]
});

data=[]
writeData=[]
num=0


readData=async (buffer)=>{
    await Readable.from(buffer)
    .pipe(csv())
    .on('data',async (row) => {
        try{
            const user=new User({...row})
            writeData.push(user)
            const userData={
                firstName:user.firstName,
                lastName:user.lastName,
                phone:user.phone
            }
            data.push(userData)
            num+=1
        }
        catch(e){
            console.log(e)
            console.log("Some Error has been found")
        }
    })
    .on('end',()=>{
        console.log('CSV File successfully read');
        writeData.forEach(async (user)=>{await user.save()})
        csvWriter.writeRecords(data)
            .then((obj)=>{
                data=[]
                writeData=[]
                console.log('The file was written successfully')
            })
    })

}

app.post('/upload', upload.single('myFile'),async (req, res) => {
    try{
        await readData(req.file.buffer.toString())
        res.status(201).send({message:"Successful",data:writeData,rows:num,path:__dirname+'\\out.csv'})
    }catch(e){
        console.log(e);
        res.status(400).send({error:e});
    }
})

module.exports=app
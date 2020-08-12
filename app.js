require("./db/mongoose")
const express=require('express')
const {Readable}=require('stream')
const multer=require('multer')
const aws=require('aws-sdk')
const app=express()
const fs=require('fs')
const cors=require('cors')
const upload = multer()
const csv=require('csv-parser')
const User=require('./models/user')

app.use(express.json());
app.use(cors());
app.get('/', (req, res)=> {
      res.send("Hello there!")
})

const S3_BUCKET=process.env.S3_BUCKET
aws.config.region='ap-south-1'
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out21.csv',
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
                console.log(obj)
                data=[]
                writeData=[]
                console.log('The file was written successfully')
            })
    })

}

app.post('/upload', upload.single('myFile'),async (req, res) => {
    try{
        console.log(req.file)
        await readData(req.file.buffer.toString())
        await uploadFile();
        res.status(201).send({message:"Successful",data:writeData,rows:num,path:__dirname+'\\out.csv'})
    }catch(e){
        console.log(e);
        res.status(400).send({error:e});
    }
})


const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const fileName = 'out21.csv';

const uploadFile = () => {
  fs.readFile(fileName, (err, data) => {
     if (err) throw err;
     console.log("hello hi",data)
     const params = {
         Bucket: S3_BUCKET, // pass your bucket name
         Key: 'contacts123as.csv', // file will be saved as testBucket/contacts.csv
         Body: data.toString(),
         ACL: 'public-read',
         Expires: 60

     };
     s3.upload(params, function(s3Err, data) {
         if (s3Err) throw s3Err
         console.log(`File uploaded successfully at ${data.Location}`)
     });
  });
};



module.exports=app
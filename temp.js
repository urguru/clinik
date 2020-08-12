const mongoose=require('mongoose')
mongoose.connect('mongodb+srv://urguru_4648:urguru4648@urguru-ynjlt.mongodb.net/clinic?retryWrites=true&w=majority',{useNewUrlParser: true})

const app=require("./app")
const port= process.env.PORT|| 3000

app.listen(port,()=>{
    console.log("Server started successfully")
})

const fs=require('fs')
const csv=require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
  path: 'out.csv',
  header: [
    {id: 'firstName', title: 'FirstName'},
    {id: 'lastName', title: 'LastName'},
   {id:'phone',title:"Phone"}
  ]
});
const User=require('./models/user')
app.use(express.json());

let data=[]

fs.createReadStream('test.csv')
    .pipe(csv())
    .on('data',async (row) => {
        try{
            const user=new User({...row})
            await user.save()
            const addUser={
                firstName:user.firstName,
                lastName:user.lastName,
                phoneNo:user.phone
            }
            data.push(addUser)
            csvWriter.writeRecords(data)
            .then(()=>{
                console.log('The file was written successfully')
            })
        }
        catch(e){
            console.log("Some Error has been found")
        }
    })
    .on('end',()=>{
        console.log('CSV File successfully read');
    })
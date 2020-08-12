const {Readable}=require('stream')
const User=require('./models/user')
const csv=require('csv-parser');
const fs= require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

fileName="output.csv"




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
        const csvWriter = createCsvWriter({
            path: fileName,
            header: [
              {id: 'firstName', title: 'FirstName'},
              {id: 'lastName', title: 'LastName'},
             {id:'phone',title:"Phone"}
            ],
            append:false
          });
        csvWriter.writeRecords(data)
        .then(()=>{
            console.log('The file was written successfully')
        })
    })
}

module.exports=readData
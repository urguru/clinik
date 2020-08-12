const aws=require('aws-sdk')
const fs=require('fs')
const S3_BUCKET=process.env.S3_BUCKET
aws.config.region='ap-south-1'


const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
location=""

const uploadFile =(fileName) => {
    return new Promise((resolve,reject)=>{
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            const params = {
                Bucket: S3_BUCKET, // pass your bucket name
                Key: 'output'+Date.now()+'.csv', // file will be saved as testBucket/contacts.csv
                Body: data.toString(),
                ACL: 'public-read',
                Expires: 60
       
            };
             s3.upload(params, function(s3Err, data) {
                if (s3Err) throw s3Err
                console.log(`File uploaded successfully at ${data.Location}`)
                location=data.Location
                resolve()
            });
         });
    })
  };
  
module.exports=uploadFile
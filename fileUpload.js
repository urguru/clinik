const aws=require('aws-sdk')
const S3_BUCKET=process.env.S3_BUCKET
aws.config.region='ap-south-1'


const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
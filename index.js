require('dotenv').config({path: __dirname + '/.env'})
const app=require("./app")
const port= process.env.PORT|| 3003


app.listen(port,()=>{
    console.log("Server started successfully")
})
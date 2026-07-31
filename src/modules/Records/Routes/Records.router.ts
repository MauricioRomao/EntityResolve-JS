import express from "express"
import { RecordValidation } from "../../../shared/Middlewares/RecordValidation.js"
import { getrecordsController } from "../controllers/GET/Getrecords.js"
import {GetRecordsRepository} from "../Repositories/GET/Getrecords.js"
import {createRecordsRepository} from "../Repositories/POST/CreateRecords.js"
import {CreateRecordsController} from "../controllers/POST/CreateRecords.js"

const  Recordsrouter =  express.Router()


Recordsrouter.get("/records", async  (req,res)=>{
     const repository = new GetRecordsRepository
     const controller =  new getrecordsController(repository)   
     const {statusCode, body} = await  controller.handle()
     res.status(statusCode).send(body)
})

Recordsrouter.post("/records", RecordValidation, async (req,res)=>{
   
     const repository = new createRecordsRepository
     const controller =  new CreateRecordsController(repository)   
     console.log(repository)
     const {statusCode, body} = await  controller.handle(req)
     res.status(statusCode).send(body)
     
})


//Recordsrouter.post("/records" , RecordValidation, RecordServices  )


export {Recordsrouter}





import express from "express"
import { RecordServices } from "../services/RecordService.js"
import { RecordValidation } from "../../../shared/Middlewares/RecordValidation.js"
import { getrecordsController } from "../controllers/Getrecords.js"
import {GetRecordsRepository} from "../Repositories/Getrecords.js"
const  Recordsrouter =  express.Router()


Recordsrouter.get("/records", async  (req,res)=>{
     /*
     const repository = new GetRecordsRepository
     const controller =  new getrecordsController(repository)   
     const {statusCode, body} = await  controller.handle()
     res.send(body).status(statusCode)
     
     */
})

Recordsrouter.post("/records" , RecordValidation, RecordServices  )


export {Recordsrouter}





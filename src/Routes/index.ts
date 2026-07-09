import express from "express"
import { RecordValidation } from "../Middlewares/RecordValidation.js"
import { RecordServices } from "../services/RecordService.js"

export const router = express.Router()




router.post("/records" , RecordValidation, RecordServices  )

router.get("/records", (req,res)=>{
  
     return  res.json({response:"data"})

})
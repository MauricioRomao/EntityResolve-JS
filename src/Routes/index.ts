import express from "express"
import { RecordValidation } from "../Middlewares/RecordValidation.js"

export const router = express.Router()




router.post("/records" , RecordValidation )
router.get("/records", (req,res)=>{
  
     return  res.json({response:"data"})

})
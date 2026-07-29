import express from "express"

import {Recordsrouter} from "../modules/Records/Routes/Records.router.js"
export const router = express.Router()

router.use("/records", Recordsrouter )

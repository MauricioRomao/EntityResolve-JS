import express from "express"
import {router} from "./Routes/index.js"


const server = express()

server.use(express.json())
server.use(router)



server.listen(3000, ()=> console.log("Server running"))

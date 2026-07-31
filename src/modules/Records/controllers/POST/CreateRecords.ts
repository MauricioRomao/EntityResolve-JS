import type { Records } from "../../../../shared/Models/records.js";
import type { HttpRequest, HttpResponse } from "../protocols.js";
import type { createRecordsParams, ICreateRecordsController, ICreateRecordsRepository } from "./protocols.js";
import { generateBlockingKeys } from "../../../Utils/blocking/generateBlockingKeys.js";
export class CreateRecordsController implements ICreateRecordsController {

    constructor (private readonly CreateRecordsRepository : ICreateRecordsRepository ){}

    async handle(httpRequest:HttpRequest<createRecordsParams>): Promise<HttpResponse<Records>> {

        try {
            
            const {body} = httpRequest
               
            const {sobrenome, datanascimento, bi} = body

         const keys = generateBlockingKeys(sobrenome, datanascimento, bi)
         console.log(keys)

              
            const Records = await this.CreateRecordsRepository.Create(body)
            return {

                statusCode:201,
                body:Records
            }
            
        } catch (error) {
               return {
                statusCode:400,
                body:"Erro interno do servidor"
            }
        }
        
    }

}
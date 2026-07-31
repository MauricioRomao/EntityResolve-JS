import type { Records } from "../../../../shared/Models/records.js";
import type { createRecordsParams, ICreateRecordsRepository } from "../../controllers/POST/protocols.js";





export class createRecordsRepository  implements ICreateRecordsRepository {
    async Create(params: createRecordsParams): Promise<Records> {
      
        return params 

    }

}
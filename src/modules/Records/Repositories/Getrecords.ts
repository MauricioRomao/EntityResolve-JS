import type { Records } from "../../../shared/Models/records.js";
import  type  {IGetRecordsRepository} from "../protocols.js"

export class GetRecordsRepository implements IGetRecordsRepository{
   async  GetRecords(): Promise<Records[]> {
          
      return [{
            nome:"Mauricio",
            sobrenome:"Romão",
            agencia:"Kilamaba",
            datanascimento:"1995-05-1",
            bi:"ndfknklklfkwefk"
      }]
         
    }
    
    
}
import type { HttpResponse } from "../protocols.js"
import type { Records } from "../../../../shared/Models/records.js"

export interface IGetRecordscontrollers  {
     handle():Promise<HttpResponse<Records[]>>
      }

export interface IGetRecordsRepository  {
     GetRecords():Promise<Records[]>

}

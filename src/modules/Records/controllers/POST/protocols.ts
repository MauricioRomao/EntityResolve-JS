import type { Records } from "../../../../shared/Models/records.js";
import type { HttpRequest, HttpResponse } from "../protocols.js";

export interface createRecordsParams {
    nome: string,
    sobrenome: string,
    agencia: string,
    bi: string,
    datanascimento: string
}

export interface ICreateRecordsRepository {

    Create(params:createRecordsParams): Promise<Records>


}


export interface ICreateRecordsController {

    handle(httpRequest: HttpRequest<createRecordsParams>):Promise<HttpResponse<Records>>


}
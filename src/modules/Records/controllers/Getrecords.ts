import type { IGetRecordscontrollers, IGetRecordsRepository } from "../protocols.js";

export class getrecordsController implements IGetRecordscontrollers {

    constructor(private readonly IGetRecordsRepository: IGetRecordsRepository) { }


    async handle() {
        try {
            const records = await this.IGetRecordsRepository.GetRecords()
            return {
                statusCode: 200,
                body: records

            }
        } catch (error) {
            return {
                statusCode: 500,
                body: "Ocorreu algum erro interno"

            }
        }

    }


}
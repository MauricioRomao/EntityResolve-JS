import type { RequestHandler } from "express";

export const RecordServices: RequestHandler = async (req, res, next) => {
    try {
       
        const { sobrenome, dataNascimento, bi,  } = req.body; 

       
        function generateBlockingKeys(surname: string, birthDate: string, cleanBI: string) {
            const keys: string[] = [];

            
            const birthYear = birthDate ? new Date(birthDate).getFullYear() : null;

            
            if (surname.length >= 3 && birthYear) {
                keys.push(`SN3_${surname.slice(0, 3).toUpperCase()}_${birthYear}`);
            }

         
            if (cleanBI.length >= 4) {
                keys.push(`DOC4_${cleanBI.slice(0, 4)}`);
            }

            return keys;
        }

        const chaves = generateBlockingKeys(sobrenome, dataNascimento, bi);

        return res.json({
            status: "Sucesso",
            chavesGeradas: chaves
        });

    } catch (error) {
        return res.status(500).json({ status: "Erro", erro: "Falha no serviço." });
    }
};

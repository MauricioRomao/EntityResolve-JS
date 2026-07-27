import type { RequestHandler } from "express";

function generateBlockingKeys(surname: string, birthDate: string, bi: string): string[] {
    const keys: string[] = [];

    const birthYear = birthDate ? new Date(birthDate).getFullYear() : null;

    if (surname.length >= 3 && birthYear && !Number.isNaN(birthYear)) {
        keys.push(`SN3_${surname.slice(0, 3)}_${birthYear}`);
    }

    if (bi.length >= 4) {
        keys.push(`DOC4_${bi.slice(0, 4)}`);
    }

    return keys;
}

export const RecordServices: RequestHandler = async (req, res, next) => {
    try {
      
        const { sobrenome, dataNascimento, bi } = req.body;

        const chaves = generateBlockingKeys(sobrenome, dataNascimento, bi);

        return res.json({
            status: "Sucesso",
            chavesGeradas: chaves
        });

    } catch (error) {
        console.error("Erro em RecordServices:", error);
        return res.status(500).json({ status: "Erro", erro: "Falha no serviço." });
    }
};
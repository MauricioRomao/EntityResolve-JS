import type { RequestHandler } from "express";

const regexBIAngola = /^[0-9]{9}[A-Z]{2}[0-9]{2}[0-9]{1}$/;
const regexTelefoneAngola = /^(?:\+?244)?(2[0-9]{8}|9[0-9]{8})$/;

// Nada de Zod nem Yup, hoje vamos a manuali**** kkkk
export const RecordValidation: RequestHandler = async (req, res, next) => {
    try {
        const { nome, sobrenome, agencia, telefone, bi, dataNascimento } = req.body;

    
        const nomeLimpo = nome ? nome.trim() : "";
        const sobrenomeLimpo = sobrenome ? sobrenome.trim().toUpperCase() : "";
        const agenciaLimpa = agencia ? agencia.trim() : "";
        const telefoneLimpo = telefone ? telefone.replace(/[^\d+]/g, "") : "";
        const biLimpo = bi ? bi.trim().toUpperCase() : "";
        const dataNascimentoLimpa = dataNascimento ? dataNascimento.trim() : "";

        // Validações
        if (!nomeLimpo || nomeLimpo.length < 3) {
            return res.status(400).json({ status: "Falha", erro: "O nome deve ter pelo menos 3 caracteres." });
        }

        if (!sobrenomeLimpo || sobrenomeLimpo.length < 3) {
            return res.status(400).json({ status: "Falha", erro: "O sobrenome é obrigatório e deve ter pelo menos 3 caracteres." });
        }

        if (!agenciaLimpa) {
            return res.status(400).json({ status: "Falha", erro: "A agência é obrigatória." });
        }

        if (!regexTelefoneAngola.test(telefoneLimpo)) {
            return res.status(400).json({ status: "Falha", erro: "Formato de telefone inválido." });
        }

        if (!regexBIAngola.test(biLimpo)) {
            return res.status(400).json({ status: "Falha", erro: "Formato de BI inválido." });
        }

        if (!dataNascimentoLimpa || isNaN(Date.parse(dataNascimentoLimpa))) {
            return res.status(400).json({ status: "Falha", erro: "A data de nascimento é obrigatória e deve ser uma data válida." });
        }
    
       
        req.body = {
            nome: nomeLimpo,
            sobrenome: sobrenomeLimpo,
            agencia: agenciaLimpa,
            telefone: telefoneLimpo,
            bi: biLimpo,
            dataNascimento: dataNascimentoLimpa
        };
         
            return next();

    } catch (error) {
        return res.status(500).json({ status: "Erro interno", erro: error });
    }
};

import type { RequestHandler } from "express";

const regexBIAngola = /^[0-9]{9}[A-Z]{2}[0-9]{2}[0-9]{1}$/;
const regexTelefoneAngola = /^(?:\+?244)?(2[0-9]{8}|9[0-9]{8})$/;

// Nada de Zod nem Yup, hoje vamos a manuali**** kkkk

export const RecordValidation: RequestHandler = async (req, res, next) => {
    try {
        const { nome, agencia, telefone, bi } = req.body;

      
        const nomeLimpo = nome ? nome.trim() : "";
        const agenciaLimpa = agencia ? agencia.trim() : "";
        
        
        const telefoneLimpo = telefone ? telefone.replace(/[^\d+]/g, "") : "";
    
      const biLimpo = bi ? bi.trim().toUpperCase() : "";
        if (!nomeLimpo || nomeLimpo.length < 3) {
            return res.status(400).json({ status: "Falha", erro: "O nome deve ter pelo menos 3 caracteres." });
        }

        if (!agenciaLimpa) {
            return res.status(400).json({ status: "Falha", erro: "A agência é obrigatória." });
        }

        if (!regexTelefoneAngola.test(telefoneLimpo)) {
            return res.status(400).json({ status: "Falha", erro: "Formato de telefone  inválido." });
        }

        if (!regexBIAngola.test(biLimpo)) {
            return res.status(400).json({ status: "Falha", erro: "Formato de BI  inválido." });
        }
    
         
    
       res.json({
            status: "Sucesso",
        });
        return next

    } catch (error) {
        return res.status(500).json({ status: "Erro interno", erro: error });
    }
};

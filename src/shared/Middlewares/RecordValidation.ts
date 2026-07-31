import type { RequestHandler } from "express";

const regexBIAngola = /^[0-9]{9}[A-Z]{2}[0-9]{3}$/;
const regexTelefoneAngola = /^(?:\+?244)?(2[0-9]{8}|9[0-9]{8})$/;
const regexNome = /^[\p{L}\s'-]+$/u;

const normalizeAccents = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const asString = (value: unknown): string =>
    typeof value === "string" ? value : "";

export const RecordValidation: RequestHandler = async (req, res, next) => {
    try {
        const { nome, sobrenome, agencia, telefone, bi, datanascimento } = req.body;

        const nomeLimpo = asString(nome).trim();
        const sobrenomeLimpo = normalizeAccents(asString(sobrenome).trim()).toUpperCase();
        const agenciaLimpa = asString(agencia).trim();
        const telefoneLimpo = asString(telefone).replace(/[^\d+]/g, "");
        const biLimpo = asString(bi).trim().toUpperCase();
        const dataNascimentoLimpa = asString(datanascimento).trim();

        if (!nomeLimpo || nomeLimpo.length < 3) {
            return res.status(400).json({
                status: "Falha",
                erro: "O nome deve ter pelo menos 3 caracteres."
            });
        }

        if (!regexNome.test(nomeLimpo)) {
            return res.status(400).json({
                status: "Falha",
                erro: "O nome só pode conter letras."
            });
        }

        if (!sobrenomeLimpo || sobrenomeLimpo.length < 3) {
            return res.status(400).json({
                status: "Falha",
                erro: "O sobrenome é obrigatório e deve ter pelo menos 3 caracteres."
            });
        }

        if (!regexNome.test(sobrenomeLimpo)) {
            return res.status(400).json({
                status: "Falha",
                erro: "O sobrenome só pode conter letras."
            });
        }

        if (!agenciaLimpa) {
            return res.status(400).json({
                status: "Falha",
                erro: "A agência é obrigatória."
            });
        }

        if (!regexTelefoneAngola.test(telefoneLimpo)) {
            return res.status(400).json({
                status: "Falha",
                erro: "Formato de telefone inválido."
            });
        }

        if (!regexBIAngola.test(biLimpo)) {
            return res.status(400).json({
                status: "Falha",
                erro: "Formato de BI inválido."
            });
        }

        if (!dataNascimentoLimpa || isNaN(Date.parse(dataNascimentoLimpa))) {
            return res.status(400).json({
                status: "Falha",
                erro: "A data de nascimento é obrigatória e deve ser uma data válida."
            });
        }

        const nascimento = new Date(dataNascimentoLimpa);
        const hoje = new Date();

        if (nascimento > hoje) {
            return res.status(400).json({
                status: "Falha",
                erro: "Data de nascimento não pode ser no futuro."
            });
        }

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (
            mes < 0 ||
            (mes === 0 && hoje.getDate() < nascimento.getDate())
        ) {
            idade--;
        }

        if (idade < 18) {
            return res.status(400).json({
                status: "Falha",
                erro: "Titular deve ser maior de idade."
            });
        }

        req.body = {
            nome: nomeLimpo,
            sobrenome: sobrenomeLimpo,
            agencia: agenciaLimpa,
            telefone: telefoneLimpo,
            bi: biLimpo,
            datanascimento: dataNascimentoLimpa
        };

        return next();
    } catch (error) {
        console.error("Erro em RecordValidation:", error);
        return res.status(500).json({
            status: "Erro interno",
            erro: "Falha ao validar os dados."
        });
    }
};
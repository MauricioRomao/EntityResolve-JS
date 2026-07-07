import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { RecordValidation } from "../src/Middlewares/RecordValidation.js"; 


const app = express();
app.use(express.json());
app.post("/records", RecordValidation);

describe("Testes do Controlador RecordValidation", () => {
    
    // --- CENÁRIO DE SUCESSO ---
    it("deve retornar sucesso com dados limpos quando o input for válido", async () => {
        const payloadValido = {
            nome: "  António Manuel  ", 
            agencia: "0040",
            telefone: "+244 (923) 123-456", // 
            bi: "005152164ue043" // 
        };

        const resposta = await request(app)
            .post("/records")
            .send(payloadValido);

        // Valida o status HTTP de sucesso
           expect(resposta.status).toBe(200);
        
        // Valida se a estrutura de resposta está correta
        expect(resposta.body).toHaveProperty("status", "Sucesso");
        
        // Garante que a normalização (limpeza de dados) funcionou no backend
        expect(resposta.body.dados).toEqual({
            nome: "António Manuel",
            agencia: "0040",
            telefone: "244923123456", 
            bi: "005152164UE043" 
        });
    });
// BI curto demais (inválido)
    // --- CENÁRIOS DE FALHA ---
        it("deve falhar se o BI de Angola tiver o formato incorreto", async () => {
        const payloadBiInvalido = {
            nome: "António Manuel",
            agencia: "0040",
            telefone: "923123456",
            bi: "12345" 
        };

        const resposta = await request(app)
            .post("/records")
            .send(payloadBiInvalido);

        expect(resposta.status).toBe(400);
        expect(resposta.body.status).toMatch(/Falha/);
    });
                // Não começa com 9 nem com 2
    it("deve falhar se o número de telefone não seguir as regras de Angola", async () => {
        const payloadTelefoneInvalido = {
            nome: "António Manuel",
            agencia: "0040",
            telefone: "123456789",
            bi: "005152164UE043"
        };

        const resposta = await request(app)
            .post("/records")
            .send(payloadTelefoneInvalido);

        expect(resposta.status).toBe(400);
        expect(resposta.body.status).toMatch(/Falha/);
    });
                         // Menos de 3 caracteres //
    it("deve falhar se o nome for muito curto", async () => {
        const payloadNomeInvalido = {
            nome: "An", 
            agencia: "0040",
            telefone: "923123456",
            bi: "005152164UE043"
        };

        const resposta = await request(app)
            .post("/records")
            .send(payloadNomeInvalido);

        expect(resposta.status).toBe(400);
        expect(resposta.body.status).toMatch(/Falha/);
    });
});

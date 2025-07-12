const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

//Função reutilizável para responder quando o método HTTP não é permitido.
const methodNotAllowed = (req, res) => {
    res.status(405).json({
        error: 'Método Não Permitido',
        message: `O método ${req.method} não é permitido para a rota ${req.originalUrl}.`
    });
};

// --- ROTAS REFATORADAS COM app.route() ---

// Rota Raiz: Só permite GET
app.route('/')
    .get((req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
    })
    .all(methodNotAllowed); // Rejeita POST, PUT, DELETE, etc.

// Rota de Sugestão: Só permite GET
app.route('/sugestao')
    .get((req, res) => {
        // ... (lógica para adicionar lanche ao JSON, como já implementado)
        const { nome, ingredientes } = req.query;
        const lanchesFilePath = path.join(__dirname, 'public', 'data', 'lanches.json');
        fs.readFile(lanchesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).send('Erro ao ler o arquivo.');
            let lanches = [];
            if (data) lanches = JSON.parse(data);
            const novoId = lanches.length > 0 ? lanches[lanches.length - 1].id + 1 : 1;
            lanches.push({ id: novoId, nome, ingredientes });
            fs.writeFile(path.join(__dirname, 'public', 'data', 'lanches.json'), JSON.stringify(lanches, null, 2), 'utf8', (writeErr) => {
                if (writeErr) return res.status(500).send('Erro ao salvar o lanche.');
                res.status(200).send(
                `
                    <!DOCTYPE html>
                    <html lang="pt-BR">
                        <head>
                            <meta charset="UTF-8">
                            <title>Obrigado pela Sugestão! - DevBurger</title>
                            <link rel="stylesheet" href="/css/style.css">
                        </head>
                        <body>
                            <div class="container">
                                <h1>Obrigado pela sua sugestão!</h1>
                                <div class="thank-you-box">
                                    <p>Recebemos sua deliciosa sugestão de lanche:</p>
                                    <p><strong>Nome:</strong> ${nome}</p>
                                    <p><strong>Ingredientes:</strong> ${ingredientes}</p>
                                    <p>Nossa equipe de chefs irá analisar com carinho!</p>
                                </div>
                                <a href="/">Voltar ao Cardápio</a>
                            </div>
                        </body>
                    </html>
                `
                );
            });
        });
    })
    .all(methodNotAllowed);

// Rota de Contato: Permite GET (para ver o form) e POST (para enviar o form)
app.route('/contato')
    .get((req, res) => {
        res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
    })
    .post((req, res) => {
        const { nome } = req.body;
        const { email } = req.body;
        const { assunto } = req.body;
        const { mensagem } = req.body;
        res.status(200).send(`
            <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <title>Contato Recebido - DevBurger</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <div class="container">
                <h1>Mensagem Recebida!</h1>
                <div class="thank-you-box">
                    <p>Olá, <strong>${nome}</strong>. Agradecemos por seu contato!</p>
                    <p>Recebemos sua mensagem sobre "<strong>${assunto}</strong>" e em breve retornaremos no e-mail <strong>${email}</strong>, se necessário.</p><hr>
                    <p><em>Sua mensagem: "${mensagem}"</em></p>
                     </div>
                <a href="/">Voltar ao Cardápio</a>
            </div>
        </body>
        </html>
        `);
    })
    .all(methodNotAllowed);

// Rota de API de Lanches: Só permite GET
app.route('/api/lanches')
    .get((req, res) => {
        // ... (lógica de leitura e validação do JSON, como já implementado)
        const lanchesFilePath = path.join(__dirname, 'public', 'data', 'lanches.json');
        fs.readFile(lanchesFilePath, 'utf8', (err, data) => {
            if (err) return res.status(500).json({ error: 'Erro interno.' });
            try {
                const lanches = JSON.parse(data);
                if (lanches.length < 3) return res.status(400).json({ error: 'Dados insuficientes.' });
                res.status(200).json(lanches);
            } catch (parseErr) {
                return res.status(500).json({ error: 'Dados corrompidos.' });
            }
        });
    })
    .all(methodNotAllowed);

// Middleware para Tratamento de Erro 404 (Rotas que não existem)
// Este middleware só será alcançado se nenhuma das rotas acima corresponder.
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`);
});
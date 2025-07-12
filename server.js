const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// MIDDLEWARES
// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para interpretar o corpo de requisições POST com dados de formulário
app.use(express.urlencoded({ extended: true }));


// ROTAS
// Rota Raiz (GET /): Serve a página principal do cardápio.
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota de Sugestão (GET /sugestao): Processa o formulário de sugestão.
app.get('/sugestao', (req, res) => {
    // Captura os dados da query string
    const { nome, ingredientes } = req.query;

    // Gera uma página de agradecimento dinâmica
    res.status(200).send(`
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
    `);
});

// Rota de Contato (GET /contato): Serve a página com o formulário de contato.
app.get('/contato', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
});

// Rota de Contato (POST /contato): Recebe os dados do formulário de contato.
app.post('/contato', (req, res) => {
    // Captura os dados do corpo da requisição
    const { nome, email, assunto, mensagem } = req.body;
    
    // Simula o processamento e exibe uma página de confirmação dinâmica
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
                    <p>Recebemos sua mensagem sobre "<strong>${assunto}</strong>" e em breve retornaremos no e-mail <strong>${email}</strong>, se necessário.</p>
                    <hr>
                    <p><em>Sua mensagem: "${mensagem}"</em></p>
                </div>
                <a href="/">Voltar ao Cardápio</a>
            </div>
        </body>
        </html>
    `);
});

// Rota de API (GET /api/lanches): Retorna a lista de lanches em JSON.
app.get('/api/lanches', (req, res) => {
    const lanchesFilePath = path.join(__dirname, 'public', 'data', 'lanches.json');

    fs.readFile(lanchesFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao ler o arquivo de lanches.' });
        }

        let lanches;
        try {
            lanches = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Erro ao processar os dados de lanches.' });
        }

        if (lanches.length < 3) {
            return res.status(400).json({ error: 'Menos de 3 lanches disponíveis.' });
        }

        res.status(200).json(lanches);
    });
});


// Middleware para Tratamento de Erro 404 (Página Não Encontrada)
app.use((req, res) => {
    if (lanches.length < 3) {
    return res.status(400).json({ error: 'Menos de 3 lanches disponíveis.' });
}res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


// INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`);
});
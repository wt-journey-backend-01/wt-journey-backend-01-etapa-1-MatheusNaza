const express = require('express');
const path = require('path');
const fs = require('fs'); 

const app = express();
const PORT = 3000;

// MIDDLEWARES
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


// ROTAS
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Rota de Sugestão (GET /sugestao): SALVA O LANCHE NO JSON
app.get('/sugestao', (req, res) => {
    const { nome, ingredientes } = req.query;

    const lanchesFilePath = path.join(__dirname, 'public', 'data', 'lanches.json');

    // 2. Le o arquivo JSON existente
    fs.readFile(lanchesFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao ler o arquivo de lanches.');
        }

        // 3. Converte o conteúdo do arquivo para um objeto JavaScript
        const lanches = JSON.parse(data);

        // 4. Cria o novo lanche e o adicionamos ao array
        const novoId = lanches.length > 0 ? lanches[lanches.length - 1].id + 1 : 1;
        const novoLanche = {
            id: novoId,
            nome: String(nome),
            ingredientes: String(ingredientes)
        };
        lanches.push(novoLanche);

        // 5. Converte o array atualizado de volta para uma string JSON formatada
        const dadosAtualizados = JSON.stringify(lanches, null, 2);

        // 6. Escreve os dados atualizados de volta no arquivo
        fs.writeFile(lanchesFilePath, dadosAtualizados, 'utf8', (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).send('Erro ao salvar o novo lanche.');
            }

            // 7. Se tudo deu certo, envia a página de agradecimento
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
                        <h1>Sugestão Salva com Sucesso!</h1>
                        <div class="thank-you-box">
                            <p>Sua deliciosa sugestão de lanche foi adicionada ao nosso cardápio de ideias:</p>
                            <p><strong>Nome:</strong> ${novoLanche.nome}</p>
                            <p><strong>Ingredientes:</strong> ${novoLanche.ingredientes}</p>
                            <p>Vá para a <a href="/api/lanches" target="_blank">API de Lanches</a> para ver sua sugestão!</p>
                        </div>
                        <a href="/">Sugerir outro lanche</a>
                    </div>
                </body>
                </html>
            `);
        });
    });
});

// Rota de Contato (GET /contato)
app.get('/contato', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
});

// Rota de Contato (POST /contato)
app.post('/contato', (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;
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
                </div>
                <a href="/">Voltar ao Cardápio</a>
            </div>
        </body>
        </html>
    `);
});

// Rota de lanches (GET /data/lanches)
app.get('/data/lanches', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', 'data', 'lanches.json'));
});

// Middleware para Tratamento de Erro 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// INICIALIZAÇÃO DO SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor da DevBurger rodando em http://localhost:${PORT}`);
});
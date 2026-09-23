// Exemplo de como isso ficaria no seu servidor Node/Express (WB Play).
// Pode ser um arquivo simples ou uma tabela no banco — aqui vai o
// exemplo mais simples possível, com um arquivo config.json no servidor.
//
// Modelo de revenda (igual ao Webplay): se no futuro cada revenda tiver
// seu próprio app com nome/cor diferentes, basta cada uma ter seu
// arquivo config-{slug}.json e seu próprio build do app apontando pra
// URL correspondente — mesma ideia do /r/slug/ que já existe no Webplay.

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const CONFIG_PATH = path.join(__dirname, 'app-config.json');

// GET /app-config.json — é isso que o app React Native consulta na abertura
router.get('/app-config.json', (req, res) => {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  res.json(config);
});

// PUT /admin/app-config — endpoint pra você (painel admin) trocar
// domínio, nome do app ou cores
// Proteja esta rota com autenticação de admin antes de usar em produção!
router.put('/admin/app-config', (req, res) => {
  const { apiBaseUrl, appName, primaryColor, secondaryColor } = req.body;
  if (!apiBaseUrl) {
    return res.status(400).json({ message: 'apiBaseUrl é obrigatório' });
  }
  const config = { apiBaseUrl, appName, primaryColor, secondaryColor };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  res.json({ message: 'Configuração atualizada', config });
});

// GET /admin/online-users — contagem de usuários online agora
// Requer que o app envie um "heartbeat" periódico (ex: a cada 30s)
// pra um endpoint tipo POST /heartbeat, e aqui você conta quantos
// tokens tiveram heartbeat nos últimos ~60s (em memória, Redis, etc.)
router.get('/admin/online-users', (req, res) => {
  res.json({ online: 0 }); // substituir pela contagem real
});

module.exports = router;

// Exemplo de lógica pro endpoint GET /catalog/featured no seu backend
// real (fora deste arquivo): o destaque do banner deve ser sempre o
// item com maior contagem de reproduções no período (ex: últimas 24h
// ou 7 dias, dependendo do que fizer mais sentido pro seu catálogo).
//
//   SELECT * FROM tracks ORDER BY play_count DESC LIMIT 1
//
// Cada vez que o app tocar uma faixa, ele deve chamar algo como
// POST /tracks/:id/play para incrementar esse contador.

// app-config.json inicial, colocar na mesma pasta:
// {
//   "apiBaseUrl": "https://api.seudominio.com",
//   "appName": "N-xTreaM",
//   "primaryColor": "#7c3aed",
//   "secondaryColor": "#0d0d0d"
// }

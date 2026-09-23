# N-xTreaM (esqueleto do app)

App de músicas e videoclipes, estilo YouTube (sem anúncio, com player em
segundo plano e controle na tela bloqueada). Login com usuário/senha,
domínio do servidor fixo no app.

## Estrutura

```
App.js                        # navegação + boot do player
src/
  screens/
    LoginScreen.js            # usuário + senha
    HomeScreen.js              # catálogo (Em alta, Playlists, Categorias)
  components/
    MiniPlayer.js               # barra fixa embaixo, estilo YouTube
  player/
    playbackService.js        # react-native-track-player (áudio em 2º plano)
  services/
    api.js                     # login, catálogo, URL de streaming
```

## O que a API (seu Node/Express) precisa expor

- `POST /login` — recebe `{ username, password }`, retorna `{ token, user }`
- `GET /catalog/featured` — retorna `{ items: [{ id, title, artist, thumbnail, streamUrl }] }`
- `GET /catalog?type=music|clip&category=...` — catálogo filtrado
- `GET /stream/:id` — serve o arquivo MP3/MP4, **com suporte a range
  requests** (essencial para permitir seek/avançar sem baixar tudo)

## Domínio configurável (sem precisar recompilar o app)

O app **não** tem mais o domínio, nome ou cores fixos no código. Em vez disso:

1. Só uma URL de "bootstrap" fica fixa (`src/services/config.js`) —
   ex: `https://config.seudominio.com/app-config.json`
2. Essa URL devolve `{ apiBaseUrl, appName, primaryColor, secondaryColor }`
3. O app busca isso ao abrir e usa esses valores pra tudo (login, catálogo,
   stream, nome exibido, cor dos botões)
4. Pra trocar qualquer coisa, você só atualiza esse JSON no seu painel
   (veja exemplo de endpoint em `server-example/app-config-endpoint.js`) —
   nenhum app precisa ser atualizado nas lojas

## Escopo do painel de controle (VPS)

O app instalado usa o armazenamento/RAM do próprio aparelho do cliente —
a VPS só precisa rodar a API leve + o painel, sem peso do app em si.
O painel deve gerenciar:

- Nome do app e cores/tema
- Domínio da API
- Pessoas online agora (via heartbeat periódico do app — endpoint de
  exemplo em `server-example/app-config-endpoint.js`)
- Opção de painel de revenda, igual ao já existente no Webplay
  (cada revenda com seu config próprio, nos moldes do `/r/slug/`)

## Passo a passo pelo celular (sem computador)

Como você está no Android sem PC, o caminho mais viável é usar o **GitHub
Codespaces** (um "computador na nuvem" que abre no navegador do celular)
pra montar o projeto, e o **GitHub Actions** (incluído neste zip em
`.github/workflows/build-android.yml`) pra compilar o APK automaticamente
— você só baixa o APK pronto depois.

**1. Criar o repositório**
- Crie conta no GitHub (se ainda não tiver) e um repositório novo (ex: `n-xtream-app`)
- Faça upload de todo o conteúdo deste zip pra dentro dele (pelo navegador:
  entre no repositório → "Add file" → "Upload files" → selecione os
  arquivos extraídos do zip)

**2. Gerar as pastas nativas (android/ios) via Codespaces**
Este zip só tem o código JavaScript do app — falta gerar a pasta `android/`
com os arquivos nativos que o Actions precisa pra compilar. Pra isso:
- No repositório, clique no botão verde "Code" → aba "Codespaces" → "Create
  codespace on main" (abre um editor com terminal, funciona no navegador do celular)
- No terminal do Codespace, rode:
  ```bash
  npx react-native init temp --version 0.74.0
  cp -r temp/android .
  cp -r temp/ios .
  rm -rf temp
  ```
- Depois: `git add . && git commit -m "Adiciona pastas nativas" && git push`

**3. Deixar o Actions compilar**
- Assim que você fizer o `push`, o GitHub Actions já começa a compilar
  sozinho (aba "Actions" do repositório, na nuvem)
- Quando terminar (ícone verde ✓), entre nesse workflow → role até
  "Artifacts" → baixe o `n-xtream-app-debug` (é o `.apk`)
- Baixou no celular? É só instalar normalmente (pode pedir pra permitir
  "instalar de fontes desconhecidas" no Android)

Esse fluxo todo roda na nuvem — GitHub Codespaces e Actions — então dá
pra fazer tudo isso direto pelo navegador do celular, sem precisar de PC.

## Testando localmente (antes de subir no GitHub)

Pré-requisitos na sua máquina:
- Node.js (LTS) instalado
- Java JDK 17
- Android Studio instalado, com um emulador criado (ou celular Android
  com depuração USB ativada)

Passos:
```bash
cd n-xtream-app
npm install
npx react-native run-android
```

Isso instala o app no emulador/celular conectado. Se der erro de módulo
nativo faltando (comum com `react-native-track-player`/`react-native-video`
em projeto "bare"), rode também:
```bash
cd android && ./gradlew clean && cd ..
```

Quando estiver testado e funcionando, é só:
```bash
git init
git add .
git commit -m "Primeira versão do N-xTreaM"
git remote add origin <url-do-seu-repo-github>
git push -u origin main
```

O `.gitignore` já está configurado pra não subir `node_modules`, builds
nativos, nem chaves/keystores sensíveis.

## Próximos passos sugeridos

1. Subir o endpoint `app-config.json` no seu servidor (Node/Express) e
   trocar `BOOTSTRAP_CONFIG_URL` em `src/services/config.js` pela URL real
2. Rodar `npx react-native init` (ou usar este código como base) e instalar
   as dependências do `package.json`
3. Configurar permissões nativas de áudio em segundo plano:
   - Android: `FOREGROUND_SERVICE` no `AndroidManifest.xml`
   - iOS: `UIBackgroundModes: audio` no `Info.plist`
4. Implementar tela de vídeo (clipes) com `react-native-video`,
   com fallback de "áudio continua, imagem congela" quando a tela é
   bloqueada durante um clipe
5. Adaptar layout para Android TV (foco por d-pad) usando `react-native-tvos`

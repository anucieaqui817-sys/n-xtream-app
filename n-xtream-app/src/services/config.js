import AsyncStorage from '@react-native-async-storage/async-storage';

// Esta é a ÚNICA URL que fica fixa no app. Ela não serve o conteúdo em si,
// só devolve a config atual: domínio da API + branding (nome/cores) —
// exatamente como o Webplay já faz por revenda. Assim, pra trocar
// domínio, nome ou cor do app, você só atualiza isso no painel — sem
// precisar recompilar ou reenviar o app pras lojas.
const BOOTSTRAP_CONFIG_URL = 'https://config.seudominio.com/app-config.json';

const CACHE_KEY = '@nxtream:config';

// Formato esperado do JSON servido em BOOTSTRAP_CONFIG_URL:
// {
//   "apiBaseUrl": "https://api.seudominio.com",
//   "appName": "N-xTreaM",
//   "primaryColor": "#7c3aed",
//   "secondaryColor": "#0d0d0d"
// }
// Se depois vocês tiverem várias revendas com apps diferentes, cada
// revenda pode ter seu próprio BOOTSTRAP_CONFIG_URL (build separado)
// devolvendo seu próprio nome/cor/domínio — igual ao /r/slug/ do Webplay.

let cachedConfig = null;

export async function initConfig() {
  if (cachedConfig) return cachedConfig;

  try {
    const res = await fetch(BOOTSTRAP_CONFIG_URL);
    const data = await res.json();
    if (data.apiBaseUrl) {
      cachedConfig = data;
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return cachedConfig;
    }
  } catch (e) {
    // Sem internet ou config fora do ar: cai pro último config salvo
  }

  const saved = await AsyncStorage.getItem(CACHE_KEY);
  if (saved) {
    cachedConfig = JSON.parse(saved);
    return cachedConfig;
  }

  throw new Error('Não foi possível carregar a configuração do servidor');
}

export function getConfig() {
  if (!cachedConfig) {
    throw new Error('Config ainda não inicializada — chame initConfig() primeiro');
  }
  return cachedConfig;
}

export function getApiBaseUrl() {
  return getConfig().apiBaseUrl;
}

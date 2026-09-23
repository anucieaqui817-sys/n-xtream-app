import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TrackPlayer from 'react-native-track-player';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import { setupPlayer } from './src/player/playbackService';
import { initConfig } from './src/services/config';

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);
  const [configError, setConfigError] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    async function boot() {
      try {
        const cfg = await initConfig(); // busca domínio + nome + cores da API
        setConfig(cfg);
        await setupPlayer();
        setReady(true);
      } catch (e) {
        setConfigError(e.message);
      }
    }
    boot();
  }, []);

  if (configError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{configError}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#7c3aed" size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#ff6b6b', paddingHorizontal: 24, textAlign: 'center' },
});

// Registra o serviço de background — necessário para o áudio continuar
// tocando com o app minimizado / tela bloqueada.
TrackPlayer.registerPlaybackService(() => require('./src/player/playbackService').PlaybackService);

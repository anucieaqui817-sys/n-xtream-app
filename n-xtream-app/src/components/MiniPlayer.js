import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';

// Barra fixa embaixo da tela, no estilo do YouTube: mostra o item
// atual, botão play/pause, e ao tocar no corpo expande pro player cheio.
export default function MiniPlayer({ currentItem, onExpand }) {
  const { playing } = useIsPlaying();

  if (!currentItem) return null;

  return (
    <TouchableOpacity style={styles.bar} onPress={onExpand} activeOpacity={0.9}>
      <Image source={{ uri: currentItem.thumbnail }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{currentItem.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{currentItem.artist}</Text>
      </View>
      <TouchableOpacity
        onPress={() => (playing ? TrackPlayer.pause() : TrackPlayer.play())}
        style={styles.playBtn}
      >
        <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  thumb: { width: 42, height: 42, borderRadius: 4 },
  info: { flex: 1, marginLeft: 10 },
  title: { color: '#fff', fontWeight: '600' },
  artist: { color: '#999', fontSize: 12 },
  playBtn: { paddingHorizontal: 14 },
  playIcon: { color: '#fff', fontSize: 20 },
});

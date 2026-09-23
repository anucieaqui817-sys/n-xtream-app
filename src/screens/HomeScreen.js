import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  getFeatured,
  getTrending,
  getPlaylists,
  getCategories,
} from '../services/api';
import { playItem } from '../player/playbackService';
import { getConfig } from '../services/config';
import MiniPlayer from '../components/MiniPlayer';

export default function HomeScreen() {
  const { appName = 'N-xTreaM', primaryColor = '#7c3aed' } = getConfig();

  // O destaque do banner é o item MAIS OUVIDO no momento — vem pronto
  // do backend (GET /catalog/featured, ordenado por playCount)
  const [featured, setFeatured] = useState(null);
  const [trending, setTrending] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    getFeatured().then(setFeatured).catch(() => {});
    getTrending().then((d) => setTrending(d.items || [])).catch(() => {});
    getPlaylists().then((d) => setPlaylists(d.items || [])).catch(() => {});
    getCategories().then((d) => setCategories(d.items || [])).catch(() => {});
  }, []);

  async function handlePlay(item) {
    setCurrent(item);
    await playItem(item);
  }

  return (
    <View style={styles.container}>
      {/* Header: menu, logo, busca */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>☰</Text>
        <Text style={styles.logo}>{appName}</Text>
        <Text style={styles.headerIcon}>🔍</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Banner de destaque - selecionado pelo mais ouvido */}
        {featured && (
          <TouchableOpacity style={styles.banner} onPress={() => handlePlay(featured)}>
            <Image source={{ uri: featured.thumbnail }} style={styles.bannerImage} />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerLabel}>MÚSICAS E VIDEOCLIPES</Text>
              <Text style={styles.bannerTitle}>{featured.title}</Text>
              <Text style={styles.bannerSubtitle}>Seu entretenimento sem limites</Text>
            </View>
            <View style={[styles.playButton, { backgroundColor: primaryColor }]}>
              <Text style={styles.playIcon}>▶</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Em alta */}
        <Section title="Em alta">
          <FlatList
            horizontal
            data={trending}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hList}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.trendCard} onPress={() => handlePlay(item)}>
                <Image source={{ uri: item.thumbnail }} style={styles.trendImage} />
                <Text style={styles.trendTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.trendSubtitle} numberOfLines={1}>{item.subtitle}</Text>
              </TouchableOpacity>
            )}
          />
        </Section>

        {/* Playlists - blocos coloridos */}
        <Section title="Playlists">
          <View style={styles.grid}>
            {playlists.map((pl) => (
              <TouchableOpacity
                key={pl.id}
                style={[styles.playlistBlock, { backgroundColor: pl.color || '#333' }]}
              >
                <Text style={styles.playlistIcon}>{pl.icon || '🎵'}</Text>
                <Text style={styles.playlistLabel}>{pl.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>

        {/* Categorias */}
        <Section title="Categorias">
          <View style={styles.grid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryBlock}>
                <Text style={styles.categoryIcon}>{cat.icon || '⭐'}</Text>
                <Text style={styles.categoryLabel}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Section>
      </ScrollView>

      <MiniPlayer currentItem={current} onExpand={() => {}} />

      {/* Barra inferior */}
      <View style={styles.tabBar}>
        <TabItem icon="🏠" label="Início" active />
        <TabItem icon="🔍" label="Explorar" />
        <TabItem icon="♡" label="Favoritos" />
        <TabItem icon="⬇" label="Downloads" />
      </View>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.seeMore}>Ver mais ›</Text>
      </View>
      {children}
    </View>
  );
}

function TabItem({ icon, label, active }) {
  return (
    <TouchableOpacity style={styles.tabItem}>
      <Text style={[styles.tabIcon, active && styles.tabActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, active && styles.tabActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d0d' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
  },
  headerIcon: { color: '#fff', fontSize: 20 },
  logo: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

  banner: { marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', marginBottom: 8 },
  bannerImage: { width: '100%', height: 180, backgroundColor: '#1a1a1a' },
  bannerOverlay: { position: 'absolute', bottom: 0, left: 0, padding: 14 },
  bannerLabel: { color: '#c084fc', fontSize: 11, fontWeight: '600' },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  bannerSubtitle: { color: '#ccc', fontSize: 12 },
  playButton: {
    position: 'absolute',
    right: 14,
    bottom: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: { color: '#fff', fontSize: 16 },

  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '600' },
  seeMore: { color: '#999', fontSize: 13 },

  hList: { paddingHorizontal: 16 },
  trendCard: { width: 110, marginRight: 12 },
  trendImage: { width: 110, height: 110, borderRadius: 8, backgroundColor: '#1a1a1a' },
  trendTitle: { color: '#fff', marginTop: 6, fontWeight: '600', fontSize: 13 },
  trendSubtitle: { color: '#999', fontSize: 11 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  playlistBlock: {
    width: '48%',
    height: 80,
    borderRadius: 10,
    marginBottom: 12,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  playlistIcon: { fontSize: 20, marginBottom: 4 },
  playlistLabel: { color: '#fff', fontWeight: '700' },

  categoryBlock: {
    width: '31%',
    height: 80,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: { fontSize: 20, marginBottom: 4 },
  categoryLabel: { color: '#fff', fontSize: 12, fontWeight: '600' },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#0d0d0d',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  tabItem: { alignItems: 'center' },
  tabIcon: { fontSize: 18, color: '#777' },
  tabLabel: { fontSize: 11, color: '#777', marginTop: 2 },
  tabActive: { color: '#7c3aed' },
});

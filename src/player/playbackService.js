import TrackPlayer, { Event } from 'react-native-track-player';

// Esse serviço roda em segundo plano (foreground service no Android,
// background audio mode no iOS) e é o que permite:
// - minimizar o app e a música continuar
// - controlar play/pause/skip na tela bloqueada e na notificação
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.destroy());
  TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) =>
    TrackPlayer.seekTo(position)
  );
}

export async function setupPlayer() {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    // Ícones exibidos no controle da tela bloqueada / notificação
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
      TrackPlayer.CAPABILITY_SEEK_TO,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
  });
}

// Toca uma música/clipe a partir de um item do catálogo
export async function playItem(item) {
  await TrackPlayer.reset();
  await TrackPlayer.add({
    id: item.id,
    url: item.streamUrl,
    title: item.title,
    artist: item.artist,
    artwork: item.thumbnail,
  });
  await TrackPlayer.play();
}

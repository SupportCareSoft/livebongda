import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {
  getDatabase,
  onValue,
  ref,
  set
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js';

import { firebaseConfig } from './firebase-config.js?v=4';

const defaults = {
  title: 'GIAO HỮU BÓNG ĐÁ',
  home: 'ĐỘI NHÀ',
  away: 'ĐỘI KHÁCH',
  homeScore: 0,
  awayScore: 0,
  period: 'HIỆP 1',
  addedTime: 0,
  elapsed: 0,
  running: false,
  startedAt: 0,
  updatedAt: 0
};

const configured = !Object.values(firebaseConfig).some(value =>
  String(value).includes('YOUR_')
);

const query = new URLSearchParams(location.search);

const safeSession = value =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .slice(0, 48) || 'football-live';

export const session = safeSession(query.get('session'));

export const overlayUrl =
  new URL(`overlay.html?session=${session}&v=4`, location.href).href;

export const controllerUrl =
  new URL(`controller.html?session=${session}&v=4`, location.href).href;

export const getElapsed = state =>
  state.running
    ? Math.max(
        0,
        state.elapsed + Math.floor((Date.now() - state.startedAt) / 1000)
      )
    : state.elapsed;

export const clockText = seconds =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

let database;
let gameRef;

if (configured) {
  database = getDatabase(initializeApp(firebaseConfig));
  gameRef = ref(database, `footballScoreboards/${session}`);
}

export function watchState(callback, onError) {
  if (!configured) {
    onError?.('Chưa có cấu hình Firebase.');
    return () => {};
  }

  return onValue(
    gameRef,
    snapshot => callback({ ...defaults, ...(snapshot.val() || {}) }),
    onError
  );
}

export async function saveState(next) {
  if (!configured) {
    throw new Error('Chưa có cấu hình Firebase.');
  }

  await set(gameRef, {
    ...defaults,
    ...next,
    updatedAt: Date.now()
  });
}

export { defaults, configured };

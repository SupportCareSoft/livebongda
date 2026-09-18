import { configured, defaults, getElapsed, watchState, clockText } from './app.js?v=2';

const $ = id => document.getElementById(id);
let state = { ...defaults };

function render() {
  $('titleDisplay').textContent = state.title || 'GIAO HỮU BÓNG ĐÁ';
  $('homeDisplay').textContent = state.home;
  $('awayDisplay').textContent = state.away;
  $('homeScoreDisplay').textContent = state.homeScore;
  $('awayScoreDisplay').textContent = state.awayScore;
  $('periodDisplay').textContent = state.period;
  $('timeDisplay').textContent = clockText(getElapsed(state));

  $('clockState').textContent = state.running
    ? '● ĐANG CHẠY'
    : 'TẠM DỪNG';

  $('clockState').classList.toggle('paused', !state.running);
}

if (!configured) {
  $('warning').textContent = 'Chưa có cấu hình Firebase';
}

watchState(
  next => {
    state = next;
    render();
  },
  () => {
    $('warning').textContent = 'Mất kết nối Firebase';
  }
);

render();
setInterval(render, 250);

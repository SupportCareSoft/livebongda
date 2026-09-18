import {
  configured,
  defaults,
  getElapsed,
  watchState,
  clockText
} from './app.js?v=4';

const $ = id => document.getElementById(id);

let state = { ...defaults };

function render() {
  $('titleDisplay').textContent = state.title || defaults.title;

  $('matchStatus').textContent = state.running
    ? '● TRẬN ĐANG CHẠY'
    : 'TRẬN TẠM DỪNG';

  $('matchStatus').classList.toggle('paused', !state.running);

  $('homeDisplay').textContent = state.home;
  $('awayDisplay').textContent = state.away;

  $('homeScoreDisplay').textContent = state.homeScore;
  $('awayScoreDisplay').textContent = state.awayScore;

  $('periodDisplay').textContent = state.period;

  $('addedTimeDisplay').textContent = state.addedTime
    ? `BÙ GIỜ +${state.addedTime}′`
    : '';

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

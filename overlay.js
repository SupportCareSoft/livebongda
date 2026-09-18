import {
  configured,
  defaults,
  getElapsed,
  watchState,
  clockText
} from './app.js?v=5';

const $ = id => document.getElementById(id);

let state = { ...defaults };

function render() {
  $('titleDisplay').textContent = state.title || defaults.title;

  $('homeDisplay').textContent = state.home;
  $('awayDisplay').textContent = state.away;

  $('homeScoreDisplay').textContent = state.homeScore;
  $('awayScoreDisplay').textContent = state.awayScore;

  $('periodDisplay').textContent = state.period;

  $('timeDisplay').textContent = clockText(getElapsed(state));

  $('addedTimeDisplay').textContent = state.addedTime
    ? `BÙ GIỜ: +${state.addedTime}′`
    : '';
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

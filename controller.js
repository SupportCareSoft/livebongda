import {
  configured,
  controllerUrl,
  defaults,
  getElapsed,
  overlayUrl,
  saveState,
  session,
  watchState,
  clockText
} from './app.js?v=5';

const $ = id => document.getElementById(id);

let state = { ...defaults };
let nameTimer;

function render() {
  $('titleDisplay').textContent = state.title || defaults.title;

  $('homeDisplay').textContent = state.home;
  $('awayDisplay').textContent = state.away;

  $('homeScoreDisplay').textContent = state.homeScore;
  $('awayScoreDisplay').textContent = state.awayScore;

  $('homeScoreControl').textContent = state.homeScore;
  $('awayScoreControl').textContent = state.awayScore;

  $('periodDisplay').textContent = state.period;
  $('period').value = state.period;

  $('timeDisplay').textContent = clockText(getElapsed(state));

  $('addedTimeDisplay').textContent = state.addedTime
    ? `BÙ GIỜ: +${state.addedTime}′`
    : '';

  $('startPause').textContent = state.running ? 'TẠM DỪNG' : 'BẮT ĐẦU';

  if (document.activeElement !== $('matchTitle')) {
    $('matchTitle').value = state.title || defaults.title;
  }

  if (document.activeElement !== $('homeName')) {
    $('homeName').value = state.home;
  }

  if (document.activeElement !== $('awayName')) {
    $('awayName').value = state.away;
  }

  if (document.activeElement !== $('addedTime')) {
    $('addedTime').value = state.addedTime || 0;
  }
}

function notice(message, error = false) {
  $('saved').textContent = message;
  $('saved').classList.toggle('error', error);

  clearTimeout(notice.timer);
  notice.timer = setTimeout(() => {
    $('saved').textContent = '';
  }, 2600);
}

async function update(change) {
  try {
    await saveState({ ...state, ...change });
  } catch (error) {
    notice(error.message || 'Không thể lưu dữ liệu.', true);
  }
}

function setup() {
  $('session').value = session;

  $('connection').textContent = configured
    ? `Đã kết nối · Mã trận: ${session}`
    : 'Chưa có Firebase: đang chờ cấu hình.';

  $('connection').classList.toggle('error', !configured);

  watchState(
    next => {
      state = next;
      render();
    },
    () => {
      $('connection').textContent = 'Mất kết nối Firebase.';
      $('connection').classList.add('error');
    }
  );

  setInterval(render, 250);

  document.querySelectorAll('[data-score]').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.score + 'Score';

      update({
        [key]: Math.max(0, state[key] + Number(button.dataset.change))
      });
    });
  });

  $('period').addEventListener('change', () => {
    update({ period: $('period').value });
  });

  $('addedTime').addEventListener('change', () => {
    update({
      addedTime: Math.min(30, Math.max(0, Number($('addedTime').value || 0)))
    });
  });

  const textFields = [
    ['matchTitle', 'title', defaults.title],
    ['homeName', 'home', 'ĐỘI NHÀ'],
    ['awayName', 'away', 'ĐỘI KHÁCH']
  ];

  for (const [id, key, fallback] of textFields) {
    $(id).addEventListener('input', () => {
      clearTimeout(nameTimer);

      nameTimer = setTimeout(() => {
        update({
          [key]: $(id).value.trim() || fallback
        });
      }, 350);
    });
  }

  $('startPause').addEventListener('click', () => {
    update(
      state.running
        ? { elapsed: getElapsed(state), running: false, startedAt: 0 }
        : { running: true, startedAt: Date.now() }
    );
  });

  $('applyTime').addEventListener('click', () => {
    const elapsed =
      Math.max(0, Number($('minutes').value || 0) * 60) +
      Math.min(59, Number($('seconds').value || 0));

    update({
      elapsed,
      startedAt: state.running ? Date.now() : 0
    });
  });

  $('resetTime').addEventListener('click', () => {
    update({ elapsed: 0, running: false, startedAt: 0 });
  });

  $('resetAll').addEventListener('click', () => {
    if (confirm('Làm lại toàn bộ tỉ số và thời gian?')) {
      update(defaults);
    }
  });

  $('openSession').addEventListener('click', () => {
    location.href = `controller.html?session=${encodeURIComponent($('session').value)}&v=5`;
  });

  $('copyOverlay').addEventListener('click', async () => {
    await navigator.clipboard.writeText(overlayUrl);
    notice('Đã sao chép link nhúng.');
  });

  $('copyControl').addEventListener('click', async () => {
    await navigator.clipboard.writeText(controllerUrl);
    notice('Đã sao chép link điều khiển.');
  });
}

setup();

// ======================================================
// timerEngine.js
// Sistem pewaktu soal battle
// ======================================================

let timerInterval = null;

const DEFAULT_TIME_LIMIT = 30; // detik
const MEDIUM_STAGES = [4, 8, 12, 16];

export function getStageTimerDuration(world, stage, question = null) {
  const stageNumber = Number(stage);

  // Final Stage / Boss
  // Durasi mengikuti asal stage soal yang muncul
  if (stageNumber === 17) {
    const sourceStage = Number(
      question?.sourceStage ??
      question?.timerStage ??
      question?.fromStage ??
      question?.stage ??
      1
    );

    return MEDIUM_STAGES.includes(sourceStage) ? 60 : 30;
  }

  // Stage medium
  if (MEDIUM_STAGES.includes(stageNumber)) {
    return 60;
  }

  // Stage biasa
  return 30;
}

export function setupTimer(gs, duration = DEFAULT_TIME_LIMIT) {
  if (!gs.timer) {
    gs.timer = {
      enabled: true,
      duration,
      remaining: duration,
      running: false
    };
  }

  if (gs.timer.duration === undefined) gs.timer.duration = duration;
  if (gs.timer.remaining === undefined) gs.timer.remaining = duration;
  if (gs.timer.enabled === undefined) gs.timer.enabled = true;
  if (gs.timer.running === undefined) gs.timer.running = false;
}

export function getTimerHtml(gs) {
  setupTimer(gs);

  if (!gs.timer.enabled) return "";

  const percent = Math.max(
    0,
    Math.min(100, (gs.timer.remaining / gs.timer.duration) * 100)
  );

  return `
    <div id="battleTimerBox" class="mb-4">
      <div class="flex justify-between text-xs text-gray-300 mb-1">
        <span>⏱️ Waktu Menjawab</span>
        <span id="battleTimerText">${gs.timer.remaining}s</span>
      </div>

      <div class="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
        <div 
          id="battleTimerFill"
          class="h-full bg-yellow-400 transition-all duration-300"
          style="width:${percent}%">
        </div>
      </div>
    </div>
  `;
}

export function startQuestionTimer(gs, onTimeout, duration = DEFAULT_TIME_LIMIT) {
  setupTimer(gs, duration);

  if (!gs.timer.enabled) return;

  stopQuestionTimer(gs);

  gs.timer.duration = duration;
  gs.timer.remaining = duration;
  gs.timer.running = true;

  updateTimerDisplay(gs);

  timerInterval = setInterval(() => {
    if (!gs.timer.running) return;

    gs.timer.remaining -= 1;

    updateTimerDisplay(gs);

    if (gs.timer.remaining <= 0) {
      stopQuestionTimer(gs);

      if (typeof onTimeout === "function") {
        onTimeout();
      }
    }
  }, 1000);
}

export function stopQuestionTimer(gs) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (gs?.timer) {
    gs.timer.running = false;
  }
}

export function resetQuestionTimer(gs, duration = DEFAULT_TIME_LIMIT) {
  setupTimer(gs, duration);

  gs.timer.duration = duration;
  gs.timer.remaining = duration;
  gs.timer.running = false;

  updateTimerDisplay(gs);
}

function updateTimerDisplay(gs) {
  if (!gs?.timer) return;

  const text = document.getElementById("battleTimerText");
  const fill = document.getElementById("battleTimerFill");

  const remaining = Math.max(0, gs.timer.remaining);
  const percent = Math.max(
    0,
    Math.min(100, (remaining / gs.timer.duration) * 100)
  );

  if (text) {
    text.textContent = `${remaining}s`;
  }

  if (fill) {
    fill.style.width = `${percent}%`;
  }
}
/* Personaliza aquí las frases y los segundos en los que aparecen. Los tiempos
   corresponden al MP3, así que puedes ajustarlos cuando escuches el archivo. */
const SONG_MESSAGES = [
  { at: 8, text: "esq no se como explicarte lo muchooo q me encantas 💗" },
  { at: 40, text: "me encantan tus ojitos, tu sonrisa y literalmente todo de tiii" },
  { at: 75, text: "y esq cada vez q te veo me doy cuenta de lo enamorado q estoy de ti JAJAJA" },
  { at: 112, text: "no se como hiciste para gustarme tantooo, pero aqui me tienes 💗" },
  { at: 218, text: "esta cancion es para ti mi amorrr, pq si alguien me tiene mal de amor eres tuuu" },
];

// Ajusta estos segundos al instante exacto del verso de la varita en tu MP3.
const MAGIC_MOMENTS = {
  start: 126,
  secondLine: 132,
  end: 143,
};

const $ = (selector) => document.querySelector(selector);
const intro = $("#intro");
const listening = $("#listening");
const tapeStage = $("#tapeStage");
const song = $("#song");
const playButton = $("#playButton");
const seekBar = $("#seekBar");
const playerNote = $("#playerNote");
const audioStatus = $("#audioStatus");
const messageNote = $("#messageNote");
const messageText = $("#messageText");
const magicNote = $("#magicNote");
const endSurprise = $("#endSurprise");
const closingHint = $("#closingHint");
const noteDialog = $("#noteDialog");
const letterDialog = $("#letterDialog");

let lastMessageIndex = -2;
let previousMagicState = "";
let seekWasPlaying = false;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "—:—";
  const value = Math.max(0, Math.floor(seconds));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}

function setPlayState(isPlaying) {
  document.body.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-label", isPlaying ? "Pausar canción" : "Reproducir canción");
  playerNote.textContent = isPlaying ? "suena mejor si la escuchas completita ♡" : "toca play cuando quieras ♡";
}

function updateMessages(time) {
  let activeIndex = -1;
  for (let i = 0; i < SONG_MESSAGES.length; i += 1) {
    if (time >= SONG_MESSAGES[i].at) activeIndex = i;
  }
  const inMagicMoment = time >= MAGIC_MOMENTS.start && time < MAGIC_MOMENTS.end;
  if (activeIndex !== lastMessageIndex) {
    lastMessageIndex = activeIndex;
    if (activeIndex >= 0) {
      messageText.textContent = SONG_MESSAGES[activeIndex].text;
    }
  }
  const messageIsVisible = activeIndex >= 0 && !inMagicMoment;
  messageNote.classList.toggle("is-visible", messageIsVisible);

  const magicActive = inMagicMoment;
  const secondLineActive = time >= MAGIC_MOMENTS.secondLine && magicActive;
  const magicState = magicActive ? (secondLineActive ? "second" : "first") : "off";
  if (magicState !== previousMagicState) {
    previousMagicState = magicState;
    tapeStage.classList.toggle("magic-active", magicActive);
    document.body.classList.toggle("magic-active", magicActive);
    if (magicActive) {
      magicNote.innerHTML = secondLineActive
        ? '<p class="magic-first">y esq amorrr, tú tampoco necesitaste una varita para enamorarme así JAJAJA ❤️</p><p class="magic-second">me tienes bien enamorado de tiii mi niña 🥹</p>'
        : '<p class="magic-first">y esq amorrr, tú tampoco necesitaste una varita para enamorarme así JAJAJA ❤️</p>';
      magicNote.hidden = false;
      requestAnimationFrame(() => magicNote.classList.add("is-visible"));
      messageNote.classList.remove("is-visible");
    } else {
      magicNote.classList.remove("is-visible");
      window.setTimeout(() => { if (!magicNote.classList.contains("is-visible")) magicNote.hidden = true; }, 420);
    }
  } else if (magicActive && secondLineActive && magicNote.querySelectorAll("p").length < 2) {
    magicNote.innerHTML = '<p class="magic-first">y esq amorrr, tú tampoco necesitaste una varita para enamorarme así JAJAJA ❤️</p><p class="magic-second">me tienes bien enamorado de tiii mi niña 🥹</p>';
  }
  if (magicActive && magicNote.querySelector(".magic-second")) {
    magicNote.querySelector(".magic-second").classList.toggle("is-shown", secondLineActive);
  }

  if (Number.isFinite(song.duration) && song.duration > 0) {
    const nearEnd = time >= song.duration - 18;
    endSurprise.hidden = !nearEnd;
    closingHint.hidden = nearEnd || time < 30;
  }
}

$("#openTape").addEventListener("click", () => {
  intro.classList.add("intro-leaving");
  window.setTimeout(() => {
    intro.hidden = true;
    listening.hidden = false;
    listening.classList.add("scene-entering");
    window.setTimeout(() => listening.classList.remove("scene-entering"), 1100);
  }, 480);
});

playButton.addEventListener("click", async () => {
  if (song.paused) {
    try {
      await song.play();
      audioStatus.textContent = "";
    } catch (error) {
      audioStatus.textContent = "no se pudo abrir la canción 😭 revisa que esté en assets/me-tiene-mal.mp3";
      console.error("No se pudo reproducir el MP3:", error);
    }
  } else {
    song.pause();
  }
});

song.addEventListener("loadedmetadata", () => {
  $("#duration").textContent = formatTime(song.duration);
  seekBar.disabled = false;
  audioStatus.textContent = "";
});
song.addEventListener("timeupdate", () => {
  const current = song.currentTime;
  $("#currentTime").textContent = formatTime(current);
  if (Number.isFinite(song.duration) && song.duration > 0 && !seekBar.matches(":active")) {
    seekBar.value = String((current / song.duration) * 100);
    seekBar.style.setProperty("--progress", `${(current / song.duration) * 100}%`);
  }
  updateMessages(current);
});
song.addEventListener("play", () => setPlayState(true));
song.addEventListener("pause", () => setPlayState(false));
song.addEventListener("ended", () => {
  setPlayState(false);
  endSurprise.hidden = false;
  closingHint.hidden = true;
  playerNote.textContent = "esta era para ti, mi niña ♡";
});
song.addEventListener("error", () => {
  audioStatus.textContent = "todavía falta poner la canción aquí 🥺 cuando tengas el MP3, guárdalo como assets/me-tiene-mal.mp3";
  seekBar.disabled = true;
});
song.addEventListener("waiting", () => {
  if (!song.paused) playerNote.textContent = "un segundito, cargando…";
});
song.addEventListener("canplay", () => {
  if (!song.paused) playerNote.textContent = "suena mejor si la escuchas completita ♡";
});

seekBar.addEventListener("input", () => {
  if (!Number.isFinite(song.duration)) return;
  seekBar.style.setProperty("--progress", `${seekBar.value}%`);
  $("#currentTime").textContent = formatTime((Number(seekBar.value) / 100) * song.duration);
});
seekBar.addEventListener("pointerdown", () => { seekWasPlaying = !song.paused; });
seekBar.addEventListener("change", () => {
  if (!Number.isFinite(song.duration)) return;
  song.currentTime = (Number(seekBar.value) / 100) * song.duration;
  updateMessages(song.currentTime);
  if (seekWasPlaying) song.play().catch(() => {});
});
seekBar.addEventListener("keydown", () => { seekWasPlaying = !song.paused; });

$("#easterEgg").addEventListener("click", () => {
  if (typeof noteDialog.showModal === "function") noteDialog.showModal();
  else noteDialog.setAttribute("open", "");
});
$("#openLetter").addEventListener("click", () => {
  if (typeof letterDialog.showModal === "function") letterDialog.showModal();
  else letterDialog.setAttribute("open", "");
});
document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
[noteDialog, letterDialog].forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

// Evita dejar una nota o un audio sonando en una pestaña de fondo.
document.addEventListener("visibilitychange", () => {
  if (document.hidden && !song.paused) song.pause();
});

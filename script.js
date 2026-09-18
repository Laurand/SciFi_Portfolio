// Website created by Laurand Osmeni
const welcome = document.querySelector('#welcome');
const deck = document.querySelector('#deck');
const enterButton = document.querySelector('#enterBtn');
const resetButton = document.querySelector('#resetGate');
const soundButton = document.querySelector('#soundToggle');
const moduleName = document.querySelector('#moduleName');
const infoDialog = document.querySelector('#infoDialog');
const dialogContent = document.querySelector('#dialogContent');
const closeDialogButton = document.querySelector('.dialog-close');
const buildTerminal = document.querySelector('#terminalBuild');
const aiTerminal = document.querySelector('#terminalAI');
const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let audioContext;
let soundEnabled = true;
let terminalTimers = [];

const moduleLabels = {
  overview: 'Overview',
  projects: 'Selected Work',
  experience: 'Experience',
  education: 'Education',
  skills: 'Systems',
  contact: 'Communication'
};

const dialogCopy = {
  privacy: `
    <p class="section-code">SYSTEM NOTICE / PRIVACY</p>
    <h2>Privacy</h2>
    <p>This portfolio has no ads, accounts, subscriptions, or tracking setup. The contact form sends only the information you choose to enter.</p>`,
  terms: `
    <p class="section-code">SYSTEM NOTICE / TERMS</p>
    <h2>Terms of Use</h2>
    <p>You may view and share this portfolio for professional purposes. Please do not present its content, projects, or design as your own.</p>`,
  about: `
    <p class="section-code">SYSTEM NOTICE / ABOUT</p>
    <h2>About This Site</h2>
    <p>This is Laurand Osmeni’s personal portfolio, created to display his software projects, engineering skills, education, leadership experience, and professional background in one place.</p>`
};

const buildCommands = [
  '<i>$</i> identify --developer "Laurand Osmeni"',
  '<em>[VERIFIED]</em> software engineer online',
  '<i>$</i> prioritize --stack C++ JavaScript HTML CSS',
  '<span class="fixed">[LOADED]</span> performance + web systems',
  '<i>$</i> mount --languages Python Java TypeScript',
  '<em>[OK]</em> backend logic connected',
  '<i>$</i> enable --interface SwiftUI',
  '<em>[OK]</em> Apple experiences ready',
  '<i>$</i> inspect --developer-workflow',
  '<em>[DOING]</em> planning product architecture',
  '<em>[DOING]</em> writing clean maintainable code',
  '<em>[DOING]</em> testing APIs and interfaces',
  '<em>[DOING]</em> debugging edge cases',
  '<i>$</i> compile --web-projects',
  '<span class="error">[WARN]</span> ordinary solution rejected',
  '<i>$</i> optimize --user-first --accessible',
  '<span class="fixed">[FIXED]</span> experience improved',
  '<i>$</i> deploy --apps --web --leadership',
  '<em>[PASS]</em> idea transformed into product',
  '<i>$</i> status --laurand',
  '<span class="fixed">[READY]</span> building what comes next'
];

const aiCommands = [
  '<i>$</i> launch starship --mission life_search',
  '<em>[NAV]</em> leaving Solar orbit',
  '<i>$</i> engage --velocity light_speed',
  '<span class="fixed">[STABLE]</span> photon drive at 99.8%',
  '<i>$</i> scan --planet Kepler-LX',
  '<span class="error">[RESULT]</span> no life support found yet',
  '<em>[BIO]</em> consciousness signal: none detected',
  '<i>$</i> plot --next-target TRAPPIST-9X',
  '<em>[NAV]</em> arrival estimate: 00:42:17',
  '<span class="error">[ALERT]</span> meteor field ahead',
  '<i>$</i> evade --vector 41.7 --thrusters full',
  '<span class="fixed">[CLEAR]</span> hull integrity 96%',
  '<i>$</i> follow --unknown-signal',
  '<em>[TRACE]</em> oxygen signature increasing',
  '<i>$</i> enter-orbit --silent',
  '<em>[SCAN]</em> liquid water probability: 87%',
  '<em>[SCAN]</em> organic pattern probability: 94%',
  '<span class="fixed">[LIFE FOUND]</span> biosphere confirmed',
  '<span class="error">[POWER]</span> charge remaining: 23%',
  '<i>$</i> deploy --solar-wings',
  '<span class="fixed">[CHARGING]</span> mission continues...'
];

function runTerminal(element, commands, speed) {
  let index = 0;
  element.innerHTML = '';
  const printLine = () => {
    const line = document.createElement('p');
    line.innerHTML = commands[index];
    element.appendChild(line);
    while (element.children.length > 12) element.firstElementChild.remove();
    element.scrollTop = element.scrollHeight;
    index = (index + 1) % commands.length;
  };
  commands.slice(0, 5).forEach((command) => {
    const line = document.createElement('p');
    line.innerHTML = command;
    element.appendChild(line);
    index += 1;
  });
  terminalTimers.push(window.setInterval(printLine, speed));
}

function startTerminals() {
  terminalTimers.forEach(window.clearInterval);
  terminalTimers = [];
  runTerminal(buildTerminal, buildCommands, 720);
  runTerminal(aiTerminal, aiCommands, 840);
}

function stopTerminals() {
  terminalTimers.forEach(window.clearInterval);
  terminalTimers = [];
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function tone(frequency = 620, duration = 0.045, volume = 0.018, type = 'square') {
  if (!soundEnabled) return;
  const context = getAudioContext();
  if (!context) return;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  gain.gain.setValueAtTime(volume, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

function gateSound() {
  tone(115, 0.12, 0.026, 'sawtooth');
  window.setTimeout(() => tone(80, 0.14, 0.022, 'sawtooth'), 85);
  window.setTimeout(() => tone(540, 0.055, 0.014), 210);
}

function clickSound() {
  tone(720, 0.04, 0.012);
}

function showSection(sectionName, updateHash = true) {
  const nextView = document.querySelector(`[data-view="${sectionName}"]`);
  if (!nextView) return;

  document.querySelectorAll('[data-view]').forEach((view) => {
    const selected = view === nextView;
    view.hidden = !selected;
    view.classList.toggle('active', selected);
  });

  document.querySelectorAll('.menu[data-section]').forEach((button) => {
    const selected = button.dataset.section === sectionName;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-current', selected ? 'page' : 'false');
  });

  moduleName.textContent = moduleLabels[sectionName];
  if (updateHash) history.replaceState(null, '', `#${sectionName}`);
  clickSound();

  if (window.innerWidth < 801) {
    document.querySelector('.main-panel').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

function openDeck() {
  gateSound();
  welcome.classList.add('open');
  const delay = reduceMotion ? 0 : 660;
  window.setTimeout(() => {
    welcome.classList.add('hidden');
    deck.classList.remove('hidden');
    const requested = window.location.hash.slice(1);
    showSection(moduleLabels[requested] ? requested : 'overview', false);
    startTerminals();
    deck.focus({ preventScroll: true });
  }, delay);
}

function closeDeck() {
  gateSound();
  stopTerminals();
  deck.classList.add('hidden');
  welcome.classList.remove('hidden', 'open');
  history.replaceState(null, '', window.location.pathname);
  enterButton.focus({ preventScroll: true });
}

enterButton.addEventListener('click', openDeck);
resetButton.addEventListener('click', closeDeck);

document.querySelectorAll('[data-section]').forEach((button) => {
  button.addEventListener('click', () => showSection(button.dataset.section));
});

soundButton.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundButton.textContent = `Sound: ${soundEnabled ? 'On' : 'Off'}`;
  soundButton.setAttribute('aria-pressed', String(soundEnabled));
  if (soundEnabled) tone(820, 0.055, 0.014, 'sine');
});

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    clickSound();
    dialogContent.innerHTML = dialogCopy[button.dataset.dialog];
    infoDialog.showModal();
  });
});

closeDialogButton.addEventListener('click', () => infoDialog.close());
infoDialog.addEventListener('click', (event) => {
  if (event.target === infoDialog) infoDialog.close();
});

contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalLabel = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = 'Transmitting...';
  formStatus.className = 'form-status full sending';
  formStatus.textContent = 'Opening a secure communication channel...';
  tone(920, 0.07, 0.014, 'sine');

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false) {
      throw new Error(result.message || 'Transmission could not be completed.');
    }
    contactForm.reset();
    formStatus.className = 'form-status full success';
    formStatus.textContent = 'Transmission received. Thank you — Laurand will reply soon.';
    tone(1120, 0.09, 0.016, 'sine');
  } catch (error) {
    formStatus.className = 'form-status full error';
    formStatus.textContent = 'Channel unavailable. Please try again in a moment.';
    tone(180, 0.11, 0.018, 'sawtooth');
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalLabel;
  }
});

window.addEventListener('hashchange', () => {
  if (deck.classList.contains('hidden')) return;
  const requested = window.location.hash.slice(1);
  if (moduleLabels[requested]) showSection(requested, false);
});

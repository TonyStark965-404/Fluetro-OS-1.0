document.addEventListener('DOMContentLoaded', () => {
  // Inject CSS rules for hover effects, taskbar indicators, and window styling
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    .win-btn {
      background: transparent;
      border: none;
      color: #333;
      cursor: pointer;
      width: 28px;
      height: 24px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: background-color 0.15s ease, color 0.15s ease;
    }
    .win-btn:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }
    .win-btn.btn-close:hover {
      background-color: rgba(232, 17, 35, 0.12);
      color: #e81123;
    }
    .desktop-icon {
      user-select: none;
    }
    .nav-btn:hover:not(:disabled) {
      background-color: rgba(0, 0, 0, 0.05) !important;
      color: #333 !important;
    }
    .nav-btn:disabled {
      opacity: 0.3;
      cursor: default !important;
    }
    
    /* Taskbar Icon Indicators */
    .taskbar-item {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .taskbar-item.running::after {
      content: '';
      position: absolute;
      bottom: 2px;
      left: 20%;
      width: 60%;
      height: 3px;
      background-color: #a855f7;
      border-radius: 2px;
    }
    .taskbar-item.active::after {
      background-color: #ffffff;
      height: 3px;
    }
    .taskbar-item.minimized {
      opacity: 0.55;
    }
    .taskbar-item.minimized::after {
      background-color: #cbd5e1;
      width: 30%;
      left: 35%;
      height: 2px;
    }
  `;
  document.head.appendChild(styleSheet);

  // Logon & Desktop Elements
  const loginForm = document.getElementById('login-form');
  const passwordField = document.getElementById('password-field');
  const hintText = document.getElementById('hint-text');
  const welcomeBox = document.getElementById('welcome-box');
  const logonScreen = document.getElementById('logon-screen');
  const desktopScreen = document.getElementById('desktop-screen');
  const windowsContainer = document.getElementById('windows-container');

  // Context Menu & Start Menu Elements
  const contextMenu = document.getElementById('context-menu');
  const ctxPersonalize = document.getElementById('ctx-personalize');

  // --- 1. SINGLE POPUP MANAGER ---
  function closeAllPopups() {
    if (beginMenu) beginMenu.classList.add('hidden');
    if (contextMenu) contextMenu.classList.add('hidden');
    const logonInfoModal = document.getElementById('logon-info-modal');
    if (logonInfoModal) logonInfoModal.classList.add('hidden');
  }

  // Close all open popups when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (beginMenu && beginMenu.contains(e.target)) return;
    if (startBtn && startBtn.contains(e.target)) return;
    if (contextMenu && contextMenu.contains(e.target)) return;

    closeAllPopups();
  });

  // Info "i" Button -> Show Fluetro OS System Info Modal on Logon Screen
  document.getElementById('logon-info-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllPopups();

    let logonInfoModal = document.getElementById('logon-info-modal');
    
    if (!logonInfoModal) {
      logonInfoModal = document.createElement('div');
      logonInfoModal.id = 'logon-info-modal';
      logonInfoModal.innerHTML = `
        <div style="position:fixed; inset:0; background:rgba(0,0,0,0.5); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; z-index:99999;">
          <div style="position:relative; width:440px; max-width:90vw; background:#ffffff; border-radius:8px; box-shadow:0 20px 40px rgba(0,0,0,0.3); overflow:hidden; border:1px solid rgba(0,0,0,0.1);">
            <button id="close-logon-info" style="position:absolute; top:12px; right:16px; border:none; background:none; font-size:18px; cursor:pointer; color:#666; line-height:1;" title="Close">✕</button>
            <div style="padding:30px; font-family:'Segoe UI', sans-serif; background:#ffffff; color:#333333;">
              <h1 style="margin:0 0 6px 0; font-size:26px; font-weight:300; color:#1976d2;">Fluetro OS 1.0</h1>
              <p style="margin:0 0 24px 0; color:#666666; font-size:13px;">A WebOS inspired by Metro and Fluent Design</p>
              <p style="margin:0 0 12px 0; font-size:13px; color:#333333;">
                Icons sourced from <a href="https://icons8.com" target="_blank" style="color:#1976d2; text-decoration:underline;">icons8</a>
              </p>
              <p style="margin:0 0 12px 0; font-size:13px; color:#333333;">
                Wallpapers sourced from <a href="https://unsplash.com" target="_blank" style="color:#1976d2; text-decoration:underline;">Unsplash</a>
              </p>
              <p style="margin:0 0 12px 0; font-size:13px; color:#333333;">
                Happy Wheels logo sourced from <a href="https://commons.wikimedia.org" target="_blank" style="color:#1976d2; text-decoration:underline;">Wikimedia Commons</a>
              </p>
              <p style="margin:0; font-size:13px; color:#333333;">
                Check out other projects made by the developer: <a href="https://github.com/TonyStark965-404" target="_blank" style="color:#1976d2; text-decoration:underline;">Github</a>
              </p>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(logonInfoModal);
      document.getElementById('logon-power-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        shutdownScreen?.classList.remove('hidden');
        setTimeout(() => {
          window.close();
        }, 1500);
      });

      // Close button event listener
      logonInfoModal.querySelector('#close-logon-info').addEventListener('click', () => {
        logonInfoModal.classList.add('hidden');
      });

      // Close when clicking background backdrop
      logonInfoModal.addEventListener('click', (evt) => {
        if (evt.target === logonInfoModal.firstElementChild) {
          logonInfoModal.classList.add('hidden');
        }
      });
    } else {
      logonInfoModal.classList.remove('hidden');
    }
  });

  // Taskbar Elements
  const taskbar = document.getElementById('taskbar') || document.querySelector('.taskbar');
  if (taskbar) {
    taskbar.style.backgroundColor = '#4b1582';
    taskbar.style.color = '#ffffff';
  }

  // Shutdown Screen Dynamic Element
  let shutdownScreen = document.getElementById('shutdown-screen');
  if (!shutdownScreen) {
    shutdownScreen = document.createElement('div');
    shutdownScreen.id = 'shutdown-screen';
    shutdownScreen.className = 'hidden';
    shutdownScreen.innerHTML = `
      <div style="margin-bottom:16px; width:36px; height:36px; border:3px solid rgba(255,255,255,0.3); border-top-color:#ffffff; border-radius:50%; animation:spin 1s linear infinite;"></div>
      <div style="font-size:20px; font-weight:300;">Shutting down...</div>
      <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
    `;
    document.body.appendChild(shutdownScreen);
  }

  // Begin / Start Popup Menu
  let beginMenu = document.getElementById('begin-menu');
  if (!beginMenu) {
    beginMenu = document.createElement('div');
    beginMenu.id = 'begin-menu';
    beginMenu.className = 'hidden';
    beginMenu.innerHTML = `
      <div class="begin-menu-item" id="btn-signout">
        <span>🔒</span> Sign out
      </div>
      <div class="begin-menu-item" id="btn-shutdown">
        <span>⏻</span> Shutdown
      </div>
    `;
    document.body.appendChild(beginMenu);
  }

  // Attach Click Event to the Begin Button
  const startBtn = document.getElementById('start-btn') || document.getElementById('begin-btn') || document.querySelector('.start-btn');
  startBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = beginMenu.classList.contains('hidden');
    closeAllPopups();
    if (isHidden) {
      beginMenu.classList.remove('hidden');
    }
  });

  // Sign Out Handler
  document.getElementById('btn-signout')?.addEventListener('click', () => {
    closeAllPopups();
    desktopScreen?.classList.add('hidden');
    logonScreen?.classList.remove('hidden');
    welcomeBox?.classList.add('hidden');
    loginForm?.classList.remove('hidden');
    if (passwordField) passwordField.value = '';
    if (hintText) hintText.classList.add('hidden');
  });

  // Shutdown Handler
  document.getElementById('btn-shutdown')?.addEventListener('click', () => {
    closeAllPopups();
    shutdownScreen.classList.remove('hidden');
    setTimeout(() => {
      window.close();
    }, 1500);
  });

  const tbBrowser = document.getElementById('tb-browser');
  const tbExplorer = document.getElementById('tb-explorer');
  const tbStore = document.getElementById('tb-store');
  const taskbarApps = document.getElementById('taskbar-apps') || tbExplorer?.parentElement;
  const sysTray = document.getElementById('system-tray') || document.querySelector('.taskbar-tray');

  let zIndexCount = 100;
  let globalVolume = 1.0;
  const currentNetworkName = 'WebOS 5G';

  function openSettingsApp() {
    openWindow('personalize');
  }

  function toggleAppWindow(windowId, appId) {
    const win = document.getElementById(windowId);
    if (!win) return;

    if (win.style.display === 'none') {
      win.style.display = 'block';
    } else {
      win.style.display = 'none';
    }
    updateTaskbarStates();
  }

  const storeApps = [
    {
      id: 'youtube',
      name: 'YouTube',
      category: 'Media',
      icon: 'https://img.icons8.com/pulsar-gradient/48/youtube-play.png',
      url: 'https://www.youtube.com'
    },
    {
      id: 'gmail',
      name: 'Gmail',
      category: 'Productivity',
      icon: 'https://img.icons8.com/pulsar-gradient/48/gmail-new.png',
      url: 'https://mail.google.com'
    },
    {
      id: 'happy-wheels',
      name: 'Happy Wheels',
      category: 'Games',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Happy_Wheels_Logo.png',
      url: 'https://www.totaljerkface.com/happy_wheels.tjf'
    }
  ];

  function navigateToUrl(iframeElement, rawUrl) {
    let url = rawUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    if (iframeElement) {
      iframeElement.src = url;
    }
  }

  window.openSettingsApp = openSettingsApp;
  window.toggleAppWindow = toggleAppWindow;
  window.navigateToUrl = navigateToUrl;

  const CUSTOM_SVG = {
    wifi: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14 0M8.5 16.15a6 6 0 0 1 7 0"></path></svg>`,
    volume: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    chevronUp: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`
  };

  const RAW_GRADIENT_HTML = {
    favorites: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/star.png" alt="star"/>`,
    downloads: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/downloads.png" alt="downloads"/>`,
    desktop: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/desktop.png" alt="desktop"/>`,
    documents: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/terms-and-conditions.png" alt="terms-and-conditions"/>`,
    music: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/apple-music.png" alt="apple-music"/>`,
    pictures: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/stack-of-photos.png" alt="stack-of-photos"/>`,
    videos: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/cinema-.png" alt="cinema-"/>`,
    cDrive: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/c-drive.png" alt="c-drive"/>`,
    thisSystem: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/my-computer.png" alt="my-computer"/>`,
    myNetwork: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/share-2.png" alt="share-2"/>`,
    trash: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/delete.png" alt="delete"/>`,
    youtube: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/youtube-play.png" alt="youtube-play"/>`,
    gmail: `<img width="48" height="48" src="https://img.icons8.com/pulsar-gradient/48/gmail-new.png" alt="gmail-new"/>`,
    happywheels: `<img width="48" height="48" src="https://upload.wikimedia.org/wikipedia/commons/7/76/Happy_Wheels_Logo.png" alt="happy-wheels"/>`
  };

  const RAW_LINE_HTML = {
    github: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/github.png" alt="github"/>`,
    youtube: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/youtube-logo.png" alt="youtube"/>`,
    open: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/external-link.png" alt="external-link"/>`,
    rename: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/rename.png" alt="rename"/>`,
    accessMedia: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/network-drive.png" alt="network-drive"/>`,
    mapNetwork: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/map-marker.png" alt="map-marker"/>`,
    addNetwork: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/share-2.png" alt="share-2"/>`,
    thisSystemLine: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/my-computer.png" alt="my-computer"/>`,
    uninstallLine: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/delete.png" alt="delete"/>`,
    settings: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/settings.png" alt="settings" style="filter: invert(27%) sepia(90%) saturate(3000%) hue-rotate(250deg) brightness(90%) contrast(100%);"/>`,
    store: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/shopping-bag.png" alt="shopping-bag"/>`,
    browser: `<img width="48" height="48" src="https://img.icons8.com/pulsar-line/48/globe.png" alt="globe"/>`
  };

  const renderGrad = (htmlStr, px = 20) => `<span style="display:inline-flex; align-items:center; justify-content:center; width:${px}px; height:${px}px; overflow:hidden;">${htmlStr.replace('<img ', `<img style="width:${px}px; height:${px}px; object-fit:contain;" `)}</span>`;
  const renderLine = (htmlStr, px = 20) => `<span style="display:inline-flex; align-items:center; justify-content:center; width:${px}px; height:${px}px; overflow:hidden;">${htmlStr.replace('<img ', `<img style="width:${px}px; height:${px}px; object-fit:contain;" `)}</span>`;

  const ICONS = {
    favorites: renderGrad(RAW_GRADIENT_HTML.favorites, 16),
    downloads: renderGrad(RAW_GRADIENT_HTML.downloads, 18),
    downloadsLarge: renderGrad(RAW_GRADIENT_HTML.downloads, 28),
    desktop: renderGrad(RAW_GRADIENT_HTML.desktop, 18),
    desktopLarge: renderGrad(RAW_GRADIENT_HTML.desktop, 28),
    documents: renderGrad(RAW_GRADIENT_HTML.documents, 18),
    documentsLarge: renderGrad(RAW_GRADIENT_HTML.documents, 28),
    music: renderGrad(RAW_GRADIENT_HTML.music, 18),
    musicLarge: renderGrad(RAW_GRADIENT_HTML.music, 28),
    pictures: renderGrad(RAW_GRADIENT_HTML.pictures, 18),
    picturesLarge: renderGrad(RAW_GRADIENT_HTML.pictures, 28),
    videos: renderGrad(RAW_GRADIENT_HTML.videos, 18),
    videosLarge: renderGrad(RAW_GRADIENT_HTML.videos, 28),
    cDrive: renderGrad(RAW_GRADIENT_HTML.cDrive, 18),
    cDriveLarge: renderGrad(RAW_GRADIENT_HTML.cDrive, 32),
    thisSystem: renderGrad(RAW_GRADIENT_HTML.thisSystem, 18),
    thisSystemLarge: renderGrad(RAW_GRADIENT_HTML.thisSystem, 28),
    thisSystemSplash: renderGrad(RAW_GRADIENT_HTML.thisSystem, 48),
    myNetwork: renderGrad(RAW_GRADIENT_HTML.myNetwork, 18),
    myNetworkLarge: renderGrad(RAW_GRADIENT_HTML.myNetwork, 28),
    trash: renderGrad(RAW_GRADIENT_HTML.trash, 18),
    trashLarge: renderGrad(RAW_GRADIENT_HTML.trash, 28),

    open: renderLine(RAW_LINE_HTML.open, 18),
    rename: renderLine(RAW_LINE_HTML.rename, 18),
    accessMedia: renderLine(RAW_LINE_HTML.accessMedia, 18),
    mapNetwork: renderLine(RAW_LINE_HTML.mapNetwork, 18),
    addNetworkLine: renderLine(RAW_LINE_HTML.addNetwork, 18),
    thisSystemLine: renderLine(RAW_LINE_HTML.thisSystemLine, 18),
    uninstallLine: renderLine(RAW_LINE_HTML.uninstallLine, 18),
    github: renderLine(RAW_LINE_HTML.github, 28),
    youtube: renderGrad(RAW_GRADIENT_HTML.youtube, 28),
    gmail: renderGrad(RAW_GRADIENT_HTML.gmail, 28),
    happywheels: renderGrad(RAW_GRADIENT_HTML.happywheels, 28),
    settings: renderLine(RAW_LINE_HTML.settings, 18),
    settingsLarge: renderLine(RAW_LINE_HTML.settings, 28),
    settingsSplash: renderLine(RAW_LINE_HTML.settings, 48),
    store: renderLine(RAW_LINE_HTML.store, 18),
    storeLarge: renderLine(RAW_LINE_HTML.store, 28),
    storeSplash: renderLine(RAW_LINE_HTML.store, 48),
    browser: renderLine(RAW_LINE_HTML.browser, 18),
    browserLarge: renderLine(RAW_LINE_HTML.browser, 28),
    browserSplash: renderLine(RAW_LINE_HTML.browser, 48),

    wifiIcon: CUSTOM_SVG.wifi,
    volumeIcon: CUSTOM_SVG.volume,
    chevronIcon: CUSTOM_SVG.chevronUp
  };

  function minimizeAllWindows() {
    document.querySelectorAll('.app-window').forEach(win => {
      win.style.display = 'none';
    });
    updateTaskbarStates();
  }

  function renderDesktopIcons() {
    const desktopContainer = document.getElementById('desktop-icons');
    if (!desktopContainer) return;

    const icons = desktopContainer.querySelectorAll('.desktop-icon');
    icons.forEach(icon => {
      const winType = icon.getAttribute('data-window');
      let imgBox = icon.querySelector('.icon-img-box');
      if (!imgBox) {
        imgBox = document.createElement('div');
        imgBox.className = 'icon-img-box';
        icon.prepend(imgBox);
      }

      imgBox.style.backgroundColor = '#ffffff';
      imgBox.style.borderRadius = '12px';
      imgBox.style.width = '48px';
      imgBox.style.height = '48px';
      imgBox.style.display = 'flex';
      imgBox.style.alignItems = 'center';
      imgBox.style.justifyContent = 'center';
      imgBox.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
      imgBox.style.margin = '0 auto 6px auto';

      if (winType === 'this-pc' || winType === 'this-system') {
        imgBox.innerHTML = ICONS.thisSystemLarge;
      } else if (winType === 'network' || winType === 'my-network') {
        imgBox.innerHTML = ICONS.myNetworkLarge;
      } else if (winType === 'recycle-bin' || winType === 'trash') {
        imgBox.innerHTML = ICONS.trashLarge;
      } else if (winType === 'browser-github') {
        imgBox.innerHTML = ICONS.github;
      } else if (winType === 'browser-youtube' || winType === 'youtube') {
        imgBox.innerHTML = ICONS.youtube;
      } else if (winType === 'browser-gmail' || winType === 'gmail') {
        imgBox.innerHTML = ICONS.gmail;
      } else if (winType === 'happy-wheels' || winType === 'happywheels') {
        imgBox.innerHTML = ICONS.happywheels;
      } else if (winType === 'browser') {
        imgBox.innerHTML = ICONS.browserLarge;
      } else if (winType === 'store') {
        imgBox.innerHTML = ICONS.storeLarge;
      } else if (winType === 'personalize' || winType === 'settings') {
        imgBox.innerHTML = ICONS.settingsLarge;
      }
    });
  }
  renderDesktopIcons();

  if (sysTray) {
    sysTray.innerHTML = '';
    sysTray.style.display = 'flex';
    sysTray.style.alignItems = 'center';
    sysTray.style.gap = '12px';

    const chevronSpan = document.createElement('span');
    chevronSpan.id = 'tray-chevron';
    chevronSpan.style.cursor = 'pointer';
    chevronSpan.style.display = 'inline-flex';
    chevronSpan.style.alignItems = 'center';
    chevronSpan.title = 'Show hidden icons';
    chevronSpan.innerHTML = ICONS.chevronIcon;
    sysTray.appendChild(chevronSpan);

    const wifiSpan = document.createElement('span');
    wifiSpan.id = 'tray-wifi';
    wifiSpan.style.cursor = 'pointer';
    wifiSpan.style.display = 'inline-flex';
    wifiSpan.style.alignItems = 'center';
    wifiSpan.title = 'Open Network App';
    wifiSpan.innerHTML = ICONS.wifiIcon;
    wifiSpan.addEventListener('click', () => {
      openWindow('network');
    });
    sysTray.appendChild(wifiSpan);

    const soundSpan = document.createElement('span');
    soundSpan.id = 'tray-sound';
    soundSpan.style.cursor = 'pointer';
    soundSpan.style.display = 'inline-flex';
    soundSpan.style.alignItems = 'center';
    soundSpan.title = 'Control WebOS Volume';
    soundSpan.innerHTML = ICONS.volumeIcon;
    soundSpan.addEventListener('click', () => {
      const input = prompt('Adjust WebOS Master Volume (0 - 100):', Math.round(globalVolume * 100));
      if (input !== null) {
        const val = parseInt(input, 10);
        if (!isNaN(val) && val >= 0 && val <= 100) {
          globalVolume = val / 100;
          document.querySelectorAll('audio, video').forEach(media => {
            media.volume = globalVolume;
          });
          alert(`WebOS master volume set to ${val}%`);
        }
      }
    });
    sysTray.appendChild(soundSpan);

    const clockContainer = document.createElement('div');
    clockContainer.style.display = 'flex';
    clockContainer.style.flexDirection = 'column';
    clockContainer.style.alignItems = 'flex-end';
    clockContainer.style.fontSize = '11px';
    clockContainer.style.lineHeight = '1.2';

    const timeEl = document.createElement('span');
    timeEl.id = 'taskbar-time';
    const dateEl = document.createElement('span');
    dateEl.id = 'taskbar-date';

    clockContainer.appendChild(timeEl);
    clockContainer.appendChild(dateEl);
    sysTray.appendChild(clockContainer);
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordField.value === '') {
      hintText?.classList.add('hidden');
      loginForm.classList.add('hidden');
      welcomeBox?.classList.remove('hidden');

      setTimeout(() => {
        logonScreen?.classList.add('hidden');
        desktopScreen?.classList.remove('hidden');
      }, 1400);
    } else if (hintText) {
      passwordField.value = '';
      hintText.textContent = "Password hint: Mbappe Special";
      hintText.classList.remove('hidden');
    }
  });

  function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    const month = now.getMonth() + 1;
    const day = now.getDate();
    const year = now.getFullYear();

    const timeEl = document.getElementById('taskbar-time');
    const dateEl = document.getElementById('taskbar-date');
    if (timeEl) timeEl.textContent = `${hours}:${minutes} ${ampm}`;
    if (dateEl) dateEl.textContent = `${month}/${day}/${year}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  desktopScreen?.addEventListener('contextmenu', (e) => {
    if (e.target.closest('.app-window')) return;
    e.preventDefault();
    closeAllPopups();
    if (contextMenu) {
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.classList.remove('hidden');
    }
  });

  ctxPersonalize?.addEventListener('click', () => {
    closeAllPopups();
    openSettingsApp();
  });

  function getAppConfig(type, customTitle = null, customIcon = null, customUrl = null) {
    switch (type) {
      case 'this-pc':
      case 'this-system':
        return {
          windowTitle: 'This System',
          windowIcon: ICONS.thisSystem,
          splashTitle: 'Explorer',
          splashIcon: ICONS.thisSystemSplash,
          appGroup: 'explorer',
          bodyHTML: getExplorerHTML('This System')
        };
      case 'network':
      case 'my-network':
        return {
          windowTitle: 'My Network',
          windowIcon: ICONS.myNetwork,
          splashTitle: 'Explorer',
          splashIcon: ICONS.thisSystemSplash,
          appGroup: 'explorer',
          bodyHTML: getExplorerHTML('My Network', `<div class="section-heading" style="padding:10px; font-weight:600; color:#1976d2;">Network Locations</div><p style="padding:0 10px; font-size:13px;">Current network: <strong>${currentNetworkName}</strong></p>`)
        };
      case 'recycle-bin':
      case 'trash':
        return {
          windowTitle: 'Trash',
          windowIcon: ICONS.trash,
          splashTitle: 'Explorer',
          splashIcon: ICONS.thisSystemSplash,
          appGroup: 'explorer',
          bodyHTML: `<div style="padding:40px; text-align:center; font-size:13px; color:#666;">Trash is empty</div>`
        };
      case 'personalize':
      case 'settings':
        return {
          windowTitle: 'Settings',
          windowIcon: ICONS.settings,
          splashTitle: 'Settings',
          splashIcon: ICONS.settingsSplash,
          appGroup: 'settings',
          bodyHTML: getPersonalizeHTML()
        };
      case 'system-properties':
        return {
          windowTitle: 'System Properties',
          windowIcon: ICONS.settings,
          splashTitle: 'Settings',
          splashIcon: ICONS.settingsSplash,
          appGroup: 'settings',
          bodyHTML: getSystemPropertiesHTML()
        };
      case 'store':
        return {
          windowTitle: 'Store',
          windowIcon: ICONS.store,
          splashTitle: 'Store',
          splashIcon: ICONS.storeSplash,
          appGroup: 'store',
          bodyHTML: getStoreHTML()
        };
      case 'browser':
      case 'browser-google':
      default:
        const initialUrl = customUrl || 'https://www.google.com/search?igu=1';
        const title = customTitle || 'Browser';
        return {
          windowTitle: title,
          windowIcon: customIcon || ICONS.browser,
          splashTitle: 'Browser',
          splashIcon: ICONS.browserSplash,
          appGroup: 'browser',
          bodyHTML: getBrowserHTML(initialUrl)
        };
    }
  }

  function openWindow(type, customTitle = null, customIcon = null, customUrl = null) {
    if (type === 'youtube' || type === 'browser-youtube') {
      window.open('https://www.youtube.com', '_blank');
      return;
    }
    if (type === 'gmail' || type === 'browser-gmail') {
      window.open('https://mail.google.com', '_blank');
      return;
    }
    if (type === 'happy-wheels' || type === 'happywheels') {
      window.open('https://www.totaljerkface.com/happy_wheels.tjf', '_blank');
      return;
    }
    if (customUrl) {
      const lowerUrl = customUrl.toLowerCase();
      if (lowerUrl.includes('youtube.com') || lowerUrl.includes('mail.google.com') || lowerUrl.includes('gmail.com') || lowerUrl.includes('totaljerkface.com') || lowerUrl.includes('happywheels')) {
        window.open(customUrl, '_blank');
        return;
      }
    }

    const config = getAppConfig(type, customTitle, customIcon, customUrl);
    const windowId = `win-${type}-${Date.now()}`;

    const win = document.createElement('div');
    win.className = 'app-window';
    win.id = windowId;
    win.dataset.appGroup = config.appGroup;
    win.style.zIndex = ++zIndexCount;
    win.style.position = 'absolute';
    win.style.top = '70px';
    win.style.left = '160px';
    win.style.width = '820px';
    win.style.height = '520px';
    win.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
    win.style.borderRadius = '10px';
    win.style.border = '1px solid rgba(0, 0, 0, 0.15)';
    win.style.overflow = 'hidden';

    win.innerHTML = `
      <div class="window-splash" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:100; background:#fcfcfc; color:#1a1a1a; display:flex; flex-direction:column; align-items:center; justify-content:center;">
        <div class="splash-logo" style="margin-bottom:12px; width:48px; height:48px; display:flex; align-items:center; justify-content:center;">${config.splashIcon}</div>
        <div class="splash-title" style="font-size:18px; font-weight:400; font-family:'Segoe UI', sans-serif;">${config.splashTitle}</div>
      </div>
      <div class="window-header" style="display:flex; justify-content:space-between; align-items:center; background:#ffffff; color:#1a1a1a; padding:0 8px 0 12px; cursor:move; user-select:none; height:34px; border-bottom:1px solid #d9d9d9;">
        <div class="window-title-box" style="display:flex; align-items:center; gap:8px;">
          <span>${config.windowIcon}</span>
          <span style="font-size:12px; font-weight:400; font-family:'Segoe UI', sans-serif;">${config.windowTitle}</span>
        </div>
        <div class="window-actions" style="display:flex; align-items:center; gap:4px; height:100%;">
          <button class="win-btn btn-min" title="Minimize">—</button>
          <button class="win-btn btn-max" title="Maximize">☐</button>
          <button class="win-btn btn-close" title="Close">✕</button>
        </div>
      </div>
      <div class="window-body" style="height:calc(100% - 35px); overflow:auto; background:#ffffff; color:#1a1a1a; font-family:'Segoe UI', sans-serif;">
        ${config.bodyHTML}
      </div>
    `;

    windowsContainer.appendChild(win);
    updateTaskbarStates();

    const splash = win.querySelector('.window-splash');
    setTimeout(() => {
      if (splash) splash.remove();
    }, 800);

    win.querySelector('.btn-close').addEventListener('click', () => {
      win.remove();
      updateTaskbarStates();
    });

    win.querySelector('.btn-min').addEventListener('click', () => {
      toggleAppWindow(win.id, config.appGroup);
    });

    win.querySelector('.btn-max').addEventListener('click', () => {
      if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        win.style.borderRadius = '10px';
        win.style.top = '70px';
        win.style.left = '160px';
        win.style.width = '820px';
        win.style.height = '520px';
      } else {
        win.classList.add('maximized');
        win.style.borderRadius = '0px';
        win.style.top = '0';
        win.style.left = '0';
        win.style.width = '100vw';
        win.style.height = 'calc(100vh - 44px)';
      }
    });

    win.addEventListener('mousedown', () => {
      win.style.zIndex = ++zIndexCount;
      updateTaskbarStates();
    });

    makeDraggable(win);
    setupExplorerEvents(win, type === 'network' ? 'My Network' : 'This System');
    setupStoreEvents(win);
    setupPersonalizeEvents(win);
    setupBrowserEvents(win, config.windowTitle);
  }

  function handleTaskbarClick(appGroup) {
    const windows = Array.from(document.querySelectorAll(`.app-window[data-app-group="${appGroup}"]`));
    
    if (windows.length === 0) {
      if (appGroup === 'browser') openWindow('browser-google');
      else if (appGroup === 'explorer') openWindow('this-pc');
      else if (appGroup === 'store') openWindow('store');
      else if (appGroup === 'settings') openSettingsApp();
    } else {
      const visibleWindows = windows.filter(w => w.style.display !== 'none');
      
      if (visibleWindows.length === 0) {
        const target = windows[windows.length - 1];
        toggleAppWindow(target.id, appGroup);
        target.style.zIndex = ++zIndexCount;
      } else {
        visibleWindows.sort((a, b) => parseInt(b.style.zIndex || 0) - parseInt(a.style.zIndex || 0));
        const topWin = visibleWindows[0];
        
        const allWins = Array.from(document.querySelectorAll('.app-window'));
        const absoluteTop = allWins.reduce((max, w) => Math.max(max, parseInt(w.style.zIndex || 0)), 0);

        if (parseInt(topWin.style.zIndex || 0) < absoluteTop) {
          topWin.style.zIndex = ++zIndexCount;
        } else {
          toggleAppWindow(topWin.id, appGroup);
        }
      }
    }
    updateTaskbarStates();
  }

  function updateTaskbarStates() {
    const windows = Array.from(document.querySelectorAll('.app-window'));
    
    ['browser', 'store', 'explorer', 'settings'].forEach(appGroup => {
      const appWins = windows.filter(w => w.dataset.appGroup === appGroup);
      const hasOpen = appWins.length > 0;
      const hasVisible = appWins.some(w => w.style.display !== 'none');
      const allMinimized = hasOpen && appWins.every(w => w.style.display === 'none');

      let tbItem = document.getElementById(`tb-${appGroup}`);

      if (appGroup === 'settings') {
        if (hasOpen) {
          if (!tbItem && taskbarApps) {
            tbItem = document.createElement('div');
            tbItem.id = 'tb-settings';
            tbItem.className = 'taskbar-icon taskbar-item';
            tbItem.dataset.app = 'settings';
            tbItem.innerHTML = ICONS.settings;
            tbItem.title = 'Settings';
            tbItem.style.cursor = 'pointer';
            tbItem.style.padding = '6px 10px';
            tbItem.addEventListener('click', () => handleTaskbarClick('settings'));
            taskbarApps.appendChild(tbItem);
          }
        } else if (tbItem) {
          tbItem.remove();
          tbItem = null;
        }
      }

      if (tbItem) {
        tbItem.classList.toggle('running', hasOpen);
        tbItem.classList.toggle('active', hasVisible);
        tbItem.classList.toggle('minimized', allMinimized);
      }
    });
  }

  function makeDraggable(elmnt) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = elmnt.querySelector('.window-header');
    if (header) {
      header.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      if (e.target.classList.contains('win-btn') || elmnt.classList.contains('maximized')) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  tbBrowser?.addEventListener('click', () => handleTaskbarClick('browser'));
  tbExplorer?.addEventListener('click', () => handleTaskbarClick('explorer'));
  tbStore?.addEventListener('click', () => handleTaskbarClick('store'));

  document.getElementById('desktop-icons')?.addEventListener('dblclick', (e) => {
    const icon = e.target.closest('.desktop-icon');
    if (!icon) return;

    const winType = icon.getAttribute('data-window');
    const customUrl = icon.dataset.customUrl;

    if (customUrl) {
      const lowerUrl = customUrl.toLowerCase();
      if (lowerUrl.includes('youtube.com') || lowerUrl.includes('mail.google.com') || lowerUrl.includes('gmail.com') || lowerUrl.includes('totaljerkface.com') || lowerUrl.includes('happywheels')) {
        window.open(customUrl, '_blank');
        return;
      }
    }

    if (winType === 'this-pc' || winType === 'this-system') openWindow('this-pc');
    else if (winType === 'network' || winType === 'my-network') openWindow('network');
    else if (winType === 'recycle-bin' || winType === 'trash') openWindow('recycle-bin');
    else if (winType === 'browser-github') {
      window.open('https://github.com/TonyStark965-404', '_blank');
    } else if (winType === 'browser-youtube' || winType === 'youtube') {
      window.open('https://www.youtube.com', '_blank');
    } else if (winType === 'gmail' || winType === 'browser-gmail') {
      window.open('https://mail.google.com', '_blank');
    } else if (winType === 'happy-wheels' || winType === 'happywheels') {
      window.open('https://www.totaljerkface.com/happy_wheels.tjf', '_blank');
    } else if (winType === 'browser') {
      openWindow('browser-google');
    } else if (winType === 'store') {
      openWindow('store');
    } else if (winType === 'personalize' || winType === 'settings') {
      openSettingsApp();
    } else if (icon.dataset.customUrl) {
      openWindow('browser', icon.dataset.title, icon.dataset.icon, icon.dataset.customUrl);
    }
  });

  function getBrowserHTML(url) {
    return `
      <div class="browser-app" style="display:flex; flex-direction:column; width:100%; height:100%;">
        <div style="display:flex; align-items:center; gap:6px; padding:6px 10px; background:#f0f0f0; border-bottom:1px solid #d0d0d0;">
          <button class="nav-btn browser-go-back" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid #ccc; border-radius:6px; padding:0; cursor:pointer;" disabled>←</button>
          <button class="nav-btn browser-go-forward" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:#fff; border:1px solid #ccc; border-radius:6px; padding:0; cursor:pointer;" disabled>→</button>
          <input type="text" class="browser-url-input" value="${url}" style="flex:1; padding:5px 10px; border:1px solid #ccc; border-radius:8px; font-size:12px; font-family:'Segoe UI', sans-serif;" />
          <button class="browser-btn-navigate" style="background:#1976d2; color:#fff; border:none; border-radius:6px; padding:5px 14px; cursor:pointer; font-size:12px;">Go</button>
        </div>
        <div class="browser-viewport" style="width:100%; flex:1; display:flex; flex-direction:column; background:#ffffff; overflow:auto;">
        </div>
      </div>
    `;
  }

  function getGitHubMockHTML() {
    return `
      <div style="font-family:'Segoe UI', -apple-system, sans-serif; background:#0d1117; color:#c9d1d9; height:100%; padding:30px; overflow-y:auto;">
        <div style="max-width:900px; margin:0 auto;">
          <div style="display:flex; align-items:center; gap:20px; border-bottom:1px solid #30363d; padding-bottom:24px; margin-bottom:24px;">
            <div style="width:80px; height:80px; border-radius:50%; background:#238636; display:flex; align-items:center; justify-content:center; font-size:36px; color:#fff; font-weight:bold;">TS</div>
            <div>
              <h1 style="margin:0; font-size:24px; color:#f0f6fc;">Tony Stark</h1>
              <p style="margin:4px 0 0 0; color:#8b949e; font-size:14px;">TonyStark965-404</p>
              <p style="margin:8px 0 0 0; font-size:13px; color:#c9d1d9;">Developer & Tech Enthusiast building Fluent & Metro inspired WebOS applications.</p>
            </div>
          </div>
          <h3 style="color:#f0f6fc; font-size:16px; margin-bottom:12px;">Pinned Repositories</h3>
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px;">
            <div style="background:#161b22; border:1px solid #30363d; border-radius:8px; padding:16px;">
              <a href="#" style="color:#58a6ff; text-decoration:none; font-weight:600; font-size:14px;">FluetroOS</a>
              <p style="color:#8b949e; font-size:12px; margin:8px 0 12px 0;">A stunning Windows-inspired WebOS built with HTML, CSS, and JavaScript.</p>
              <span style="font-size:11px; color:#8b949e;"><span style="display:inline-block; width:10px; height:10px; background:#f1e05a; border-radius:50%; margin-right:4px;"></span> JavaScript</span>
            </div>
            <div style="background:#161b22; border:1px solid #30363d; border-radius:8px; padding:16px;">
              <a href="#" style="color:#58a6ff; text-decoration:none; font-weight:600; font-size:14px;">Custom-GTA-Playlist</a>
              <p style="color:#8b949e; font-size:12px; margin:8px 0 12px 0;">Curated atmospheric and retro soul soundtracks for immersive gaming sessions.</p>
              <span style="font-size:11px; color:#8b949e;"><span style="display:inline-block; width:10px; height:10px; background:#3572A5; border-radius:50%; margin-right:4px;"></span> Python</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setupBrowserEvents(win, windowTitle) {
    const urlInput = win.querySelector('.browser-url-input');
    const goBtn = win.querySelector('.browser-btn-navigate');
    const viewport = win.querySelector('.browser-viewport');
    const btnBack = win.querySelector('.browser-go-back');
    const btnForward = win.querySelector('.browser-go-forward');

    if (!urlInput || !goBtn || !viewport) return;

    let history = [urlInput.value.trim()];
    let historyIndex = 0;

    const renderBrowserUrl = (url) => {
      urlInput.value = url;
      const lowerUrl = url.toLowerCase();
      
      if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be') || lowerUrl.includes('gmail') || lowerUrl.includes('mail.google') || lowerUrl.includes('totaljerkface') || lowerUrl.includes('happywheel')) {
        let targetUrl = url;
        if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;
        window.open(targetUrl, '_blank');
        viewport.innerHTML = `
          <div style="padding:40px; font-family:'Segoe UI', sans-serif; text-align:center; color:#333;">
            <p style="font-size:14px; margin-bottom:12px;">Opened site in a new browser tab.</p>
            <a href="${targetUrl}" target="_blank" style="color:#1976d2; font-size:13px; text-decoration:underline;">Click here if it did not open automatically</a>
          </div>
        `;
      } else if (lowerUrl.includes('github.com')) {
        viewport.innerHTML = getGitHubMockHTML();
      } else {
        let formattedUrl = url;
        if (formattedUrl.includes('google.com') && !formattedUrl.includes('igu=1')) {
          formattedUrl = 'https://www.google.com/search?igu=1';
        }
        viewport.innerHTML = `<iframe class="browser-iframe" style="width:100%; height:100%; border:none;"></iframe>`;
        const iframe = viewport.querySelector('.browser-iframe');
        navigateToUrl(iframe, formattedUrl);
      }

      if (btnBack) btnBack.disabled = historyIndex <= 0;
      if (btnForward) btnForward.disabled = historyIndex >= history.length - 1;
    };

    const navigateTo = (url) => {
      if (history[historyIndex] === url) return;
      history = history.slice(0, historyIndex + 1);
      history.push(url);
      historyIndex++;
      renderBrowserUrl(url);
    };

    goBtn.addEventListener('click', () => {
      navigateTo(urlInput.value.trim());
    });

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        navigateTo(urlInput.value.trim());
      }
    });

    btnBack?.addEventListener('click', () => {
      if (historyIndex > 0) {
        historyIndex--;
        renderBrowserUrl(history[historyIndex]);
      }
    });

    btnForward?.addEventListener('click', () => {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        renderBrowserUrl(history[historyIndex]);
      }
    });

    renderBrowserUrl(history[0]);
  }

  function getExplorerHTML(locationTitle, customContent = null) {
    const mainView = customContent || `
      <div class="section-heading" style="font-size:12px; font-weight:600; color:#1976d2; margin-bottom:10px;">Folders (6)</div>
      <div class="grid-cards" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
        <div class="folder-card btn-folder-desktop" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
          ${ICONS.desktopLarge} <span style="font-size:12px;">Desktop</span>
        </div>
        <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
          ${ICONS.documentsLarge} <span style="font-size:12px;">Documents</span>
        </div>
        <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
          ${ICONS.downloadsLarge} <span style="font-size:12px;">Downloads</span>
        </div>
        <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
          ${ICONS.musicLarge} <span style="font-size:12px;">Music</span>
        </div>
        <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
          ${ICONS.picturesLarge} <span style="font-size:12px;">Pictures</span>
        </div>
        <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
          ${ICONS.videosLarge} <span style="font-size:12px;">Videos</span>
        </div>
      </div>
      <div class="section-heading" style="font-size:12px; font-weight:600; color:#1976d2; margin-bottom:10px;">Devices and drives (1)</div>
      <div class="grid-cards" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
        <div class="drive-card" style="background:#ffffff; padding:10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:10px; cursor:pointer;">
          ${ICONS.cDriveLarge}
          <div style="font-size:12px;"><strong>Local Disk (C:)</strong><br/><small style="color:#666;">29.7 GB free of 39.6 GB</small></div>
        </div>
      </div>
    `;

    return `
      <div style="display:flex; flex-direction:column; width:100%; height:100%; background:#ffffff;">
        <div style="background:#f5f6f7; border:1px solid #d9d9d9; border-radius:8px; margin:6px; overflow:hidden; font-size:12px;">
          <div style="display:flex; align-items:center; justify-content:space-between; background:#ffffff; border-bottom:1px solid #e5e5e5; padding-left:0; padding-right:8px;">
            <div style="display:flex; align-items:center;">
              <div style="background:#1976d2; color:#fff; padding:6px 18px 6px 16px; font-size:11px; border-top-left-radius:7px; cursor:pointer; display:inline-flex; align-items:center; margin-left:0;">File</div>
              <div style="background:#f5f6f7; color:#000; padding:6px 16px; font-size:11px; border-top:2px solid #1976d2; border-left:1px solid #d9d9d9; border-right:1px solid #d9d9d9; cursor:pointer; font-weight:600; display:inline-flex; align-items:center;">Computer</div>
              <div style="padding:6px 16px; font-size:11px; color:#555; cursor:pointer; display:inline-flex; align-items:center;">View</div>
            </div>
            <div class="ribbon-toggle-btn" style="cursor:pointer; padding:2px 6px; user-select:none;" title="Expand/Collapse Ribbon">
              <span class="ribbon-arrow" style="font-size:9px; color:#555;">▼</span>
            </div>
          </div>
          <div class="ribbon-toolbar" style="background:#f5f6f7; padding:6px 12px; display:flex; gap:16px; border-top:1px solid #ffffff; font-size:11px; color:#333;">
            <div style="display:flex; flex-direction:column; align-items:center; border-right:1px solid #e0e0e0; padding-right:12px;">
              <div style="display:flex; gap:8px;">
                <div class="ribbon-btn" style="cursor:default; text-align:center; opacity:0.5; padding:4px; border-radius:6px;">
                  <div>${ICONS.open}</div>
                  <span style="font-size:10px;">Open</span>
                </div>
                <div class="ribbon-btn" style="cursor:default; text-align:center; opacity:0.5; padding:4px; border-radius:6px;">
                  <div>${ICONS.rename}</div>
                  <span style="font-size:10px;">Rename</span>
                </div>
              </div>
              <span style="font-size:10px; color:#777; margin-top:3px;">Location</span>
            </div>

            <div style="display:flex; flex-direction:column; align-items:center; border-right:1px solid #e0e0e0; padding-right:12px;">
              <div style="display:flex; gap:12px;">
                <div class="ribbon-btn ribbon-btn-network" style="cursor:pointer; text-align:center; color:#222; padding:4px; border-radius:6px;" title="Access media">
                  <div>${ICONS.accessMedia}</div>
                  <span style="font-size:10px;">Access media</span>
                </div>
                <div class="ribbon-btn ribbon-btn-network" style="cursor:pointer; text-align:center; color:#222; padding:4px; border-radius:6px;" title="Map network drive">
                  <div>${ICONS.mapNetwork}</div>
                  <span style="font-size:10px;">Map network drive</span>
                </div>
                <div class="ribbon-btn ribbon-btn-network" style="cursor:pointer; text-align:center; color:#222; padding:4px; border-radius:6px;" title="Add network location">
                  <div>${ICONS.addNetworkLine}</div>
                  <span style="font-size:10px;">Add network location</span>
                </div>
              </div>
              <span style="font-size:10px; color:#777; margin-top:3px;">Network</span>
            </div>

            <div style="display:flex; flex-direction:column; align-items:center;">
              <div style="display:flex; gap:12px;">
                <div class="ribbon-btn btn-open-control-panel" style="cursor:pointer; text-align:center; color:#222; padding:4px; border-radius:6px;">
                  <div>${ICONS.settings}</div>
                  <span style="font-size:10px;">Open Control Panel</span>
                </div>
                <div class="ribbon-btn" style="cursor:default; text-align:center; opacity:0.5; padding:4px; border-radius:6px;">
                  <div>${ICONS.uninstallLine}</div>
                  <span style="font-size:10px;">Uninstall program</span>
                </div>
                <div class="ribbon-btn btn-sys-prop" style="cursor:pointer; text-align:center; color:#222; padding:4px; border-radius:6px;">
                  <div>${ICONS.thisSystemLine}</div>
                  <span style="font-size:10px;">System properties</span>
                </div>
              </div>
              <span style="font-size:10px; color:#777; margin-top:3px;">System</span>
            </div>
          </div>
        </div>

        <div style="background:#ffffff; padding:4px 8px; border-bottom:1px solid #e0e0e0; display:flex; align-items:center; gap:6px; font-size:12px;">
          <button class="nav-btn explorer-btn-back" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid #d9d9d9; border-radius:6px; cursor:pointer; color:#333; padding:0;" disabled>←</button>
          <button class="nav-btn explorer-btn-forward" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid #d9d9d9; border-radius:6px; cursor:pointer; color:#333; padding:0;" disabled>→</button>
          <button class="nav-btn explorer-btn-up" style="width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; background:transparent; border:1px solid #d9d9d9; border-radius:6px; cursor:pointer; color:#333; padding:0;" disabled>↑</button>
          <div class="explorer-address-box" style="flex:1; background:#ffffff; border:1px solid #d9d9d9; border-radius:8px; padding:4px 10px; font-size:12px; color:#333;">${locationTitle}</div>
          <div class="explorer-search-box" style="width:170px; background:#ffffff; border:1px solid #d9d9d9; border-radius:8px; padding:4px 10px; font-size:12px; color:#888;">Search ${locationTitle}</div>
        </div>

        <div style="display:flex; flex:1; height:calc(100% - 130px);">
          <div class="explorer-sidebar" style="width:190px; background:#f6f6f6; border-right:1px solid #e0e0e0; padding:10px 6px; font-size:12px; color:#222; user-select:none; overflow-y:auto;">
            
            <div style="margin-bottom:10px;">
              <div class="pane-toggle-fav" style="cursor:pointer; font-weight:600; font-size:11px; color:#555; display:flex; align-items:center; gap:4px; padding:2px 4px;">
                <span class="fav-arrow" style="font-size:9px;">▼</span> ${ICONS.favorites} <span>Favorites</span>
              </div>
              <div class="fav-collapsible-list" style="padding-left:16px; display:flex; flex-direction:column; gap:2px; margin-top:2px;">
                <div class="btn-folder-desktop" style="padding:2px 4px; cursor:pointer; display:flex; align-items:center; gap:6px;">${ICONS.desktop} Desktop</div>
                <div class="sidebar-folder" style="padding:2px 4px; cursor:pointer; display:flex; align-items:center; gap:6px;">${ICONS.documents} Documents</div>
                <div class="sidebar-folder" style="padding:2px 4px; cursor:pointer; display:flex; align-items:center; gap:6px;">${ICONS.downloads} Downloads</div>
                <div class="sidebar-folder" style="padding:2px 4px; cursor:pointer; display:flex; align-items:center; gap:6px;">${ICONS.music} Music</div>
                <div class="sidebar-folder" style="padding:2px 4px; cursor:pointer; display:flex; align-items:center; gap:6px;">${ICONS.pictures} Pictures</div>
                <div class="sidebar-folder" style="padding:2px 4px; cursor:pointer; display:flex; align-items:center; gap:6px;">${ICONS.videos} Videos</div>
              </div>
            </div>

            <div>
              <div class="pane-toggle-sys" style="cursor:pointer; font-weight:600; font-size:11px; color:#555; display:flex; align-items:center; gap:4px; padding:2px 4px;">
                <span class="sys-arrow" style="font-size:9px;">▼</span> ${ICONS.thisSystem} <span>This System</span>
              </div>
              <div class="sys-collapsible-list" style="padding-left:16px; display:flex; flex-direction:column; gap:2px; margin-top:2px;">
                <div>
                  <div class="pane-toggle-c" style="cursor:pointer; padding:2px 4px; display:flex; align-items:center; gap:6px;">
                    <span class="c-arrow" style="font-size:9px;">►</span> ${ICONS.cDrive} <span>Local Disk (C:)</span>
                  </div>
                  <div class="c-collapsible-list" style="padding-left:22px; display:none; flex-direction:column; gap:2px; color:#444;">
                    <div class="sidebar-c-subfolder" style="padding:2px 0; cursor:pointer;">📁 Program Files</div>
                    <div class="sidebar-c-subfolder" style="padding:2px 0; cursor:pointer;">📁 Users</div>
                    <div class="sidebar-c-subfolder" style="padding:2px 0; cursor:pointer; font-weight:600; color:#1976d2;">📁 OS</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div class="explorer-content" style="flex:1; padding:15px; overflow:auto; background:#ffffff;">${mainView}</div>
        </div>
      </div>
    `;
  }

  function getStoreHTML() {
    const storeCardsHTML = storeApps.map(app => `
      <div class="app-card" style="background:#f9f9f9; padding:15px; border-radius:8px; text-align:center; border:1px solid #e0e0e0;">
        <div style="font-size:32px; margin-bottom:8px; display:flex; align-items:center; justify-content:center; height:40px;">
          ${app.icon.startsWith('http') || app.icon.endsWith('.png') || app.icon.endsWith('.jpg') ? `<img src="${app.icon}" alt="${app.name}" style="width:32px; height:32px; object-fit:contain;" />` : app.icon}
        </div>
        <div style="font-weight:600; margin-bottom:4px; font-size:13px;">${app.name}</div>
        <div style="font-size:11px; color:#666; margin-bottom:10px;">${app.category}</div>
        <button class="install-btn" data-title="${app.name}" data-icon="${app.icon}" data-url="${app.url}" style="background:#1976d2; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:12px;">Install</button>
      </div>
    `).join('');

    return `
      <div class="store-container" style="padding:20px; background:#ffffff;">
        <h2 style="margin-top:0; font-weight:300; color:#1a1a1a;">WebOS Store</h2>
        <div class="store-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:15px;">
          <div class="app-card" style="background:#f9f9f9; padding:15px; border-radius:8px; text-align:center; border:1px solid #e0e0e0;">
            <div style="font-size:32px; margin-bottom:8px;">🎨</div>
            <div style="font-weight:600; margin-bottom:4px; font-size:13px;">JS Paint</div>
            <div style="font-size:11px; color:#666; margin-bottom:10px;">Utilities</div>
            <button class="install-btn" data-title="JS Paint" data-icon="🎨" data-url="https://jspaint.app" style="background:#1976d2; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:12px;">Install</button>
          </div>
          <div class="app-card" style="background:#f9f9f9; padding:15px; border-radius:8px; text-align:center; border:1px solid #e0e0e0;">
            <div style="font-size:32px; margin-bottom:8px;">📝</div>
            <div style="font-weight:600; margin-bottom:4px; font-size:13px;">Notepad</div>
            <div style="font-size:11px; color:#666; margin-bottom:10px;">Productivity</div>
            <button class="install-btn" data-title="Notepad" data-icon="📝" data-url="https://wordpad.cc" style="background:#1976d2; color:#fff; border:none; padding:6px 14px; border-radius:6px; cursor:pointer; font-size:12px;">Install</button>
          </div>
          ${storeCardsHTML}
        </div>
      </div>
    `;
  }

  // Personalization HTML with Wallpaper Type Selection
  function getPersonalizeHTML() {
    return `
      <div class="personalize-box" style="padding:20px; background:#ffffff; font-family:'Segoe UI', sans-serif;">
        <h2 style="margin-top:0; font-weight:300;">Settings</h2>
        
        <div style="margin-bottom:20px;">
          <p style="margin-bottom:8px; font-weight:600; font-size:13px;">Theme:</p>
          <div class="theme-options" style="display:flex; gap:10px;">
            <button style="padding:8px 15px; background:#1976d2; color:#fff; border:none; border-radius:6px; cursor:default; font-size:12px;">Light Theme (System Default)</button>
          </div>
        </div>

        <div style="margin-bottom:20px;">
          <p style="margin-bottom:8px; font-weight:600; font-size:13px;">Wallpaper Source:</p>
          <select id="wallpaper-type-select" style="padding:6px 10px; border:1px solid #ccc; border-radius:6px; font-size:12px; width:100%; max-width:280px;">
            <option value="default">Default WebOS Wallpaper</option>
            <option value="photo">Photo Wallpaper (/wallpapers/ folder)</option>
          </select>

          <div id="photo-options" style="display:none; margin-top:12px;">
            <p style="margin-bottom:6px; font-weight:600; font-size:12px; color:#555;">Select Image File:</p>
            <select id="photo-select" style="padding:6px 10px; border:1px solid #ccc; border-radius:6px; font-size:12px; width:100%; max-width:280px;">
              <option value="wallpaper1.jpg">Photo 1 (wallpaper1.jpg)</option>
              <option value="wallpaper2.jpg">Photo 2 (wallpaper2.jpg)</option>
              <option value="wallpaper3.jpg">Photo 3 (wallpaper3.jpg)</option>
              <option value="wallpaper4.jpg">Photo 4 (wallpaper4.jpg)</option>
            </select>
          </div>
        </div>

        <div>
          <p style="margin-bottom:8px; font-weight:600; font-size:13px;">Gradient Presets:</p>
          <div class="wallpaper-options" style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="wall-btn" data-bg="linear-gradient(135deg, #e67e22 0%, #f1c40f 45%, #e67e22 70%, #2980b9 100%)" style="padding:8px 15px; background:#f1c40f; color:#000; font-weight:bold; border:none; border-radius:6px; cursor:pointer; font-size:12px;">Original Blue & Yellow</button>
            <button class="wall-btn" data-bg="linear-gradient(135deg, #0f2027, #203a43, #2c5364)" style="padding:8px 15px; background:#0f2027; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:12px;">Midnight</button>
            <button class="wall-btn" data-bg="linear-gradient(135deg, #11998e, #38ef7d)" style="padding:8px 15px; background:#11998e; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:12px;">Emerald</button>
            <button class="wall-btn" data-bg="linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" style="padding:8px 15px; background:#2b5876; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:12px;">Nighttime</button>            
            </div>
        </div>
      </div>
    `;
  }

  function getSystemPropertiesHTML() {
    return `
      <div style="padding:30px; font-family:'Segoe UI', sans-serif; background:#ffffff;">
        <h1 style="margin:0 0 6px 0; font-size:26px; font-weight:300; color:#1976d2;">Fluetro OS 1.0</h1>
        <p style="margin:0 0 24px 0; color:#666; font-size:13px;">A WebOS inspired by Metro and Fluent Design</p>
        <p style="margin:0 0 12px 0; font-size:13px;">
          Icons sourced from <a href="https://icons8.com" target="_blank" style="color:#1976d2; text-decoration:underline;">icons8</a>
        </p>
        <p style="margin:0 0 12px 0; font-size:13px; color:#333333;">
                Wallpapers sourced from <a href="https://unsplash.com" target="_blank" style="color:#1976d2; text-decoration:underline;">Unsplash</a>
              </p>
              <p style="margin:0 0 12px 0; font-size:13px; color:#333333;">
                Happy Wheels logo sourced from <a href="https://commons.wikimedia.org" target="_blank" style="color:#1976d2; text-decoration:underline;">Wikimedia Commons</a>
              </p>
        <p style="margin:0; font-size:13px;">
          Check out other projects made by the developer: <a href="https://github.com/TonyStark965-404" target="_blank" style="color:#1976d2; text-decoration:underline;">Github</a>
        </p>
      </div>
    `;
  }

  function setupExplorerEvents(win, initialLocation = 'This System') {
    const addressBox = win.querySelector('.explorer-address-box');
    const searchBox = win.querySelector('.explorer-search-box');
    const contentBox = win.querySelector('.explorer-content');
    const sidebar = win.querySelector('.explorer-sidebar');

    const btnBack = win.querySelector('.explorer-btn-back');
    const btnForward = win.querySelector('.explorer-btn-forward');
    const btnUp = win.querySelector('.explorer-btn-up');

    let history = [initialLocation];
    let historyIndex = 0;

    const renderLocationContent = (location) => {
      if (addressBox) addressBox.textContent = location;
      if (searchBox) searchBox.textContent = `Search ${location}`;

      if (!contentBox) return;

      if (location === 'This System') {
        contentBox.innerHTML = `
          <div class="section-heading" style="font-size:12px; font-weight:600; color:#1976d2; margin-bottom:10px;">Folders (6)</div>
          <div class="grid-cards" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
            <div class="folder-card btn-folder-desktop" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              ${ICONS.desktopLarge} <span style="font-size:12px;">Desktop</span>
            </div>
            <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              ${ICONS.documentsLarge} <span style="font-size:12px;">Documents</span>
            </div>
            <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              ${ICONS.downloadsLarge} <span style="font-size:12px;">Downloads</span>
            </div>
            <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              ${ICONS.musicLarge} <span style="font-size:12px;">Music</span>
            </div>
            <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              ${ICONS.picturesLarge} <span style="font-size:12px;">Pictures</span>
            </div>
            <div class="folder-card" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              ${ICONS.videosLarge} <span style="font-size:12px;">Videos</span>
            </div>
          </div>
          <div class="section-heading" style="font-size:12px; font-weight:600; color:#1976d2; margin-bottom:10px;">Devices and drives (1)</div>
          <div class="grid-cards" style="display:grid; grid-template-columns:repeat(2, 1fr); gap:10px;">
            <div class="drive-card" style="background:#ffffff; padding:10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:10px; cursor:pointer;">
              ${ICONS.cDriveLarge}
              <div style="font-size:12px;"><strong>Local Disk (C:)</strong><br/><small style="color:#666;">29.7 GB free of 39.6 GB</small></div>
            </div>
          </div>
        `;
      } else if (location === 'Local Disk (C:)') {
        contentBox.innerHTML = `
          <div class="section-heading" style="font-size:12px; font-weight:600; color:#1976d2; margin-bottom:10px;">Folders (3)</div>
          <div class="grid-cards" style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
            <div class="folder-card c-subfolder" data-name="Program Files" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              <span style="font-size:16px;">📁</span> <span style="font-size:12px;">Program Files</span>
            </div>
            <div class="folder-card c-subfolder" data-name="Users" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              <span style="font-size:16px;">📁</span> <span style="font-size:12px;">Users</span>
            </div>
            <div class="folder-card c-subfolder" data-name="OS" style="background:#ffffff; padding:8px 10px; border:1px solid #e0e0e0; border-radius:8px; display:flex; align-items:center; gap:8px; cursor:pointer;">
              <span style="font-size:16px;">📁</span> <span style="font-size:12px;">OS</span>
            </div>
          </div>
        `;
      } else if (location === 'My Network') {
        contentBox.innerHTML = `<div class="section-heading" style="padding:10px; font-weight:600; color:#1976d2;">Network Locations</div><p style="padding:0 10px; font-size:13px;">Current network: <strong>${currentNetworkName}</strong></p>`;
      } else {
        contentBox.innerHTML = `<div style="padding:40px; text-align:center; font-size:13px; color:#666;">Nothing to see here</div>`;
      }

      updateNavButtons();
    };

    const updateNavButtons = () => {
      if (btnBack) btnBack.disabled = historyIndex <= 0;
      if (btnForward) btnForward.disabled = historyIndex >= history.length - 1;

      const currentLocation = history[historyIndex];
      if (btnUp) {
        btnUp.disabled = currentLocation === 'This System' || currentLocation === 'My Network';
      }
    };

    const navigateTo = (newLocation) => {
      if (history[historyIndex] === newLocation) return;
      history = history.slice(0, historyIndex + 1);
      history.push(newLocation);
      historyIndex++;
      renderLocationContent(newLocation);
    };

    btnBack?.addEventListener('click', () => {
      if (historyIndex > 0) {
        historyIndex--;
        renderLocationContent(history[historyIndex]);
      }
    });

    btnForward?.addEventListener('click', () => {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        renderLocationContent(history[historyIndex]);
      }
    });

    btnUp?.addEventListener('click', () => {
      const curr = history[historyIndex];
      if (curr.startsWith('Local Disk (C:) >')) {
        navigateTo('Local Disk (C:)');
      } else if (curr === 'Local Disk (C:)' || curr === 'Desktop' || curr === 'Documents' || curr === 'Downloads' || curr === 'Music' || curr === 'Pictures' || curr === 'Videos') {
        navigateTo('This System');
      }
    });

    if (contentBox) {
      contentBox.addEventListener('click', (e) => {
        const driveCard = e.target.closest('.drive-card');
        if (driveCard) {
          navigateTo('Local Disk (C:)');
          return;
        }

        const cSubfolder = e.target.closest('.c-subfolder');
        if (cSubfolder) {
          const name = cSubfolder.dataset.name || 'Folder';
          navigateTo(`Local Disk (C:) > ${name}`);
          return;
        }

        const folderCard = e.target.closest('.folder-card');
        if (folderCard && !folderCard.classList.contains('btn-folder-desktop')) {
          const name = folderCard.querySelector('span')?.textContent || 'Folder';
          navigateTo(name);
          return;
        }
      });
    }

    if (sidebar) {
      sidebar.addEventListener('click', (e) => {
        const cSubItem = e.target.closest('.sidebar-c-subfolder');
        if (cSubItem) {
          const name = cSubItem.textContent.replace('📁', '').trim();
          navigateTo(`Local Disk (C:) > ${name}`);
          return;
        }

        const favItem = e.target.closest('.sidebar-folder');
        if (favItem) {
          const name = favItem.textContent.trim();
          navigateTo(name);
          return;
        }

        const sysItem = e.target.closest('.pane-toggle-sys');
        if (sysItem && !e.target.classList.contains('sys-arrow')) {
          navigateTo('This System');
          return;
        }

        const cDriveItem = e.target.closest('.pane-toggle-c');
        if (cDriveItem && !e.target.classList.contains('c-arrow')) {
          navigateTo('Local Disk (C:)');
          return;
        }
      });
    }

    const ribbonToggle = win.querySelector('.ribbon-toggle-btn');
    const ribbonToolbar = win.querySelector('.ribbon-toolbar');
    const ribbonArrow = win.querySelector('.ribbon-arrow');

    if (ribbonToggle && ribbonToolbar && ribbonArrow) {
      ribbonToggle.addEventListener('click', () => {
        if (ribbonToolbar.style.display === 'none') {
          ribbonToolbar.style.display = 'flex';
          ribbonArrow.textContent = '▼';
        } else {
          ribbonToolbar.style.display = 'none';
          ribbonArrow.textContent = '►';
        }
      });
    }

    const cpBtn = win.querySelector('.btn-open-control-panel');
    if (cpBtn) cpBtn.addEventListener('click', () => openSettingsApp());

    const netBtns = win.querySelectorAll('.ribbon-btn-network');
    netBtns.forEach(btn => {
      btn.addEventListener('click', () => openWindow('network'));
    });

    const sysPropBtns = win.querySelectorAll('.btn-sys-prop');
    sysPropBtns.forEach(btn => {
      btn.addEventListener('click', () => openWindow('system-properties'));
    });

    const desktopBtns = win.querySelectorAll('.btn-folder-desktop');
    desktopBtns.forEach(btn => {
      btn.addEventListener('click', () => minimizeAllWindows());
    });

    const toggleFav = win.querySelector('.pane-toggle-fav');
    const favList = win.querySelector('.fav-collapsible-list');
    const favArrow = win.querySelector('.fav-arrow');
    if (toggleFav && favList && favArrow) {
      toggleFav.addEventListener('click', () => {
        if (favList.style.display === 'none') {
          favList.style.display = 'flex';
          favArrow.textContent = '▼';
        } else {
          favList.style.display = 'none';
          favArrow.textContent = '►';
        }
      });
    }

    const toggleSys = win.querySelector('.pane-toggle-sys');
    const sysList = win.querySelector('.sys-collapsible-list');
    const sysArrow = win.querySelector('.sys-arrow');
    if (toggleSys && sysList && sysArrow) {
      toggleSys.addEventListener('click', (e) => {
        if (e.target.classList.contains('sys-arrow')) {
          if (sysList.style.display === 'none') {
            sysList.style.display = 'flex';
            sysArrow.textContent = '▼';
          } else {
            sysList.style.display = 'none';
            sysArrow.textContent = '►';
          }
        }
      });
    }

    const toggleC = win.querySelector('.pane-toggle-c');
    const cList = win.querySelector('.c-collapsible-list');
    const cArrow = win.querySelector('.c-arrow');
    if (toggleC && cList && cArrow) {
      toggleC.addEventListener('click', (e) => {
        if (e.target.classList.contains('c-arrow')) {
          e.stopPropagation();
          if (cList.style.display === 'none' || !cList.style.display) {
            cList.style.display = 'flex';
            cArrow.textContent = '▼';
          } else {
            cList.style.display = 'none';
            cArrow.textContent = '►';
          }
        }
      });
    }

    updateNavButtons();
  }

  function setupStoreEvents(win) {
    const storeContainer = win.querySelector('.store-container');
    if (storeContainer) {
      storeContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('install-btn') && !e.target.classList.contains('installed')) {
          const btn = e.target;
          btn.classList.add('installed');
          btn.textContent = 'Installed';
          btn.style.background = '#28a745';

          const desktopIcons = document.getElementById('desktop-icons');
          if (desktopIcons) {
            const newIcon = document.createElement('div');
            newIcon.className = 'desktop-icon';
            newIcon.dataset.title = btn.dataset.title;
            newIcon.dataset.icon = btn.dataset.icon;
            newIcon.dataset.customUrl = btn.dataset.url;

            const newImgBox = document.createElement('div');
            newImgBox.className = 'icon-img-box';
            newImgBox.style.backgroundColor = '#ffffff';
            newImgBox.style.borderRadius = '12px';
            newImgBox.style.width = '48px';
            newImgBox.style.height = '48px';
            newImgBox.style.display = 'flex';
            newImgBox.style.alignItems = 'center';
            newImgBox.style.justifyContent = 'center';
            newImgBox.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
            newImgBox.style.margin = '0 auto 6px auto';

            if (btn.dataset.icon.startsWith('http') || btn.dataset.icon.includes('assets/') || btn.dataset.icon.endsWith('.png')) {
              newImgBox.innerHTML = `<img src="${btn.dataset.icon}" alt="${btn.dataset.title}" style="width:28px; height:28px; object-fit:contain;" />`;
            } else {
              newImgBox.style.fontSize = '24px';
              newImgBox.innerHTML = btn.dataset.icon;
            }

            const label = document.createElement('span');
            label.textContent = btn.dataset.title;

            newIcon.appendChild(newImgBox);
            newIcon.appendChild(label);
            desktopIcons.appendChild(newIcon);
          }
        }
      });
    }
  }

  // --- 2. WALLPAPER & PERSONALIZATION LOGIC ---
  function setWallpaper(type, filename = '') {
    if (!desktopScreen) return;
    if (type === 'default') {
      desktopScreen.style.backgroundImage = 'none';
      desktopScreen.style.background = 'linear-gradient(135deg, #e67e22 0%, #f1c40f 45%, #e67e22 70%, #2980b9 100%)';
    } else if (type === 'photo') {
      desktopScreen.style.background = `url('./wallpapers/${filename}') center / cover no-repeat`;
    }
  }

  function setupPersonalizeEvents(win) {
    const personalizeBox = win.querySelector('.personalize-box');
    if (!personalizeBox) return;

    const wallTypeSelect = personalizeBox.querySelector('#wallpaper-type-select');
    const photoOptions = personalizeBox.querySelector('#photo-options');
    const photoSelect = personalizeBox.querySelector('#photo-select');

    if (wallTypeSelect) {
      wallTypeSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === 'default') {
          if (photoOptions) photoOptions.style.display = 'none';
          setWallpaper('default');
        } else if (val === 'photo') {
          if (photoOptions) photoOptions.style.display = 'block';
          if (photoSelect) setWallpaper('photo', photoSelect.value);
        }
      });
    }

    if (photoSelect) {
      photoSelect.addEventListener('change', (e) => {
        setWallpaper('photo', e.target.value);
      });
    }

    personalizeBox.addEventListener('click', (e) => {
      if (e.target.classList.contains('wall-btn')) {
        if (desktopScreen) desktopScreen.style.background = e.target.dataset.bg;
        if (wallTypeSelect) wallTypeSelect.value = 'default';
        if (photoOptions) photoOptions.style.display = 'none';
      }
    });
  }
});
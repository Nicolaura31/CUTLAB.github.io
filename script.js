// script.js
// Данные для видео
const videoSources = {
    video1: "video/11.mp4",
    video2: "video/22.mp4", 
    video3: "video/3.mp4",
    video4: "video/4.mp4",
    video5: "video/55.mp4"
};

// Элементы DOM
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const navLinks = document.querySelectorAll('.nav-link');
const cutlabTools = document.querySelectorAll('.cutlab-tool');
const audioPanel = document.querySelector('.audio-panel');
const effectsPanel = document.querySelector('.effects-panel');
const videoOptions = document.querySelectorAll('.video-option');
const demoVideo = document.getElementById('demo-video');
const playButton = document.getElementById('play-button');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeBtn = document.getElementById('volume-btn');
const volumeControl = document.getElementById('volume-control');
const volumeSlider = document.getElementById('volume-slider');
const videoProgress = document.getElementById('video-progress');
const videoProgressFilled = document.getElementById('video-progress-filled');
const videoTime = document.getElementById('video-time');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const timelineIndicator = document.getElementById('timeline-indicator');
const videoTrack = document.getElementById('video-track');
const audioTrack = document.getElementById('audio-track');
const contactForm = document.getElementById('contact-form');
const heroContactBtn = document.getElementById('hero-contact-btn');
const minimizeBtn = document.getElementById('minimize-btn');
const cutlabInterface = document.getElementById('cutlab-interface');
const exportBtn = document.getElementById('export-btn');
const headerContactBtn = document.getElementById('header-contact-btn');
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mainNav = document.getElementById('main-nav');

// Аудио элементы
const masterVolume = document.getElementById('master-volume');

// Состояние приложения
let appState = {
    currentVideo: 'video1',
    isPlaying: false,
    volume: 1,
    tracks: [
        { id: 'video-track', type: 'video', clips: ['clip1', 'clip2'] },
        { id: 'audio-track', type: 'audio', clips: ['clip3', 'clip4'] }
    ],
    effects: [],
    playbackRate: 1,
    currentEffect: null,
    isExporting: false,
    draggedClip: null
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка темы из localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        const icon = themeToggleBtn.querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    // Инициализация видео по умолчанию
    demoVideo.src = videoSources.video1;
    demoVideo.load();

    // Инициализация вкладок
    initTabs();
    
    // Инициализация навигации
    initNavigation();
    
    // Инициализация инструментов CUTLAB
    initCutlabTools();
    
    // Инициализация видео управления
    initVideoControls();
    
    // Инициализация якорных ссылок
    initAnchorLinks();
    
    // Инициализация секретной кнопки
    initSecretButton();
    
    // Инициализация кнопки сворачивания
    initMinimizeButton();
    
    // Инициализация перетаскивания
    initDragAndDrop();
    
    // Инициализация эффектов
    initEffects();
    
    // Инициализация управления скоростью
    initSpeedControls();
    
    // Инициализация кнопки экспорта
    initExportButton();
    
    // Инициализация кнопки в шапке
    initHeaderContactButton();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Оптимизация для мобильных устройств
    optimizeForMobile();
});

// Инициализация мобильного меню
function initMobileMenu() {
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !mobileMenuToggle.contains(e.target) && mainNav.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
}

// Оптимизация для мобильных устройств
function optimizeForMobile() {
    // Предотвращение масштабирования при двойном тапе
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Улучшение обработки касаний для элементов управления видео
    const videoControls = document.querySelectorAll('.btn-control, .video-progress, .timeline-clip');
    videoControls.forEach(control => {
        control.addEventListener('touchstart', function() {
            this.style.transition = 'none';
        });
        
        control.addEventListener('touchend', function() {
            this.style.transition = '';
        });
    });
    
    // Улучшение работы вкладок на мобильных устройствах
    const tabElements = document.querySelectorAll('.tab');
    tabElements.forEach(tab => {
        tab.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        tab.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Переключение темы
themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const icon = themeToggleBtn.querySelector('i');
    if (document.body.classList.contains('light-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'dark');
    }
});

// Инициализация кнопки сворачивания
function initMinimizeButton() {
    minimizeBtn.addEventListener('click', () => {
        cutlabInterface.classList.toggle('minimized');
        
        const icon = minimizeBtn.querySelector('i');
        if (cutlabInterface.classList.contains('minimized')) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
}

// Инициализация вкладок
function initTabs() {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Убираем активный класс у всех вкладок и контента
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс текущей вкладке и контенту
            tab.classList.add('active');
            const tabContent = document.getElementById(`${tabId}-content`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
}

// Инициализация навигации
function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Обычная обработка вкладок
            const tabId = link.getAttribute('data-tab');
            
            // Убираем активный класс у всех вкладок и контента
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс выбранной вкладке и контенту
            const targetTab = document.querySelector(`.tab[data-tab="${tabId}"]`);
            if (targetTab) {
                targetTab.classList.add('active');
                const tabContent = document.getElementById(`${tabId}-content`);
                if (tabContent) {
                    tabContent.classList.add('active');
                    
                    // Плавная прокрутка к вкладке
                    setTimeout(() => {
                        tabContent.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 100);
                }
            }
        });
    });
}

// Инициализация инструментов CUTLAB
function initCutlabTools() {
    cutlabTools.forEach(tool => {
        tool.addEventListener('click', () => {
            cutlabTools.forEach(t => t.classList.remove('active'));
            tool.classList.add('active');
            
            const toolType = tool.getAttribute('data-tool');
            
            // Показываем/скрываем панели
            if (toolType === 'audio') {
                audioPanel.classList.add('show');
                effectsPanel.classList.remove('show');
            } else if (toolType === 'effects') {
                effectsPanel.classList.add('show');
                audioPanel.classList.remove('show');
            } else {
                audioPanel.classList.remove('show');
                effectsPanel.classList.remove('show');
            }
        });
    });

    // Выбор видео
    videoOptions.forEach(option => {
        option.addEventListener('click', () => {
            videoOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            const videoId = option.getAttribute('data-video');
            demoVideo.src = videoSources[videoId];
            demoVideo.load();
            appState.currentVideo = videoId;
            
            // Сбрасываем состояние кнопки воспроизведения
            playButton.style.display = 'flex';
            playPauseBtn.querySelector('i').classList.remove('fa-pause');
            playPauseBtn.querySelector('i').classList.add('fa-play');
            
            // Сбрасываем эффекты при смене видео
            resetEffects();
        });
    });
}

// Инициализация управления видео
function initVideoControls() {
    // Управление видео
    playButton.addEventListener('click', () => {
        demoVideo.play();
        playButton.style.display = 'none';
        playPauseBtn.querySelector('i').classList.remove('fa-play');
        playPauseBtn.querySelector('i').classList.add('fa-pause');
        appState.isPlaying = true;
    });

    playPauseBtn.addEventListener('click', () => {
        if (demoVideo.paused) {
            demoVideo.play();
            playPauseBtn.querySelector('i').classList.remove('fa-play');
            playPauseBtn.querySelector('i').classList.add('fa-pause');
            playButton.style.display = 'none';
            appState.isPlaying = true;
        } else {
            demoVideo.pause();
            playPauseBtn.querySelector('i').classList.remove('fa-pause');
            playPauseBtn.querySelector('i').classList.add('fa-play');
            playButton.style.display = 'flex';
            appState.isPlaying = false;
        }
    });

    // Управление громкостью
    volumeBtn.addEventListener('click', () => {
        volumeControl.classList.toggle('show');
    });

    volumeSlider.addEventListener('input', () => {
        demoVideo.volume = volumeSlider.value;
        masterVolume.value = volumeSlider.value;
        appState.volume = volumeSlider.value;
        updateVolumeIcon(volumeSlider.value);
    });

    // Управление громкостью через аудио панель
    masterVolume.addEventListener('input', () => {
        demoVideo.volume = masterVolume.value;
        volumeSlider.value = masterVolume.value;
        appState.volume = masterVolume.value;
        updateVolumeIcon(masterVolume.value);
    });

    // Обновление прогресса видео
    demoVideo.addEventListener('timeupdate', () => {
        if (demoVideo.duration) {
            const percent = (demoVideo.currentTime / demoVideo.duration) * 100;
            videoProgressFilled.style.width = `${percent}%`;
            
            // Обновление времени
            const currentMinutes = Math.floor(demoVideo.currentTime / 60);
            const currentSeconds = Math.floor(demoVideo.currentTime % 60);
            const durationMinutes = Math.floor(demoVideo.duration / 60);
            const durationSeconds = Math.floor(demoVideo.duration % 60);
            
            videoTime.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds} / ${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
            
            // Обновление позиции индикатора на таймлайне
            timelineIndicator.style.left = `${percent}%`;
            
            // Применение эффектов в зависимости от времени
            applyTimeBasedEffects(demoVideo.currentTime);
        }
    });

    // Перемотка видео при клике на прогресс-бар
    videoProgress.addEventListener('click', (e) => {
        const rect = videoProgress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        demoVideo.currentTime = percent * demoVideo.duration;
    });
    
    // Обработка касаний для прогресс-бара на мобильных устройствах
    videoProgress.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = videoProgress.getBoundingClientRect();
        const touch = e.touches[0];
        const percent = (touch.clientX - rect.left) / rect.width;
        demoVideo.currentTime = percent * demoVideo.duration;
    });

    // Полноэкранный режим
    fullscreenBtn.addEventListener('click', () => {
        if (demoVideo.requestFullscreen) {
            demoVideo.requestFullscreen();
        } else if (demoVideo.mozRequestFullScreen) {
            demoVideo.mozRequestFullScreen();
        } else if (demoVideo.webkitRequestFullscreen) {
            demoVideo.webkitRequestFullscreen();
        } else if (demoVideo.msRequestFullscreen) {
            demoVideo.msRequestFullscreen();
        }
    });

    // Перетаскивание индикатора на таймлайне
    let isDragging = false;

    timelineIndicator.addEventListener('mousedown', (e) => {
        isDragging = true;
        document.addEventListener('mousemove', onTimelineDrag);
        document.addEventListener('mouseup', stopTimelineDrag);
    });
    
    // Обработка касаний для индикатора на мобильных устройствах
    timelineIndicator.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        document.addEventListener('touchmove', onTimelineTouchDrag);
        document.addEventListener('touchend', stopTimelineDrag);
    });

    function onTimelineDrag(e) {
        if (!isDragging) return;
        
        const rect = videoTrack.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        
        timelineIndicator.style.left = `${percent * 100}%`;
        demoVideo.currentTime = percent * demoVideo.duration;
    }
    
    function onTimelineTouchDrag(e) {
        if (!isDragging) return;
        
        const rect = videoTrack.getBoundingClientRect();
        const touch = e.touches[0];
        let percent = (touch.clientX - rect.left) / rect.width;
        percent = Math.max(0, Math.min(1, percent));
        
        timelineIndicator.style.left = `${percent * 100}%`;
        demoVideo.currentTime = percent * demoVideo.duration;
    }

    function stopTimelineDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', onTimelineDrag);
        document.removeEventListener('mouseup', stopTimelineDrag);
        document.removeEventListener('touchmove', onTimelineTouchDrag);
        document.removeEventListener('touchend', stopTimelineDrag);
    }
}

// Инициализация перетаскивания клипов
function initDragAndDrop() {
    const clips = document.querySelectorAll('.timeline-clip');
    
    clips.forEach(clip => {
        clip.addEventListener('dragstart', (e) => {
            appState.draggedClip = clip;
            clip.classList.add('dragging');
            e.dataTransfer.setData('text/plain', clip.id);
            e.dataTransfer.effectAllowed = 'move';
        });
        
        clip.addEventListener('dragend', () => {
            clip.classList.remove('dragging');
            document.querySelectorAll('.timeline-track').forEach(track => {
                track.classList.remove('drop-zone');
            });
            appState.draggedClip = null;
        });
        
        // Обработка касаний для перетаскивания на мобильных устройствах
        clip.addEventListener('touchstart', (e) => {
            appState.draggedClip = clip;
            clip.classList.add('dragging');
        });
        
        clip.addEventListener('touchend', () => {
            clip.classList.remove('dragging');
            document.querySelectorAll('.timeline-track').forEach(track => {
                track.classList.remove('drop-zone');
            });
            appState.draggedClip = null;
        });
    });
    
    const tracks = document.querySelectorAll('.timeline-track');
    
    tracks.forEach(track => {
        track.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            track.classList.add('drop-zone');
        });
        
        track.addEventListener('dragleave', () => {
            track.classList.remove('drop-zone');
        });
        
        track.addEventListener('drop', (e) => {
            e.preventDefault();
            track.classList.remove('drop-zone');
            
            if (appState.draggedClip) {
                // Получаем позицию мыши относительно дорожки
                const rect = track.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                
                // Ограничиваем позицию в пределах дорожки
                const clipWidth = 20; // процент ширины клипа
                const maxLeft = 100 - clipWidth;
                const left = Math.max(0, Math.min(maxLeft, percent * 100));
                
                // Перемещаем клип
                appState.draggedClip.style.left = `${left}%`;
                track.appendChild(appState.draggedClip);
                
                showNotification('Клип перемещен');
            }
        });
        
        // Обработка касаний для перетаскивания на мобильных устройствах
        track.addEventListener('touchmove', (e) => {
            if (appState.draggedClip) {
                e.preventDefault();
                const rect = track.getBoundingClientRect();
                const touch = e.touches[0];
                const x = touch.clientX - rect.left;
                const percent = x / rect.width;
                
                // Ограничиваем позицию в пределах дорожки
                const clipWidth = 20;
                const maxLeft = 100 - clipWidth;
                const left = Math.max(0, Math.min(maxLeft, percent * 100));
                
                // Перемещаем клип
                appState.draggedClip.style.left = `${left}%`;
                track.classList.add('drop-zone');
            }
        });
        
        track.addEventListener('touchend', () => {
            track.classList.remove('drop-zone');
            if (appState.draggedClip) {
                showNotification('Клип перемещен');
            }
        });
    });
}

// Инициализация эффектов
function initEffects() {
    const effectItems = document.querySelectorAll('.effect-item');
    
    effectItems.forEach(effect => {
        effect.addEventListener('click', () => {
            const effectType = effect.getAttribute('data-effect');
            
            // Переключаем активный эффект
            effectItems.forEach(e => e.classList.remove('active'));
            
            if (effectType === 'reset') {
                resetEffects();
                showNotification('Эффекты сброшены');
                return;
            }
            
            effect.classList.add('active');
            
            // Применяем эффект
            applyEffect(effectType);
            
            showNotification(`Эффект "${effect.textContent}" применен`);
        });
    });
}

// Применение эффектов
function applyEffect(effectType) {
    // Сначала сбрасываем все эффекты
    resetEffects();
    
    // Устанавливаем текущий эффект
    appState.currentEffect = effectType;
    
    // Создаем элемент для эффекта
    const effectElement = document.createElement('div');
    effectElement.className = `video-effect effect-${effectType}`;
    
    // Добавляем элемент эффекта в контейнер видео
    document.querySelector('.video-container').appendChild(effectElement);
    
    switch(effectType) {
        case 'fade':
            // Для затухания добавляем специальную обработку
            appState.effects.push({ type: 'fade', startTime: demoVideo.duration - 3, duration: 3 });
            break;
        case 'blackwhite':
            demoVideo.style.filter = 'grayscale(100%)';
            break;
        case 'sepia':
            demoVideo.style.filter = 'sepia(100%)';
            break;
        case 'vintage':
            demoVideo.style.filter = 'sepia(50%) contrast(1.2) brightness(0.9)';
            break;
    }
}

// Сброс эффектов
function resetEffects() {
    // Удаляем все элементы эффектов
    document.querySelectorAll('.video-effect').forEach(el => el.remove());
    
    // Сбрасываем фильтры видео
    demoVideo.style.filter = 'none';
    
    // Сбрасываем состояние
    appState.effects = [];
    appState.currentEffect = null;
    
    // Сбрасываем активные классы у всех эффектов
    document.querySelectorAll('.effect-item').forEach(effect => {
        effect.classList.remove('active');
    });
}

// Применение эффектов на основе времени
function applyTimeBasedEffects(currentTime) {
    // Применяем эффекты в зависимости от времени
    appState.effects.forEach(effect => {
        if (effect.type === 'fade' && currentTime >= effect.startTime) {
            const progress = (currentTime - effect.startTime) / effect.duration;
            const opacity = Math.max(0, 1 - progress);
            
            // Находим элемент эффекта затухания и обновляем его прозрачность
            const fadeEffect = document.querySelector('.effect-fade');
            if (fadeEffect) {
                fadeEffect.style.opacity = opacity;
            }
            
            // Если эффект затухания завершен, сбрасываем его
            if (progress >= 1) {
                appState.effects = appState.effects.filter(e => e.type !== 'fade');
            }
        }
    });
}

// Инициализация управления скоростью
function initSpeedControls() {
    const speedBtns = document.querySelectorAll('.speed-btn');
    
    speedBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const speed = parseFloat(btn.getAttribute('data-speed'));
            
            // Обновляем активную кнопку
            speedBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Применяем скорость
            demoVideo.playbackRate = speed;
            appState.playbackRate = speed;
            
            showNotification(`Скорость воспроизведения: ${speed}x`);
        });
    });
}

// Инициализация кнопки экспорта
function initExportButton() {
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (appState.isExporting) return;
            
            appState.isExporting = true;
            exportBtn.disabled = true;
            exportBtn.textContent = 'Экспорт...';
            
            // Запускаем процесс экспорта
            exportVideoWithEffects();
        });
    }
}

// Функция для экспорта видео с эффектами и водяным знаком
function exportVideoWithEffects() {
    showNotification('Начался процесс экспорта видео...');
    
    // В реальном приложении здесь был бы код для рендеринга видео с эффектами
    // В демо-версии мы симулируем процесс экспорта
    
    setTimeout(() => {
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        
        // В реальном приложении здесь был бы обработанный видеофайл
        // В демо-версии мы просто скачиваем оригинальное видео
        link.href = demoVideo.src;
        link.download = `cutlab_export_${new Date().getTime()}.mp4`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('Видео с эффектами и водяным знаком успешно экспортировано!');
        
        // Сбрасываем состояние кнопки
        appState.isExporting = false;
        exportBtn.disabled = false;
        exportBtn.textContent = 'Экспортировать проект';
        exportBtn.classList.add('pulse');
        
        setTimeout(() => {
            exportBtn.classList.remove('pulse');
        }, 1000);
    }, 3000);
}

// Функция обновления иконки громкости
function updateVolumeIcon(volume) {
    const volumeIcon = volumeBtn.querySelector('i');
    if (volume == 0) {
        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down');
        volumeIcon.classList.add('fa-volume-mute');
    } else if (volume < 0.5) {
        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-mute');
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.remove('fa-volume-down', 'fa-volume-mute');
        volumeIcon.classList.add('fa-volume-up');
    }
}

// Функция показа уведомлений
function showNotification(message) {
    // Создаем элемент уведомления, если его нет
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Обработка формы обратной связи
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        contactForm.reset();
    });
}

// Кнопка "Записаться на пробный урок" в герое
if (heroContactBtn) {
    heroContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Переключаемся на вкладку контактов
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        const contactTab = document.querySelector('.tab[data-tab="contact"]');
        const contactContent = document.getElementById('contact-content');
        
        if (contactTab && contactContent) {
            contactTab.classList.add('active');
            contactContent.classList.add('active');
            
            // Прокручиваем к форме
            contactContent.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Инициализация кнопки в шапке
function initHeaderContactButton() {
    if (headerContactBtn) {
        headerContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Переключаемся на вкладку контактов
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            const contactTab = document.querySelector('.tab[data-tab="contact"]');
            const contactContent = document.getElementById('contact-content');
            
            if (contactTab && contactContent) {
                contactTab.classList.add('active');
                contactContent.classList.add('active');
                
                // Прокручиваем к форме
                contactContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Обработка ошибок видео
demoVideo.addEventListener('error', () => {
    console.error('Ошибка загрузки видео');
    showNotification('Произошла ошибка при загрузке видео. Пожалуйста, попробуйте другое видео.');
});

// Инициализация якорных ссылок
function initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Секретная кнопка с котиком
function initSecretButton() {
    const secretCatBtn = document.getElementById('secret-cat-btn');
    const secretModal = document.getElementById('secret-modal');
    const secretCloseBtn = document.getElementById('secret-close-btn');
    const secretVideo = document.getElementById('secret-video');

    // Функция для случайного позиционирования кнопки
    function positionSecretButton() {
        if (!secretCatBtn) return;
        
        // Получаем размеры окна
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Учитываем размеры кнопки
        const buttonWidth = 30;
        const buttonHeight = 30;
        
        // Генерируем случайные координаты
        const randomX = Math.floor(Math.random() * (windowWidth - buttonWidth - 40)) + 20;
        const randomY = Math.floor(Math.random() * (windowHeight - buttonHeight - 40)) + 20;
        
        // Устанавливаем позицию
        secretCatBtn.style.left = `${randomX}px`;
        secretCatBtn.style.top = `${randomY}px`;
    }

    // Позиционируем кнопку при загрузке и при изменении размера окна
    positionSecretButton();
    window.addEventListener('resize', positionSecretButton);

    // Перемещаем кнопку каждые 30 секунд
    setInterval(positionSecretButton, 30000);

    // Открытие секретного окна
    if (secretCatBtn) {
        secretCatBtn.addEventListener('click', () => {
            if (secretModal) {
                secretModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                // Автоматический запуск видео
                if (secretVideo) {
                    setTimeout(() => {
                        secretVideo.play().catch(e => {
                            console.log('Автовоспроизведение заблокировано:', e);
                        });
                    }, 300);
                }
            }
        });
    }

    // Закрытие секретного окна
    if (secretCloseBtn) {
        secretCloseBtn.addEventListener('click', () => {
            if (secretModal) {
                secretModal.classList.remove('show');
                document.body.style.overflow = '';
                if (secretVideo) {
                    secretVideo.pause();
                    secretVideo.currentTime = 0;
                }
            }
        });
    }

    // Закрытие при клике вне окна
    if (secretModal) {
        secretModal.addEventListener('click', (e) => {
            if (e.target === secretModal) {
                secretModal.classList.remove('show');
                document.body.style.overflow = '';
                if (secretVideo) {
                    secretVideo.pause();
                    secretVideo.currentTime = 0;
                }
            }
        });
    }

    // Закрытие по клавише Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && secretModal && secretModal.classList.contains('show')) {
            secretModal.classList.remove('show');
            document.body.style.overflow = '';
            if (secretVideo) {
                secretVideo.pause();
                secretVideo.currentTime = 0;
            }
        }
    });

    // Зацикливание видео
    if (secretVideo) {
        secretVideo.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play().catch(e => {
                console.log('Повторное воспроизведение заблокировано:', e);
            });
        });
    }
}

// Инициализация бегущей строки
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    if (!marqueeContent) return;
    
    // Клонируем элементы для плавной анимации
    const marqueeItems = document.querySelectorAll('.marquee-item');
    const originalItems = Array.from(marqueeItems).slice(0, 5); // Берем только оригинальные элементы
    
    // Рассчитываем общую ширину всех элементов
    let totalWidth = 0;
    marqueeItems.forEach(item => {
        totalWidth += item.offsetWidth + 40; // 40px - gap
    });
    
    // Устанавливаем ширину контейнера
    marqueeContent.style.width = `${totalWidth * 2}px`;
    
    // Пауза при наведении
    const marqueeContainer = document.querySelector('.marquee-container');
    if (marqueeContainer) {
        marqueeContainer.addEventListener('mouseenter', () => {
            marqueeContent.style.animationPlayState = 'paused';
        });
        
        marqueeContainer.addEventListener('mouseleave', () => {
            marqueeContent.style.animationPlayState = 'running';
        });
        
        // Для мобильных устройств
        marqueeContainer.addEventListener('touchstart', () => {
            marqueeContent.style.animationPlayState = 'paused';
        });
        
        marqueeContainer.addEventListener('touchend', () => {
            setTimeout(() => {
                marqueeContent.style.animationPlayState = 'running';
            }, 2000);
        });
    }
    
    // Клик по элементу бегущей строки
    marqueeItems.forEach(item => {
        item.addEventListener('click', () => {
            const text = item.querySelector('.marquee-text')?.textContent || '';
            showNotification(`Переход к: ${text}`);
            
            // Если клик по "БЕСПЛАТНО" - показываем курсы с бесплатным первым уроком
            if (item.textContent.includes('БЕСПЛАТНО')) {
                // Переключаемся на вкладку курсов
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                const coursesTab = document.querySelector('.tab[data-tab="courses"]');
                const coursesContent = document.getElementById('courses-content');
                
                if (coursesTab && coursesContent) {
                    coursesTab.classList.add('active');
                    coursesContent.classList.add('active');
                    
                    // Прокручиваем к курсам
                    coursesContent.scrollIntoView({ behavior: 'smooth' });
                }
            }
            
            // Если клик по "ПОПУЛЯРНОЕ" - показываем популярный курс
            if (item.textContent.includes('ПОПУЛЯРНОЕ')) {
                // Переключаемся на вкладку цен
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                const pricesTab = document.querySelector('.tab[data-tab="prices"]');
                const pricesContent = document.getElementById('prices-content');
                
                if (pricesTab && pricesContent) {
                    pricesTab.classList.add('active');
                    pricesContent.classList.add('active');
                    
                    // Прокручиваем к ценам
                    pricesContent.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Вызовите функцию initMarquee() в DOMContentLoaded:
document.addEventListener('DOMContentLoaded', function() {
    // ... существующий код ...
    
    // Инициализация бегущей строки
    initMarquee();
});

// Динамическое обновление текста бегущей строки
function updateMarqueeText() {
    const marqueeTexts = [
        { icon: 'fire', badge: 'ПОПУЛЯРНОЕ', text: 'Курс "Продвинутый монтаж" выбирают 80% учеников' },
        { icon: 'gift', badge: 'БЕСПЛАТНО', text: 'Первый пробный урок - абсолютно бесплатно!' },
        { icon: 'bolt', badge: 'НОВИНКА', text: 'Новый курс по анимации - регистрируйтесь первыми' },
        { icon: 'users', badge: 'СКИДКА', text: 'Приведи друга и получи скидку 25%' },
        { icon: 'crown', badge: 'ЭКСКЛЮЗИВ', text: 'Доступ к закрытому комьюнити для учеников' },
        { icon: 'star', badge: 'АКЦИЯ', text: 'Только сегодня - скидка 30% на все курсы' },
        { icon: 'rocket', badge: 'СТАРТ', text: 'Новая группа стартует 1 числа каждого месяца' },
        { icon: 'medal', badge: 'РЕЗУЛЬТАТ', text: 'Наши ученики выигрывают конкурсы видеомонтажа' }
    ];
    
    const marqueeItems = document.querySelectorAll('.marquee-item');
    
    // Обновляем текст в случайном порядке
    marqueeItems.forEach((item, index) => {
        const randomIndex = Math.floor(Math.random() * marqueeTexts.length);
        const marqueeData = marqueeTexts[randomIndex];
        
        const icon = item.querySelector('i');
        const badge = item.querySelector('span:first-of-type');
        const text = item.querySelector('.marquee-text');
        
        if (icon) {
            icon.className = `fas fa-${marqueeData.icon}`;
            // Устанавливаем цвет иконки в зависимости от типа
            if (marqueeData.badge === 'ПОПУЛЯРНОЕ') {
                icon.style.color = '#ff3366';
            } else if (marqueeData.badge === 'БЕСПЛАТНО') {
                icon.style.color = '#28a745';
            } else if (marqueeData.badge === 'НОВИНКА') {
                icon.style.color = '#00c3ff';
            } else if (marqueeData.badge === 'СКИДКА') {
                icon.style.color = '#ff8c00';
            } else if (marqueeData.badge === 'ЭКСКЛЮЗИВ') {
                icon.style.color = '#ffd700';
            }
        }
        
        if (badge) badge.textContent = marqueeData.badge;
        if (text) text.textContent = marqueeData.text;
    });
}

// Обновляем текст каждые 30 секунд
setInterval(updateMarqueeText, 30000);
// ===================== VIDEO HERO =====================
const heroVideo = document.getElementById('heroVideo');
const heroContent = document.getElementById('heroContent');
const scrollIndicator = document.getElementById('scrollIndicator');

// ===================== MUSIC FADE IN =====================
function fadeInMusic(audio, targetVolume, duration) {
    audio.volume = 0;
    audio.play().catch(function () {});
    var step = targetVolume / (duration / 50);
    var fadeInterval = setInterval(function () {
        if (audio.volume + step >= targetVolume) {
            audio.volume = targetVolume;
            clearInterval(fadeInterval);
        } else {
            audio.volume = Math.min(audio.volume + step, targetVolume);
        }
    }, 50);
}

if (heroVideo) {
    heroVideo.currentTime = 0;
    heroVideo.play();
    let blurTriggered = false;

    var musicStarted = false;

    heroVideo.addEventListener('timeupdate', function () {
        if (!blurTriggered && heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 3) {
            blurTriggered = true;
            heroVideo.classList.add('blurred');

            setTimeout(function () {
                heroContent.classList.add('show');
            }, 1500);

            setTimeout(function () {
                scrollIndicator.style.display = 'block';
                scrollIndicator.style.animation = 'fadeInUp 0.8s ease forwards';
            }, 3500);
        }

        if (!musicStarted && heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 5) {
            musicStarted = true;
            fadeInMusic(bgMusic, 0.3, 4000);
            musicPlaying = true;
            musicIcon.textContent = '🎵';
        }
    });

    heroVideo.addEventListener('ended', function () {
        heroVideo.loop = true;
        heroVideo.muted = true;
        heroVideo.play();
    });

    scrollIndicator.addEventListener('click', function () {
        document.getElementById('mensaje').scrollIntoView({ behavior: 'smooth' });
    });
}

// ===================== COUNTDOWN =====================
const eventDate = new Date('2026-07-04T14:00:00-05:00');

function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===================== GOOGLE SHEETS API =====================
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbz-lBCMhTcYElKVgoXaL5aX0ZFYwD1mZmssMCPhhDmYgIcSL50a0s-qxwl5ofieRyKXDQ/exec';

function sendToSheet(data) {
    var params = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
    return fetch(SHEET_URL + '?' + params);
}

// ===================== VOTACIÓN =====================
const VOTE_KEY = 'baby_reveal_vote';

function vote(choice) {
    if (localStorage.getItem(VOTE_KEY)) return;

    localStorage.setItem(VOTE_KEY, choice);

    var girlBtn = document.getElementById('voteGirl');
    var boyBtn = document.getElementById('voteBoy');
    girlBtn.classList.add('voted');
    boyBtn.classList.add('voted');
    if (choice === 'girl') girlBtn.classList.add('selected');
    if (choice === 'boy') boyBtn.classList.add('selected');

    sendToSheet({ type: 'vote', choice: choice }).then(function () {
        loadVotes();
    });
}

function loadVotes() {
    fetch(SHEET_URL + '?type=getVotes')
        .then(function (r) { return r.json(); })
        .then(function (data) {
            if (data.total === 0) return;
            updateVoteUI(data.girl, data.boy, data.total);
        })
        .catch(function () {});
}

function updateVoteUI(girl, boy, total) {
    var girlPct = Math.round((girl / total) * 100);
    var boyPct = 100 - girlPct;

    document.getElementById('girlPercent').textContent = girlPct + '%';
    document.getElementById('boyPercent').textContent = boyPct + '%';

    var barContainer = document.getElementById('voteBarContainer');
    barContainer.style.display = 'block';
    document.getElementById('voteBarGirl').style.width = girlPct + '%';
    document.getElementById('voteBarGirl').textContent = girlPct > 10 ? girlPct + '%' : '';
    document.getElementById('voteBarBoy').style.width = boyPct + '%';
    document.getElementById('voteBarBoy').textContent = boyPct > 10 ? boyPct + '%' : '';
    document.getElementById('voteTotal').textContent = total + ' votos en total';
}

var existingVote = localStorage.getItem(VOTE_KEY);
if (existingVote) {
    var girlBtn = document.getElementById('voteGirl');
    var boyBtn = document.getElementById('voteBoy');
    girlBtn.classList.add('voted');
    boyBtn.classList.add('voted');
    if (existingVote === 'girl') girlBtn.classList.add('selected');
    if (existingVote === 'boy') boyBtn.classList.add('selected');
}
loadVotes();

// ===================== RSVP =====================
function submitRSVP(e) {
    e.preventDefault();
    var name = document.getElementById('rsvpName').value;
    var form = document.getElementById('rsvpForm');
    var success = document.getElementById('rsvpSuccess');

    sendToSheet({ type: 'rsvp', name: name });

    form.style.display = 'none';
    success.style.display = 'block';
}

// ===================== MÚSICA =====================
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let musicPlaying = false;

bgMusic.src = 'music.mp3?v=' + Date.now();
bgMusic.load();

function toggleMusic() {
    var hint = document.getElementById('musicHint');
    var control = document.getElementById('musicControl');

    if (hint) hint.classList.add('hidden');
    control.classList.add('active');

    if (musicPlaying) {
        bgMusic.pause();
        heroVideo.muted = true;
        musicIcon.textContent = '🔇';
        musicPlaying = false;
    } else {
        if (heroVideo.loop) {
            bgMusic.volume = 0.3;
            bgMusic.play().catch(function () {});
        } else {
            heroVideo.muted = false;
        }
        musicIcon.textContent = '🎵';
        musicPlaying = true;
    }
}

// ===================== SCROLL ANIMATIONS =====================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.section, .detalle-card, .team-card, .vote-btn');
    elements.forEach(el => el.classList.add('fade-in'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ===================== GALERÍA LIGHTBOX =====================
function initGallery(images) {
    const grid = document.getElementById('galeriaGrid');
    if (!images || images.length === 0) return;

    grid.innerHTML = '';

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<span class="lightbox-close">&times;</span><img src="" alt="">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Heidy y Nilson';
        img.loading = 'lazy';
        img.addEventListener('click', () => {
            lightboxImg.src = src;
            lightbox.classList.add('active');
        });
        grid.appendChild(img);
    });
}

// Para agregar fotos, descomentar y poner las rutas:
// initGallery(['fotos/foto1.jpg', 'fotos/foto2.jpg', 'fotos/foto3.jpg']);

// ===================== VIDEO HERO =====================
const heroVideo = document.getElementById('heroVideo');
const heroContent = document.getElementById('heroContent');
const scrollIndicator = document.getElementById('scrollIndicator');

if (heroVideo) {
    let blurTriggered = false;

    heroVideo.addEventListener('loadedmetadata', function () {
        heroVideo.currentTime = 5;
    });

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
    });

    heroVideo.addEventListener('ended', function () {
        heroVideo.loop = true;
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

// ===================== VOTACIÓN (localStorage) =====================
const VOTE_KEY = 'baby_reveal_vote';
const VOTES_KEY = 'baby_reveal_votes';

function getVotes() {
    const stored = localStorage.getItem(VOTES_KEY);
    return stored ? JSON.parse(stored) : { girl: 0, boy: 0 };
}

function saveVotes(votes) {
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

function vote(choice) {
    if (localStorage.getItem(VOTE_KEY)) return;

    localStorage.setItem(VOTE_KEY, choice);
    const votes = getVotes();
    votes[choice]++;
    saveVotes(votes);
    updateVoteUI(choice);
}

function updateVoteUI(userVote) {
    const votes = getVotes();
    const total = votes.girl + votes.boy;

    if (total === 0) return;

    const girlPct = Math.round((votes.girl / total) * 100);
    const boyPct = 100 - girlPct;

    document.getElementById('girlPercent').textContent = girlPct + '%';
    document.getElementById('boyPercent').textContent = boyPct + '%';

    const barContainer = document.getElementById('voteBarContainer');
    barContainer.style.display = 'block';
    document.getElementById('voteBarGirl').style.width = girlPct + '%';
    document.getElementById('voteBarGirl').textContent = girlPct > 10 ? girlPct + '%' : '';
    document.getElementById('voteBarBoy').style.width = boyPct + '%';
    document.getElementById('voteBarBoy').textContent = boyPct > 10 ? boyPct + '%' : '';
    document.getElementById('voteTotal').textContent = total + ' votos en total';

    if (userVote) {
        const girlBtn = document.getElementById('voteGirl');
        const boyBtn = document.getElementById('voteBoy');
        girlBtn.classList.add('voted');
        boyBtn.classList.add('voted');
        if (userVote === 'girl') girlBtn.classList.add('selected');
        if (userVote === 'boy') boyBtn.classList.add('selected');
    }
}

const existingVote = localStorage.getItem(VOTE_KEY);
if (existingVote) {
    updateVoteUI(existingVote);
}

// ===================== RSVP =====================
function changeGuests(delta) {
    const input = document.getElementById('rsvpGuests');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
}

function submitRSVP(e) {
    e.preventDefault();
    const form = document.getElementById('rsvpForm');
    const success = document.getElementById('rsvpSuccess');

    // TODO: conectar con Google Forms cuando esté listo
    // Por ahora muestra confirmación visual
    form.style.display = 'none';
    document.querySelector('.rsvp-text').style.display = 'none';
    success.style.display = 'block';
}

// ===================== MÚSICA =====================
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let musicPlaying = false;

function toggleMusic() {
    if (musicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🔇';
        musicPlaying = false;
    } else {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => {});
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

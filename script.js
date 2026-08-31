// SCRIPT PENGATURAN DAN INTERAKSI UNDANGAN DIGITAL KEVIN & EKA

document.addEventListener('DOMContentLoaded', () => {
  // 1. DATA RELEVAN PERNIKAHAN
  const config = {
    groomName: "Kevin Reinaldy",
    brideName: "Eka Putri Astuti",
    weddingDate: "2026-10-01T09:00:00+07:00",
    phoneWhatsApp: "6287816539401" // Nomor WA untuk konfirmasi RSVP
  };

  // Set Current Year in Footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // 2. QUERY PARAMS UNTUK NAMA TAMU UNDANGAN (?to=Nama+Tamu)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('p');
  
  if (guestParam) {
    const formattedGuest = decodeURIComponent(guestParam);
    document.getElementById('guestName').textContent = formattedGuest;
    document.getElementById('heroGuest').textContent = formattedGuest;
    
    // Auto fill form RSVP jika ada
    const rsvpNameInput = document.getElementById('rsvpName');
    if (rsvpNameInput) rsvpNameInput.value = formattedGuest;
  }

  // 3. BUKA UNDANGAN & BGM AUDIO
  const openBtn = document.getElementById('openInvitation');
  const openingSection = document.getElementById('opening');
  const topbar = document.getElementById('topbar');
  const body = document.body;
  const musicBtn = document.getElementById('musicToggle');
  
  // Custom audio player
  const bgm = new Audio('assets/lagu-khas-nikah.mp3');
  bgm.loop = true;
  let isPlaying = false;

  function toggleAudio() {
    if (isPlaying) {
      bgm.pause();
      isPlaying = false;
      musicBtn.classList.remove('is-playing');
      musicBtn.querySelector('.music-text').textContent = 'Musik: Off';
    } else {
      bgm.play().then(() => {
        isPlaying = true;
        musicBtn.classList.add('is-playing');
        musicBtn.querySelector('.music-text').textContent = 'Musik: On';
      }).catch(err => {
        console.log("Audio play blocked by browser:", err);
      });
    }
  }

  openBtn.addEventListener('click', () => {
    openingSection.classList.add('is-hidden');
    body.classList.remove('locked');
    topbar.classList.add('is-visible');
    
    // Play Background Music
    toggleAudio();
  });

  musicBtn.addEventListener('click', toggleAudio);

  // 4. COUNTDOWN TIMER (1 OKTOBER 2026)
  const targetDate = new Date(config.weddingDate).getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById('countdown').innerHTML = '<div style="grid-column: 1/-1; font-size: 1.5rem; color: var(--gold-dark); text-align: center; font-weight: bold;">Acara Sampun Lumampah</div>';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 5. RSVP FORM KE WHATSAPP
  const rsvpForm = document.getElementById('rsvpForm');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvpName').value;
      const attendance = document.getElementById('rsvpAttendance').value;
      const count = document.getElementById('rsvpCount').value;
      const message = document.getElementById('rsvpMessage').value;

      const waMessage = `Halo Kevin & Eka,%0A%0ASaya ingin mengonfirmasi kehadiran acara pernikahan kalian:%0A%0A- *Nama*: ${encodeURIComponent(name)}%0A- *Status Kehadiran*: ${attendance}%0A- *Jumlah Tamu*: ${count} Orang%0A- *Pesan/Doa*: ${encodeURIComponent(message)}%0A%0AMatur Nuwun!`;
      
      const waUrl = `https://wa.me/${config.phoneWhatsApp}?text=${waMessage}`;
      window.open(waUrl, '_blank');
    });
  }

  // 6. UCAPAN & DOA RESTU (LOCAL STORAGE PERSISTENCE)
  const wishForm = document.getElementById('wishForm');
  const wishList = document.getElementById('wishList');

  const defaultWishes = [
    { name: "Bapak Robert & Keluarga", text: "Selamat kagem temanten kekalih, sugeng ambal warsa ing katresnan. Mugi-mugi tansah pinaringan berkah lan kabagyan." },
    { name: "Siti Komala & Rekan", text: "Selamat Kevin lan Eka! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Aamiin YRA." }
  ];

  function getWishes() {
    const saved = localStorage.getItem('kevin_eka_wishes');
    return saved ? JSON.parse(saved) : defaultWishes;
  }

  function renderWishes() {
    const wishes = getWishes();
    wishList.innerHTML = wishes.map(w => `
      <div class="wish">
        <strong>${escapeHtml(w.name)}</strong>
        <p>${escapeHtml(w.text)}</p>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[m];
    });
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wishName');
      const textInput = document.getElementById('wishText');

      if (nameInput.value.trim() && textInput.value.trim()) {
        const wishes = getWishes();
        wishes.unshift({ name: nameInput.value.trim(), text: textInput.value.trim() });
        localStorage.setItem('kevin_eka_wishes', JSON.stringify(wishes));
        
        nameInput.value = '';
        textInput.value = '';
        renderWishes();
      }
    });
  }

  renderWishes();

  // 7. LIGHTBOX FOTO GALERI
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const closeLightbox = document.getElementById('closeLightbox');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('is-open');
      }
    });
  });

  if (closeLightbox) {
    closeLightbox.addEventListener('click', () => {
      lightbox.classList.remove('is-open');
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('is-open');
    }
  });

  // 8. REVEAL ON SCROLL ANIMATION
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});

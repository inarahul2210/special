/* ==========================================================================
   ROMANTIC BIRTHDAY APP - CORE INTERACTION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- APP STATE ---
  const state = {
    currentChapter: 2,
    unlockedChapters: [2],
    anniversaryCode: "2210", // Default passcode (October 22nd - DDMM).
    musicPlaying: false,
    audioInitialized: false,
    synthInterval: null,
    heartsInterval: null,
    // Chapter specific states
    chatProgress: 0,
    timelineIndex: 0,
    polaroidsInteracted: new Set(),
    scratchCompleted: false,
    wishOpenedCount: 0,
    letterOpened: false,
    candlesBlown: false,
    loveClickCount: 0
  };

  // --- MOCK DATABASE ---
  const chatMessages = [
    { sender: 'other', text: "Hey! Gym mein hi hai na abhi?" },
    { sender: 'user', text: "Haan, gym mein hoon. Kya hua?" },
    { sender: 'other', text: "Bahut tezz baarish ho rahi hai bahar... apna dhyan rakhna! 🌧️" },
    { sender: 'user', text: "Arey waah! Pehli baar aisi care? Shock laga par achha laga haha 😄" },
    { sender: 'other', text: "Haha bas aise hi. Main toh apni Nani ke ghar jaa rahi hoon abhi..." },
    { sender: 'other', text: "By the way, check this reel: 'You are a good man' ❤️" },
    { sender: 'user', text: "Aww, thank you! Reels se direct line? Kuch badla badla lag raha hai..." },
    { sender: 'other', text: "Maine mere bachon ke papa dhundh liye hai vaise! 😉" },
    { sender: 'user', text: "Kya?! Kon hai woh? Mujhe bhi toh naam batao!" },
    { sender: 'other', text: "Khud ka naam jaankar kya karoge? 🥺❤️" },
    { sender: 'user', text: "Kya?! Main?? Sach batao clear karo!" },
    { sender: 'other', text: "Haha wait for it... suspense achha hai! 🤫" }
  ];

  const timelineMilestones = [
    {
      date: "Bachpan Ke Din 👧👦",
      title: "Bachpan Se Shuruat",
      desc: "Tu meri pehli dost hai, childhood friend hai, best friend hai — aur main chota tha tabse tujhe jaanta hoon aur tere saath hi hoon. Niche se aakar 'Rahul! Rahul!' bulana, gaye ki tanki saaf karna Holi ke festival ke liye — sab kuch tere saath hi toh magical tha. Thank you for making my childhood magical ❤️. Phir mere attitude ki wajah se tere birthday pe na aaya aur sab band ho gaya.",
      img: "images/20221225_174207_IMG_5423.JPG",
      sticker: "🐮"
    },
    {
      date: "3-4 Saal Baad 🔄",
      title: "Tu Phir Aayi",
      desc: "3-4 saal ki khamoshi ke baad tu hi aage aayi aur message kiya — 'Purani baaton ko bhool kar aage badhna chahiye.' Tujhe nahi pata tha tab ke main andar se kitna khush hua tha. Dhire-dhire group trips mein mile, events mein mile, aur teri woh purani hesitation — aur meri bhi — dheere dheere chali gayi.",
      img: "images/20220609_204518_76f69810-0d2e-4951-b88d-320e6f125290.jpg",
      sticker: "✉️"
    },
    {
      date: "Mumbai Trip 🚄",
      title: "Jab Dil Ne Bola",
      desc: "Train ki woh sari masti, Mumbai ghumna — tere saath sab kuch itna alag feel hota tha. Auto mein tu future partner ki baatein kar rahi thi aur main andar hi andar ro raha tha. Mumbai station par utarte waqt aankhein bhar aayi. Sab ne dekh liya, par main feelings chupa gaya — tujhe pata nahi tha na?",
      img: "images/20230224_205205_57d4a2d7-b022-4535-8c54-5ce6d2c1b538.jpg",
      sticker: "🚂"
    },
    {
      date: "Café Confession ☕",
      title: "Pehla 'Haan' Maangna",
      desc: "Phir aaya wo din... Bahut zyada mushkil ke baad humein yeh mauka mila ki hum dono kahin bahar akele jaa sakein. Par coffee itni gandi thi aur nervousness itni zyada ki tujhe seedha dekh bhi nahi paya. Maine apni life ka sabse important moment itne gande way se start kiya ki kya bataun. Bina tujhe dekhe apne pyaar ke baare mein batana bahut bura propose tha 😂. Agle din gym mein tera message aaya: 'Rahul, hamara koi future nahi hai.' Dil toota, par tujhe khona nahi tha. Iska koi image nhi tha 😂",
      img: "images/Snapchat-1146002892.jpg",
      sticker: "💔"
    },
    {
      date: "Manali Trip",
      title: "Baarish Mein Tere Saath",
      desc: "Phir ek din bhagwan ne phir mauka diya... Raat ke 10 baje baarish mein tujhe famous Siddu khilane ke liye le gaya. Utarte hi paani aa raha tha, maine tera haath pakda aur hum dono bhaage. Uss ek moment mein kuch change ho gaya — nahi pata tha tab ke yeh haath mujhe hamesha thamne ko mill jaiga ❤️.",
      img: "images/20250224_164135_IMG_3549.jpg",
      sticker: "☔"
    },
    {
      date: "22 October 💍",
      title: "Tu Ne 'Haan' Kaha",
      desc: "Gym ki care, woh rizz reels, aur phir tera woh ek message: 'Khud ka naam jaankar kya karoge?' — yaar tu kitni cute hai! 22 October ko tune haan kaha aur us din se meri zindagi teri ho gayi. Aur teri meri. Aaj bhi us din ke baare mein sochta hoon aur muskurata hoon. ❤️",
      img: "images/IMG_2362 (1).JPG",
      sticker: "❤️"
    }
  ];

  const polaroids = [
    { id: 1, caption: "Bachpan Ki Dosti 👧👦", img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80" },
    { id: 2, caption: "Mumbai Trip Memories 🚄", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80" },
    { id: 3, caption: "That Cafe Date ☕", img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&auto=format&fit=crop&q=80" },
    { id: 4, caption: "Manali Rain & Siddu ☔", img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&auto=format&fit=crop&q=80" },
    { id: 5, caption: "Instagram Twist Rizz 📱", img: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=800&auto=format&fit=crop&q=80" },
    { id: 6, caption: "Our Yes Day! 22 Oct 💍", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80" },
    { id: 7, caption: "Random Cuteness ✨", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80" },
    { id: 8, caption: "Pagalpan Together 😂", img: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&auto=format&fit=crop&q=80" }
  ];

  const wishReasons = [
    "Mujhe tumhari aakhon ki woh chamak sabse pyaari lagti hai.",
    "Holi par cow ki paani ki tanki saaf karne wala madness sirf tumhare saath ho sakta tha!",
    "Bahar tezz baarish ke time tumhara 'apna dhyan rakhna' puchna changed my world.",
    "I love how comfortable you are with me, sharing every little details of your life.",
    "Tumhare saath ghumi har jagah—chahe Mumbai ho ya Manali—sabse haseen hai.",
    "Tumhare face par jo cute si smile aati hai jab tum sharmati ho.",
    "That heart-stopping message: 'Khud ka naam jaankar kya karoge?'",
    "I love that we can behave like little kids together, forgetting the entire world.",
    "Tumhare naram haathon ko pakadkar baarish mein bhaagna is my favorite feeling.",
    "You are, and will always be, the cutest and most precious person in my life."
  ];

  const loveLetterText = `Dearest Ina,

Bachpan se lekar aaj tak, humne kitne saare utar-chadaav dekhe hain. Woh Holi par cow ki tanki saaf karna, Mumbai station par mera rona, Manali ki baarish mein haath pakadkar Siddu khane bhaagna... har ek lamha mere dil mein basa hua hai. 

I know, jab maine pehli baar cafe confess kiya tha aur tune 'No' bola, mujhe bahut bura laga tha. Par main khush hoon ki humne dosti nahi chhodi. Aur phir Instagram par tera gym mein tezz baarish ke time 'apna dhyan rakhna' puchna, aur woh line: 'Khud ka naam jaankar kya karoge?'—it was the most beautiful moment of my life!

Aaj tumhare birthday par, main promise karta hoon ki main hamesha tumhara haath pakadkar baarish mein bhaagta rahunga. I promise to support all your dreams and keep making you laugh. Tum mere liye sabse cutest aur sabse special person ho. 

Happy Birthday, Ina. I love you to the stars and back! ❤️`;

  // --- AUDIO SYNTHESIZER FALLBACK ---
  // Plays romantic piano arpeggios if audio asset fails or as an ambient layer
  let audioCtx = null;
  function playSynthNote(freq, duration, type = 'sine') {
    if (!state.musicPlaying) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.log("AudioContext failed", e);
    }
  }

  function startAmbientSynth() {
    // A soft, romantic C Major/Amin arpeggio chord progression
    const progression = [
      [261.63, 329.63, 392.00, 523.25], // C Major
      [220.00, 329.63, 440.00, 523.25], // A Minor
      [349.23, 440.00, 523.25, 698.46], // F Major
      [293.66, 392.00, 587.33, 783.99]  // G Major
    ];
    let chordIdx = 0;
    let noteIdx = 0;

    state.synthInterval = setInterval(() => {
      if (!state.musicPlaying) return;
      const chord = progression[chordIdx];
      const note = chord[noteIdx];

      playSynthNote(note, 1.2, 'triangle');

      noteIdx++;
      if (noteIdx >= chord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % progression.length;
      }
    }, 450);
  }

  function stopAmbientSynth() {
    if (state.synthInterval) {
      clearInterval(state.synthInterval);
      state.synthInterval = null;
    }
  }

  // --- FLOATING HEARTS SYSTEM ---
  function spawnHeart() {
    const container = document.getElementById('hearts-container');
    if (!container) return;

    const heart = document.createElement('div');
    heart.classList.add('floating-heart');

    // Random emoji styles
    const heartEmojis = ['❤️', '💖', '💗', '💕', '🌸', '✨'];
    heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    // Random position and scaling
    const size = Math.random() * 15 + 10;
    heart.style.fontSize = `${size}px`;
    heart.style.left = `${Math.random() * 100}vw`;

    // Random drift and animation speed
    const driftX = (Math.random() * 100 - 50) * 2; // -100px to 100px
    heart.style.setProperty('--drift-x', `${driftX}px`);

    const duration = Math.random() * 4 + 4; // 4s to 8s
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);

    // Cleanup after animation completes
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  function spawnHeartAtClick(clientX, clientY) {
    const container = document.getElementById('hearts-container');
    console.log('spawnHeartAtClick called, container:', container);
    if (!container) return;

    // Spawn 3-5 hearts clustered around click point
    const count = Math.floor(Math.random() * 3) + 3;
    console.log('Spawning', count, 'hearts at', clientX, clientY);
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.classList.add('floating-heart', 'click-spawned');

      const heartEmojis = ['❤️', '💖', '💗', '💕', '🌸', '✨'];
      heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      const size = Math.random() * 18 + 14;
      heart.style.fontSize = `${size}px`;

      // Start from click location (viewport coords)
      const offsetX = (Math.random() - 0.5) * 40; // ±20px spread
      const offsetY = (Math.random() - 0.5) * 40;
      const finalX = clientX + offsetX;
      const finalY = clientY + offsetY;
      heart.style.left = `${finalX}px`;
      heart.style.top = `${finalY}px`;

      console.log('Heart', i, 'positioned at', finalX, finalY);

      // Drift upward and sideways
      const driftX = (Math.random() * 100 - 50) * 1.5;
      heart.style.setProperty('--drift-x', `${driftX}px`);

      const duration = Math.random() * 3 + 3;
      heart.style.animationDuration = `${duration}s`;

      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, duration * 1000);
    }
  }

  function startHeartsRain() {
    if (state.heartsInterval) return;
    state.heartsInterval = setInterval(spawnHeart, 1200);
  }

  // --- WELCOME SCREEN UNLOCK ---
  const welcomeCard = document.getElementById('welcome-card');
  const passcodeCard = document.getElementById('passcode-card');
  const startSurpriseBtn = document.getElementById('start-surprise-btn');
  const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');

  // --- OTP PASSCODE INPUT LOGIC ---
  const otpBoxes = document.querySelectorAll('.otp-box');
  const unlockBtn = document.getElementById('unlock-btn');
  const lockErrorMsg = document.getElementById('lock-error-msg');
  const lockScreen = document.getElementById('lock-screen');
  const mainContent = document.getElementById('main-content');
  const cassetteWidget = document.getElementById('cassette-widget');

  // Auto-advance to next box and handle backspace
  otpBoxes.forEach((box, i) => {
    box.addEventListener('input', (e) => {
      const val = e.target.value.replace(/\D/g, '');
      e.target.value = val.slice(-1);
      resetLockError();
      if (val && i < otpBoxes.length - 1) {
        otpBoxes[i + 1].focus();
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && i > 0) {
        otpBoxes[i - 1].focus();
      }
      if (e.key === 'Enter') attemptUnlock();
    });
    // Handle paste — spread digits across boxes
    box.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
      [...pasted.slice(0, 4)].forEach((ch, j) => {
        if (otpBoxes[j]) otpBoxes[j].value = ch;
      });
      const lastFilled = Math.min(pasted.length - 1, 3);
      if (otpBoxes[lastFilled]) otpBoxes[lastFilled].focus();
    });
  });

  // Card navigation: Welcome → Passcode and back
  startSurpriseBtn.addEventListener('click', () => {
    welcomeCard.classList.remove('active-card');
    welcomeCard.classList.add('hidden-card');
    passcodeCard.classList.remove('hidden-card');
    passcodeCard.classList.add('active-card');
    // Focus first OTP box
    if (otpBoxes[0]) setTimeout(() => otpBoxes[0].focus(), 300);
  });

  backToWelcomeBtn.addEventListener('click', () => {
    passcodeCard.classList.remove('active-card');
    passcodeCard.classList.add('hidden-card');
    welcomeCard.classList.remove('hidden-card');
    welcomeCard.classList.add('active-card');
    // Clear OTP boxes
    otpBoxes.forEach(b => b.value = '');
    resetLockError();
  });

  unlockBtn.addEventListener('click', attemptUnlock);

  // --- UNLOCK & LOCK SCREEN FUNCTIONS ---
  function attemptUnlock() {
    const inputVal = [...otpBoxes].map(b => b.value).join('');
    if (inputVal === state.anniversaryCode || inputVal === '1022' || inputVal === '1234') {
      resetLockError();
      unlockVault();
    } else {
      // Shake all OTP boxes
      otpBoxes.forEach(b => {
        b.classList.add('otp-shake');
        setTimeout(() => b.classList.remove('otp-shake'), 500);
      });
      lockErrorMsg.classList.remove('hidden');
    }
  }

  function resetLockError() {
    lockErrorMsg.classList.add('hidden');
  }

  function unlockVault() {
    // Animate lock screen out
    lockScreen.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    lockScreen.style.opacity = '0';
    lockScreen.style.transform = 'scale(1.04)';

    setTimeout(() => {
      lockScreen.classList.remove('active-screen');
      lockScreen.classList.add('hidden');

      // Show gallery screen first
      const galleryScreen = document.getElementById('gallery-screen');
      galleryScreen.classList.remove('hidden');
      galleryScreen.classList.add('gallery-screen-active');

      startHeartsRain();
      initGallery();
    }, 600);
  }

  // ============================================================
  // MEMORY GALLERY LOGIC
  // ============================================================
  const galleryData = [
    { src: 'images/VID_20260528_115730_645.mp4', caption: 'The smile that brightens every room ❤️' },
    { src: 'images/34d4d95fd394466a81826d067c3ef256.mp4', caption: 'One of my favorite memories ✨' },
    { src: 'images/268b8458eae84c859230793d3bf34124.mp4', caption: 'Still makes me smile every time 😊' },
    { src: 'images/4120aeb96b28465d9835a09077c894cd.mp4', caption: 'Family, love and happiness ❤️' },
    { src: 'images/eb0ede02207b4019990461a699e7c776.mp4', caption: 'Main character energy 👑' },
    { src: 'images/fa224fb47238447ea71d8fb66cc0edee.mp4', caption: 'This picture deserves a frame 🖼️' },
    { src: 'images/VID_20260513_113641_684.mp4', caption: 'Caught being adorable 😍' },
    { src: 'images/VID_20260523_084126_605.mp4', caption: 'I still laugh at this one 😂' },
    { src: 'images/VID_20260523_084126_606.mp4', caption: 'A moment worth keeping forever 💕' },
    { src: 'images/d9472d57d54545e7a7182a5f5acd6759.mp4', caption: 'Pure happiness captured 📸' },
    { src: 'images/0419993ba0634ffda7dd002176a2a314.mp4', caption: 'My lucky day was meeting you ❤️' },
    { src: 'images/47099d555eec458a9775bbe3d8059680.mp4', caption: 'The most beautiful chapter of my life ✨' },
  ];

  const galleryFinaleText = `My favorite picture isn't in this gallery...\nIt's the one we're still creating together. ❤️`;

  function initGallery() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';

    // Create 12 empty placeholder slots first
    galleryData.forEach((_, i) => {
      const slot = document.createElement('div');
      slot.classList.add('gallery-slot', 'gallery-slot-empty');
      slot.id = `gslot-${i}`;

      const inner = document.createElement('div');
      inner.classList.add('gallery-slot-inner');
      inner.innerHTML = `<span class="gallery-placeholder-icon">📷</span>`;
      slot.appendChild(inner);

      grid.appendChild(slot);
    });

    // Spawn floating petals
    spawnGalleryPetals();

    // Reveal images one by one every 1 second
    galleryData.forEach((item, i) => {
      setTimeout(() => revealGallerySlot(i, item), (i + 1) * 100);
    });

    // After all 12 are shown: wait 2s then trigger finale
    setTimeout(() => triggerGalleryFinale(), (galleryData.length * 2 + 4) * 100);
  }

  function revealGallerySlot(index, item) {
    const slot = document.getElementById(`gslot-${index}`);
    if (!slot) return;

    // Random rotation between -5 and +5 deg
    const rot = (Math.random() * 10 - 5).toFixed(2);

    // Build image card
    const card = document.createElement('div');
    card.classList.add('gallery-card');
    card.style.setProperty('--card-rot', `${rot}deg`);

    const imgWrap = document.createElement('div');
    imgWrap.classList.add('gallery-img-wrap');

    let media;
    if (item.src.endsWith('.mp4') || item.src.endsWith('.webm')) {
      media = document.createElement('video');
      media.src = item.src;
      media.autoplay = true;
      media.loop = false; // changed to false so they stop after one run
      media.muted = true;
      media.playsInline = true;
      media.classList.add('gallery-img');
    } else {
      media = document.createElement('img');
      media.src = item.src;
      media.alt = item.caption;
      media.classList.add('gallery-img');
    }

    // Fallback: show gradient placeholder if media missing
    media.onerror = function () {
      this.style.display = 'none';
      imgWrap.style.background = `linear-gradient(135deg,
        hsl(${320 + index * 10}, 60%, 75%) 0%,
        hsl(${280 + index * 8}, 55%, 65%) 100%)`;
      const icon = document.createElement('span');
      icon.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:32px;';
      icon.textContent = '🌸';
      imgWrap.appendChild(icon);
    };

    imgWrap.appendChild(media);

    const cap = document.createElement('p');
    cap.classList.add('gallery-caption');
    cap.textContent = item.caption;

    card.appendChild(imgWrap);
    card.appendChild(cap);

    // Replace placeholder slot content
    slot.innerHTML = '';
    slot.classList.remove('gallery-slot-empty');
    slot.classList.add('gallery-slot-filled');
    slot.appendChild(card);

    // Trigger spring animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        slot.classList.add('gallery-slot-revealed');
      });
    });

    // Small sound chime
    playSynthNote(523.25 + index * 20, 0.08);
  }

  function triggerGalleryFinale() {
    const finale = document.getElementById('gallery-finale');
    const grid = document.getElementById('gallery-grid');

    // Dim the gallery grid
    grid.classList.add('gallery-grid-dimmed');

    // Launch confetti
    launchGalleryConfetti();

    // Show finale overlay
    setTimeout(() => {
      finale.classList.remove('hidden');
      finale.classList.add('gallery-finale-visible');

      // Start typewriter on the message
      const target = document.getElementById('gallery-typewriter');
      typewriteGalleryMessage(target, galleryFinaleText, () => {
        // Show continue button after typing finishes
        const btn = document.getElementById('gallery-continue-btn');
        btn.classList.add('gallery-btn-visible');
      });
    }, 600);
  }

  function typewriteGalleryMessage(el, text, onDone) {
    el.textContent = '';
    let i = 0;
    function tick() {
      if (i < text.length) {
        const ch = text.charAt(i);
        if (ch === '\n') {
          el.innerHTML += '<br>';
        } else {
          el.textContent += ch;
        }
        i++;
        setTimeout(tick, 45);
      } else {
        if (onDone) onDone();
      }
    }
    tick();
  }

  // Continue button: transition from gallery to main story
  document.getElementById('gallery-continue-btn').addEventListener('click', () => {
    const galleryScreen = document.getElementById('gallery-screen');
    galleryScreen.style.transition = 'opacity 0.7s ease';
    galleryScreen.style.opacity = '0';

    setTimeout(() => {
      galleryScreen.classList.add('hidden');
      galleryScreen.classList.remove('gallery-screen-active');
      mainContent.classList.remove('hidden');
      cassetteWidget.classList.remove('hidden');
      initCollagePhotoReveal();
      navigateToChapter(2);
    }, 700);
  });

  // ---- GALLERY PETALS ----
  function spawnGalleryPetals() {
    const container = document.getElementById('gallery-petals');
    if (!container) return;
    const petals = ['🌸', '🌺', '✨', '💫', '🌹', '💕', '⭐'];
    function addPetal() {
      const p = document.createElement('span');
      p.classList.add('gallery-petal');
      p.textContent = petals[Math.floor(Math.random() * petals.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (Math.random() * 6 + 6) + 's';
      p.style.fontSize = (Math.random() * 14 + 10) + 'px';
      p.style.opacity = (Math.random() * 0.4 + 0.2).toFixed(2);
      container.appendChild(p);
      setTimeout(() => p.remove(), 14000);
    }
    for (let i = 0; i < 12; i++) setTimeout(addPetal, i * 400);
    setInterval(addPetal, 1800);
  }

  // ---- GALLERY CONFETTI ----
  function launchGalleryConfetti() {
    const canvas = document.getElementById('gallery-confetti');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = 'block';

    const pieces = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      r: Math.random() * 7 + 3,
      d: Math.random() * 160 + 40,
      color: `hsl(${Math.random() * 80 + 300}, 80%, 65%)`,
      tilt: Math.random() * 10 - 5,
      tiltAngle: 0,
      tiltSpeed: Math.random() * 0.1 + 0.05,
    }));

    let frame = 0;
    let animId;
    function drawConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      pieces.forEach(p => {
        p.tiltAngle += p.tiltSpeed;
        p.y += (Math.cos(p.d + frame / 25) + 2.5);
        p.x += Math.sin(frame / 30) * 0.8;
        p.tilt = Math.sin(p.tiltAngle) * 12;

        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 4);
        ctx.stroke();
        ctx.fill();
      });

      if (frame < 260) {
        animId = requestAnimationFrame(drawConfetti);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
      }
    }
    drawConfetti();
  }


  function initCollagePhotoReveal() {
    const photos = document.querySelectorAll('.collage-photo');
    const notesPanel = document.querySelector('.photo-notes-panel');
    const noteCards = notesPanel ? notesPanel.querySelectorAll('.note-card') : [];

    // ensure floating note container exists
    let floating = document.querySelector('.floating-note-card');
    if (!floating) {
      floating = document.createElement('div');
      floating.className = 'floating-note-card';
      floating.setAttribute('aria-hidden', 'true');
      floating.innerHTML = '<div class="note-img"></div><div class="note-text"></div>';
      document.body.appendChild(floating);
    }

    photos.forEach((photo, i) => {
      photo.dataset.index = i;
      // Drag handling
      setupPhotoDrag(photo);
      // Click/reveal handling
      photo.addEventListener('click', (e) => {
        // Only toggle if not a drag (distance < 5px)
        if (photo._dragDistance !== undefined && photo._dragDistance >= 5) {
          // Was a drag, don't toggle
          return;
        }
        togglePhoto(photo, i, noteCards);
      });
      photo.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') togglePhoto(photo, i, noteCards);
      });
    });
  }

  function setupPhotoDrag(photo) {
    let isDragging = false;
    let startX, startY, startLeft, startTop, dragDistance = 0;

    photo.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragDistance = 0;
      photo._dragDistance = 0;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = photo.offsetLeft;
      startTop = photo.offsetTop;
      photo.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging || !photo.classList.contains('dragging')) return;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      photo._dragDistance = dragDistance;

      const newLeft = startLeft + deltaX;
      const newTop = startTop + deltaY;
      photo.style.left = `${newLeft}px`;
      photo.style.top = `${newTop}px`;
      photo.style.transform = 'none';
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      photo.classList.remove('dragging');
    });
  }

  function showFloatingNoteAt(photo, text) {
    const floating = document.querySelector('.floating-note-card');
    if (!floating) return;

    const imgWrap = floating.querySelector('.note-img');
    const textWrap = floating.querySelector('.note-text');
    // clear
    imgWrap.innerHTML = '';
    textWrap.innerHTML = '';

    const srcImg = photo.querySelector('img');
    const cloned = srcImg ? srcImg.cloneNode() : document.createElement('img');
    imgWrap.appendChild(cloned);

    const p = document.createElement('p');
    p.textContent = text;
    textWrap.appendChild(p);

    // position using viewport coordinates
    const rect = photo.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const topPx = rect.bottom + 12;

    floating.style.left = `${centerX}px`;
    floating.style.top = `${topPx}px`;
    floating.style.transform = 'translateX(-50%)';
    floating.classList.add('visible');
    floating.setAttribute('aria-hidden', 'false');

    // make focusable
    if (!floating.hasAttribute('tabindex')) floating.setAttribute('tabindex', '-1');
    try { floating.focus({ preventScroll: true }); } catch (e) { floating.focus(); }
  }

  function hideFloatingNote() {
    const floating = document.querySelector('.floating-note-card');
    if (!floating) return;
    floating.classList.remove('visible');
    floating.setAttribute('aria-hidden', 'true');
    floating.style.left = '';
    floating.style.top = '';
    floating.style.transform = '';
  }

  function togglePhoto(photo, index, noteCards) {
    const isRevealed = photo.classList.toggle('revealed');
    if (isRevealed) photo.setAttribute('aria-pressed', 'true');
    else photo.setAttribute('aria-pressed', 'false');

    // Show corresponding note card below, hide others
    if (noteCards && noteCards.length) {
      const notesPanel = document.querySelector('.photo-notes-panel');
      // hide all first
      noteCards.forEach((card) => {
        card.classList.remove('active');
        card.setAttribute('aria-hidden', 'true');
      });

      // remove any inline poster notes from other photos
      document.querySelectorAll('.poster-note').forEach(p => p.remove());
      document.querySelectorAll('.collage-photo.expanded').forEach(ph => { if (ph !== photo) ph.classList.remove('expanded'); });

      if (isRevealed) {
        // small timeout so the photo unblur animation is visible before showing the card
        setTimeout(() => {
          const activeCard = Array.from(noteCards).find(c => Number(c.dataset.index) === index);
          if (!activeCard) return;

          // Read original text from the corresponding note-card in the notes panel
          const originalText = activeCard.querySelector('p') ? activeCard.querySelector('p').textContent : '';

          // Expand the clicked photo and insert an inline poster-note below the image
          const img = photo.querySelector('img');
          if (img) {
            if (img.naturalHeight > img.naturalWidth) {
              photo.classList.add('is-portrait');
              photo.classList.remove('is-landscape');
            } else {
              photo.classList.add('is-landscape');
              photo.classList.remove('is-portrait');
            }
          }
          photo.classList.add('expanded');
          let poster = photo.querySelector('.poster-note');
          if (!poster) {
            poster = document.createElement('div');
            poster.className = 'poster-note';
            const p = document.createElement('p');
            p.textContent = originalText;
            poster.appendChild(p);
            photo.appendChild(poster);
          } else {
            poster.querySelector('p').textContent = originalText;
            poster.style.display = 'block';
          }
        }, 180);
      } else {
        // hide panel when collapsing
        // collapse inline poster inside this photo
        const poster = photo.querySelector('.poster-note');
        if (poster) {
          poster.remove();
        }
        photo.classList.remove('expanded');
        // ensure floating note (if any) is hidden
        hideFloatingNote();
      }
    }

    // no page transition here — revealing photos should not open the story
  }

  // Initialize collage photo reveal and heart spawning
  initCollagePhotoReveal();

  // Add click handler for empty space heart spawning on lock-screen
  lockScreen.addEventListener('click', (e) => {
    // Check if click is on empty space (not on photo, card, or interactive element)
    const isPhoto = e.target.closest('.collage-photo');
    const isCard = e.target.closest('.lock-card');
    const isButton = e.target.closest('button') || e.target.closest('input');

    if (!isPhoto && !isCard && !isButton) {
      console.log('Spawning heart at:', e.clientX, e.clientY);
      spawnHeartAtClick(e.clientX, e.clientY);
    }
  });

  // --- AUDIO LOGIC ---
  const bgAudio = document.getElementById('bg-audio');
  const musicToggle = document.getElementById('music-toggle');
  const playIcon = musicToggle.querySelector('.play-icon');
  const pauseIcon = musicToggle.querySelector('.pause-icon');
  const reels = document.querySelectorAll('.reel');

  function initAudio() {
    if (state.audioInitialized) return;

    // Check if background MP3 plays successfully, fallback to custom synth if it throws error
    bgAudio.volume = 0.3;
    bgAudio.play()
      .then(() => {
        console.log("Audio playing successfully.");
      })
      .catch(err => {
        console.log("Local audio blocked or missing. Starting synth audio fallback.");
        startAmbientSynth();
      });

    state.audioInitialized = true;
  }

  musicToggle.addEventListener('click', () => {
    toggleMusic(!state.musicPlaying);
  });

  function toggleMusic(play) {
    state.musicPlaying = play;
    if (play) {
      bgAudio.play().catch(() => { });
      if (!bgAudio.duration) {
        startAmbientSynth();
      }
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      reels.forEach(r => r.classList.add('spinning'));
    } else {
      bgAudio.pause();
      stopAmbientSynth();
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      reels.forEach(r => r.classList.remove('spinning'));
    }
  }

  // --- NAVIGATION MANAGER (ROUTER) ---
  const navButtons = document.querySelectorAll('.nav-btn');
  const chapters = document.querySelectorAll('.chapter-section');
  const progressBar = document.getElementById('story-progress');

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCh = parseInt(btn.dataset.chapter);
      if (state.unlockedChapters.includes(targetCh)) {
        navigateToChapter(targetCh);
      }
    });
  });

  function navigateToChapter(chNum) {
    state.currentChapter = chNum;

    // Update active nav button
    navButtons.forEach(btn => {
      btn.classList.remove('active');
      if (parseInt(btn.dataset.chapter) === chNum) {
        btn.classList.add('active');
      }
    });

    // Update progress bar width
    const percentage = (chNum / 6) * 100;
    progressBar.style.width = `${percentage}%`;

    // Swap active chapters with transitions
    chapters.forEach(ch => {
      ch.classList.remove('active-chapter');
      ch.classList.add('hidden-chapter');
    });

    const targetSection = document.getElementById(`chapter-${chNum}`);
    setTimeout(() => {
      targetSection.classList.remove('hidden-chapter');
      targetSection.classList.add('active-chapter');

      // Auto-trigger setup based on section loaded
      if (chNum === 2) initTimeline();
      if (chNum === 3) initPolaroidGallery();
      if (chNum === 4) initSurprisesSection();
      if (chNum === 5) initLoveLetter();
      if (chNum === 6) initBirthdayFinale();
    }, 400);
  }

  function unlockChapter(chNum) {
    if (!state.unlockedChapters.includes(chNum)) {
      state.unlockedChapters.push(chNum);
      const navBtn = document.getElementById(`nav-btn-${chNum}`);
      if (navBtn) {
        navBtn.classList.remove('locked');
      }
    }
  }

  // Bind chapter completion buttons
  document.querySelectorAll('.next-chapter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCh = parseInt(btn.dataset.target);
      unlockChapter(targetCh);
      navigateToChapter(targetCh);
    });
  });

  // --- CHAPTER 2: SCRAPBOOK TIMELINE LOGIC ---
  const timelineImg = document.getElementById('timeline-img');
  const timelineDate = document.getElementById('timeline-date');
  const timelineTitle = document.getElementById('timeline-title');
  const timelineDesc = document.getElementById('timeline-desc');
  const timelineSticker = document.getElementById('timeline-sticker');
  const timelineIndicator = document.getElementById('timeline-indicator');

  const prevTimeBtn = document.getElementById('prev-timeline-btn');
  const nextTimeBtn = document.getElementById('next-timeline-btn');
  const completionPanel2 = document.getElementById('completion-2');

  prevTimeBtn.addEventListener('click', () => {
    if (state.timelineIndex > 0) {
      state.timelineIndex--;
      renderTimelineMilestone();
    }
  });

  nextTimeBtn.addEventListener('click', () => {
    if (state.timelineIndex < timelineMilestones.length - 1) {
      state.timelineIndex++;
      renderTimelineMilestone();
    }
  });

  function initTimeline() {
    renderTimelineMilestone();
  }

  function renderTimelineMilestone() {
    const data = timelineMilestones[state.timelineIndex];
    const card = document.getElementById('scrapbook-card');

    // Add page flip fade animation
    card.style.opacity = 0;
    card.style.transform = 'scale(0.95)';

    setTimeout(() => {
      timelineImg.src = data.img;
      timelineDate.innerText = data.date;
      timelineTitle.innerText = data.title;
      timelineDesc.innerText = data.desc;
      timelineSticker.innerText = data.sticker;

      // Update indicators
      const progressPercent = (state.timelineIndex / (timelineMilestones.length - 1)) * 100;
      timelineIndicator.style.width = `${progressPercent}%`;

      // Enable/Disable buttons
      prevTimeBtn.disabled = state.timelineIndex === 0;
      nextTimeBtn.disabled = state.timelineIndex === timelineMilestones.length - 1;

      card.style.opacity = 1;
      card.style.transform = 'scale(1)';

      // If viewed final slide, unlock next chapter
      if (state.timelineIndex === timelineMilestones.length - 1) {
        completionPanel2.classList.remove('hidden');
        unlockChapter(3);
      }
    }, 300);
  }

  // --- CHAPTER 3: DRAGGABLE POLAROID STACK LOGIC ---
  const polaroidBoard = document.getElementById('polaroid-board');
  const lightbox = document.getElementById('polaroid-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const completionPanel3 = document.getElementById('completion-3');
  let topZIndex = 10;

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.add('hidden');
  });

  function initPolaroidGallery() {
    if (polaroidBoard.querySelector('.polaroid-card')) return; // Already rendered

    polaroidBoard.innerHTML = ''; // Clear loading

    polaroids.forEach((item, index) => {
      const card = document.createElement('div');
      card.classList.add('polaroid-card');
      card.style.opacity = '0';
      card.style.transform = 'translateY(-40px) rotate(0deg)';
      card.style.transition = `opacity 0.4s ease ${index * 0.12}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${index * 0.12}s`;

      // Push-pin at top center
      const pin = document.createElement('div');
      pin.classList.add('polaroid-pin');
      card.appendChild(pin);

      // Add sticky tape overlay decoration
      const tape = document.createElement('div');
      tape.classList.add('polaroid-tape-overlay');
      card.appendChild(tape);

      const img = document.createElement('img');
      img.src = item.img;
      card.appendChild(img);

      const cap = document.createElement('div');
      cap.classList.add('polaroid-caption');
      cap.innerText = item.caption;
      card.appendChild(cap);

      // Random position spreads across container
      const boardWidth = polaroidBoard.clientWidth;
      const boardHeight = polaroidBoard.clientHeight;
      const x = Math.random() * (boardWidth - 200) + 10;
      const y = Math.random() * (boardHeight - 240) + 10;
      const rot = Math.random() * 30 - 15; // -15deg to 15deg

      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      card.style.transform = `rotate(${rot}deg)`;
      card.style.zIndex = index + 1;

      // Make Draggable
      bindDragEvents(card, item);

      polaroidBoard.appendChild(card);

      // Trigger staggered fly-in animation
      requestAnimationFrame(() => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = `rotate(${rot}deg)`;
        }, index * 120);
      });
    });
  }

  function bindDragEvents(card, item) {
    let active = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Mouse events
    card.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events
    card.addEventListener('touchstart', dragStart, { passive: true });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    // Double click to view full size
    card.addEventListener('dblclick', () => {
      openLightbox(item);
    });

    // Double tap for mobile
    let lastTap = 0;
    card.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      if (tapLength < 300 && tapLength > 0) {
        openLightbox(item);
      }
      lastTap = currentTime;
    });

    function dragStart(e) {
      active = true;
      card.style.zIndex = ++topZIndex;

      // Disable transition so dragging is instant and smooth without delay
      card.style.transition = 'none';

      // Get initial position relative to pointer
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      state.polaroidsInteracted.add(item.id);
      checkPolaroidsCompletion();
    }

    function drag(e) {
      if (!active) return;
      if (e.type === 'touchmove') e.preventDefault(); // prevent pull-to-refresh scrolling

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - initialX;
        currentY = e.touches[0].clientY - initialY;
      } else {
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
      }

      xOffset = currentX;
      yOffset = currentY;

      // Extract rotation value
      const style = window.getComputedStyle(card);
      const transform = style.getPropertyValue('transform');
      let rot = 0;
      if (transform !== 'none') {
        const values = transform.split('(')[1].split(')')[0].split(',');
        const a = values[0];
        const b = values[1];
        rot = Math.round(Math.atan2(b, a) * (180 / Math.PI));
      }

      card.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) rotate(${rot}deg)`;
    }

    function dragEnd() {
      active = false;
    }
  }

  function openLightbox(item) {
    lightboxImg.src = item.img;
    lightboxCaption.innerText = item.caption;
    lightbox.classList.remove('hidden');
    state.polaroidsInteracted.add(item.id);
    checkPolaroidsCompletion();
  }

  function checkPolaroidsCompletion() {
    // Unlock chapter 4 when at least 4 photos have been interactively touched/opened
    if (state.polaroidsInteracted.size >= 4) {
      completionPanel3.classList.remove('hidden');
      unlockChapter(4);
    }
  }

  // --- CHAPTER 4: LITTLE SURPRISES LOGIC ---
  const wishModal = document.getElementById('wish-modal');
  const closeWish = document.getElementById('close-wish-modal');
  const wishText = document.getElementById('wish-reason-text');

  const scratchCanvas = document.getElementById('scratch-canvas');
  const scratchCtx = scratchCanvas.getContext('2d');
  const completionPanel4 = document.getElementById('completion-4');
  let isScratching = false;
  let wishLocked = false;

  function initSurprisesSection() {
    setupScratchCard();
    setupWishStars();
  }

  // --- WISHING STARS INTERACTION ---
  function setupWishStars() {
    const stars = document.querySelectorAll('.wish-star');
    if (!stars.length) return;
    stars.forEach((star, i) => {
      star.addEventListener('click', () => {
        if (wishLocked) return;
        wishLocked = true;

        star.classList.add('wish-active');
        setTimeout(() => star.classList.remove('wish-active'), 500);

        playSynthNote(523.25, 0.15);
        setTimeout(() => playSynthNote(659.25, 0.15), 120);
        setTimeout(() => playSynthNote(783.99, 0.3), 240);

        const reason = wishReasons[i % wishReasons.length];
        wishText.innerText = `"${reason}"`;
        document.querySelector('.modal-emoji').innerText = ['🌟', '✨', '🌠', '💫', '🌙'][i % 5];
        document.querySelector('.modal-card h4').innerText = 'A Star Wish For You ✨';

        setTimeout(() => {
          wishModal.classList.remove('hidden');
          state.wishOpenedCount++;
          wishLocked = false;
          checkSurpriseCompletion();
        }, 400);
      });
    });
  }

  closeWish.addEventListener('click', () => {
    wishModal.classList.add('hidden');
  });

  // Scratch Card Canvas Drawing
  function setupScratchCard() {
    const w = scratchCanvas.width;
    const h = scratchCanvas.height;

    // Fill canvas with gold/silver metallic color gradient
    const grad = scratchCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#D4AF37'); // Gold
    grad.addColorStop(0.5, '#F3E5AB'); // Cream gold
    grad.addColorStop(1, '#AA7C11'); // Dark gold

    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, w, h);

    // Add text on the cover
    scratchCtx.fillStyle = '#4A2B32';
    scratchCtx.font = 'bold 16px Outfit, sans-serif';
    scratchCtx.textAlign = 'center';
    scratchCtx.fillText('Scratch with Mouse/Finger', w / 2, h / 2 - 10);
    scratchCtx.font = 'italic 12px Inter, sans-serif';
    scratchCtx.fillText('Reveal Birthday Ticket 🎫', w / 2, h / 2 + 15);

    // Bind event listeners for scratching
    scratchCanvas.addEventListener('mousedown', scratchStart);
    scratchCanvas.addEventListener('mousemove', scratchMove);
    document.addEventListener('mouseup', scratchEnd);

    scratchCanvas.addEventListener('touchstart', scratchStart, { passive: true });
    scratchCanvas.addEventListener('touchmove', scratchMove, { passive: false });
    document.addEventListener('touchend', scratchEnd);
  }

  function scratchStart(e) {
    isScratching = true;
    scratchDraw(e);
  }

  function scratchMove(e) {
    if (!isScratching) return;
    e.preventDefault();
    scratchDraw(e);
  }

  function scratchEnd() {
    isScratching = false;
    checkScratchPercent();
  }

  function scratchDraw(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    let x, y;

    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
    scratchCtx.fill();
  }

  function checkScratchPercent() {
    const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
    const pixels = imgData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparent++;
      }
    }

    const percent = (transparent / (scratchCanvas.width * scratchCanvas.height)) * 100;
    if (percent > 65 && !state.scratchCompleted) {
      // Reveal the rest automatically
      scratchCanvas.style.transition = 'opacity 0.5s ease';
      scratchCanvas.style.opacity = 0;
      setTimeout(() => {
        scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
      }, 500);

      state.scratchCompleted = true;
      playSynthNote(783.99, 0.4);
      checkSurpriseCompletion();
    }
  }

  // (Reset scratch button removed per user request)

  function checkSurpriseCompletion() {
    // Need at least one wish reveal and scratch card finished to unlock the Letter Chapter
    if (state.wishOpenedCount >= 1 && state.scratchCompleted) {
      completionPanel4.classList.remove('hidden');
      unlockChapter(5);
    }
  }

  // --- CHAPTER 5: LOVE LETTER LOGIC ---
  const envelope = document.getElementById('envelope-main');
  const waxSeal = document.getElementById('wax-seal');
  const letterPaper = document.getElementById('letter-paper');
  const typewriterTarget = document.getElementById('typewriter-letter');
  const completionPanel5 = document.getElementById('completion-5');

  // Wax seal click — break seal then open envelope
  if (waxSeal) {
    waxSeal.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!state.letterOpened) {
        waxSeal.classList.add('seal-broken');
        playSynthNote(440.00, 0.15);
        setTimeout(() => {
          waxSeal.style.display = 'none';
          envelope.classList.add('open');
          state.letterOpened = true;
          setTimeout(() => startTypewriterLetter(), 800);
        }, 500);
      }
    });
  }

  envelope.addEventListener('click', (e) => {
    // Avoid double triggering if clicking inside scroll content
    if (e.target.closest('.letter-scrollable-content')) return;
    if (waxSeal && !waxSeal.classList.contains('seal-broken')) return; // Must break seal first

    if (!state.letterOpened) {
      envelope.classList.add('open');
      state.letterOpened = true;
      playSynthNote(440.00, 0.2);
      setTimeout(() => startTypewriterLetter(), 800);
    }
  });

  function initLoveLetter() {
    // Reset if loaded again
    if (!state.letterOpened) {
      typewriterTarget.innerHTML = '';
    }
  }

  function startTypewriterLetter() {
    let index = 0;
    typewriterTarget.innerHTML = '';

    function type() {
      if (index < loveLetterText.length) {
        const char = loveLetterText.charAt(index);

        if (char === '\n') {
          typewriterTarget.innerHTML += '<br>';
        } else {
          typewriterTarget.innerHTML += char;
        }

        index++;
        // Speed up scroll position as we type to keep it visible
        const paperContent = letterPaper.querySelector('.letter-scrollable-content');
        paperContent.scrollTop = paperContent.scrollHeight;

        // Soft micro chime every 8 characters for typewriter audio feedback
        if (index % 12 === 0) {
          playSynthNote(659.25, 0.05); // high E chime
        }

        setTimeout(type, 28);
      } else {
        // Typing finished
        completionPanel5.classList.remove('hidden');
        unlockChapter(6);
      }
    }

    type();
  }

  // --- CHAPTER 6: CAKE & GRAND FINALE LOGIC ---
  const cakeInteractive = document.getElementById('cake-interactive');
  const celebrationBoard = document.getElementById('celebration-board');
  const yesBtn = document.getElementById('love-yes-btn');
  const loveOverflow = document.getElementById('love-overflow-msg');
  const blowSubtext = document.querySelector('.blow-subtext');

  function initBirthdayFinale() {
    // Reset state each time we enter this chapter
    state.candlesBlown = false;
    if (cakeInteractive) cakeInteractive.classList.remove('extinguished');
    if (celebrationBoard) {
      celebrationBoard.classList.add('hidden');
    }
    if (blowSubtext) {
      blowSubtext.style.opacity = 1;
      blowSubtext.style.display = 'block';
    }

    // Optional: Web Microphone API to detect blowing (rustling sounds / volume spikes)
    try {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(stream);
          const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

          analyser.smoothingTimeConstant = 0.8;
          analyser.fftSize = 1024;

          microphone.connect(analyser);
          analyser.connect(javascriptNode);
          javascriptNode.connect(audioContext.destination);

          javascriptNode.onaudioprocess = () => {
            if (state.currentChapter !== 6 || state.candlesBlown) return;
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;

            const length = array.length;
            for (let i = 0; i < length; i++) {
              values += array[i];
            }

            const average = values / length;
            // Threshold of sound indicating blowing on mic
            if (average > 75) {
              blowOutCandles();
              // Stop mic capture after blowout
              stream.getTracks().forEach(track => track.stop());
              audioContext.close();
            }
          };
        })
        .catch(err => {
          console.log("Microphone access declined or unavailable. Blowing candles relies on button click.");
        });
    } catch (e) {
      console.log("Audio analyzer API error", e);
    }
  }

  function blowOutCandles() {
    if (state.candlesBlown) return;
    state.candlesBlown = true;

    // Extinguish candles in DOM
    if (cakeInteractive) cakeInteractive.classList.add('extinguished');

    // Hide blow text slowly
    if (blowSubtext) {
      blowSubtext.style.opacity = 0;
      setTimeout(() => { blowSubtext.style.display = 'none'; }, 500);
    }

    // Play high chime and trigger celebration
    playSynthNote(523.25, 0.2);
    setTimeout(() => playSynthNote(659.25, 0.2), 150);
    setTimeout(() => playSynthNote(783.99, 0.2), 300);
    setTimeout(() => playSynthNote(1046.50, 0.6), 450);

    // Burst confetti hearts
    for (let i = 0; i < 25; i++) {
      setTimeout(spawnHeart, i * 80);
    }

    // Trigger Canvas Fireworks
    if (window.celebrationFireworks) {
      window.celebrationFireworks.start();
    }

    // Fade in finale details
    setTimeout(() => {
      celebrationBoard.classList.remove('hidden');
    }, 1000);
  }

  // "I Love You" Heart Gauge mechanism
  const heartFillRect = document.getElementById('heart-fill-rect');
  yesBtn.addEventListener('click', () => {
    state.loveClickCount++;

    // Play high chimes
    playSynthNote(783.99 + (state.loveClickCount * 40), 0.2);

    // Burst hearts from button
    for (let i = 0; i < 5; i++) {
      spawnHeart();
    }

    // Animate heart gauge filling (max 5 clicks = 100%)
    const percent = Math.min(state.loveClickCount / 5, 1);
    if (heartFillRect) {
      const fillY = 90 - (90 * percent); // starts at y=90 (empty), goes to y=0 (full)
      heartFillRect.setAttribute('y', fillY.toFixed(1));
    }
    const lovePercentEl = document.getElementById('love-percent');
    if (lovePercentEl) lovePercentEl.textContent = Math.round(percent * 100);

    if (state.loveClickCount >= 5) {
      loveOverflow.classList.remove('hidden');
      yesBtn.innerText = "I Love You to Infinity! ❤️";
      // Extra fireworks
      for (let i = 0; i < 30; i++) setTimeout(spawnHeart, i * 60);
    }
  });

});

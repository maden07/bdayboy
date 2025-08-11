// Screen navigation
const screens = document.querySelectorAll('.screen');
const navBtns = document.querySelectorAll('[data-screen]');
function showScreen(id){
  screens.forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo({ top: 0, behavior:'smooth' });
}
navBtns.forEach(btn=>btn.addEventListener('click', ()=> showScreen(btn.dataset.screen)));

// ---------------- TRIVIA ----------------
const triviaQs = [
  {q:"What metal is Captain America's shield primarily made of?", a:["Vibranium","Adamantium","Titanium","Uru"], correct:0},
  {q:"Which Infinity Stone is housed in Loki's scepter?", a:["Reality","Mind","Power","Soul"], correct:1},
  {q:"Who is Peter Parker's best friend in the MCU?", a:["Harry Osborn","Ned Leeds","Flash Thompson","MJ"], correct:1},
  {q:"Wakanda's king is also known as…", a:["Rhino","Panther","Jaguar","Cheetah"], correct:1},
  {q:"Which Avenger can lift Thor's hammer in Endgame?", a:["Hulk","Captain Marvel","Captain America","Vision"], correct:2},
  {q:"What city hosts the final battle in the first Avengers film?", a:["Chicago","New York","San Francisco","London"], correct:1},
  {q:"Natasha Romanoff's codename is…", a:["Scarlet Witch","Black Widow","Wasp","Quake"], correct:1},
  {q:"What is the name of Star‑Lord's ship?", a:["Serenity","Rocinante","Milano","Raven"], correct:2},
  {q:"Which character says 'I am inevitable'?", a:["Thanos","Ultron","Red Skull","Loki"], correct:0},
  {q:"Tony Stark's AI assistant after JARVIS is called…", a:["KAREN","FRIDAY","HOMER","EDITH"], correct:1}
];
let qIndex = 0, score = 0, locked = false;
const qCount = document.getElementById('q-count');
const qScore = document.getElementById('q-score');
const qText = document.getElementById('q-text');
const choicesEl = document.getElementById('choices');
const nextBtn = document.getElementById('next-btn');
const restartTrivia = document.getElementById('restart-trivia');
const resultMsg = document.getElementById('result-msg');

function renderQuestion(){
  locked = false;
  const item = triviaQs[qIndex];
  qCount.textContent = `Question ${qIndex+1}/${triviaQs.length}`;
  qScore.textContent = `Score: ${score}`;
  qText.textContent = item.q;
  choicesEl.innerHTML = '';
  resultMsg.textContent = '';

  item.a.forEach((choice, i)=>{
    const b = document.createElement('button');
    b.className = 'choice-btn';
    b.textContent = choice;
    b.addEventListener('click', ()=> chooseAnswer(i, b));
    choicesEl.appendChild(b);
  });
  nextBtn.disabled = true;
}
function chooseAnswer(i, btn){
  if (locked) return;
  locked = true;
  const item = triviaQs[qIndex];
  const buttons = choicesEl.querySelectorAll('button');
  buttons.forEach((b,j)=>{
    if (j === item.correct) b.classList.add('correct');
    else if (b === btn) b.classList.add('wrong');
    b.disabled = true;
  });
  if (i === item.correct){
    score++;
    resultMsg.textContent = 'Correct! ⭐';
  } else {
    resultMsg.textContent = 'Close! Keep going 💪';
  }
  qScore.textContent = `Score: ${score}`;
  nextBtn.disabled = false;
}
nextBtn.addEventListener('click', ()=>{
  if (qIndex < triviaQs.length - 1){
    qIndex++;
    renderQuestion();
  } else {
    // end
    qText.textContent = `You scored ${score}/${triviaQs.length}!`;
    choicesEl.innerHTML = '';
    nextBtn.disabled = true;
    resultMsg.innerHTML = score >= 7
      ? 'Hero status unlocked! 💖 You are officially my favorite Avenger.'
      : 'Nice run! Next time, snacks are on me while we study the Marvel wiki together 😘';
    launchConfetti(180);
  }
});
restartTrivia.addEventListener('click', ()=>{
  qIndex = 0; score = 0; renderQuestion();
});
renderQuestion();

// ---------------- WHEEL ----------------
const rewards = [
  {label:"Cap's Day Off Mission", note:"I'll drive to one spot hehe"},
  {label:"Hulk Smash Hunger", note:"Free meal of your choice (within budget pls)"},
  {label:"Spider-Man Web of Comfort", note:"Unlimited hugs or kisses"},
  {label:"Stark Industries VIP Pass", note:"You pick what we do for a day (budget friendly again)"},
  {label:"Thor's Worthy Treatment", note:"Royal massage from yours truly hehe"},
  {label:"Thanos Infinity Power", note:"Make any wish (be kind!)"},
  {label:"Movie Night Takeover", note:"You pick the lineup"},
  {label:"Dessert Raid", note:"Late-night sweets run (i'm not driving)"}
];
const wheel = document.getElementById('wheel-board');
const spinBtn = document.getElementById('spin-btn');
const wheelReset = document.getElementById('wheel-reset');
const wheelResult = document.getElementById('wheel-result');

let currentRotation = 0;
function spinWheel(){
  const spin = 360 * 5 + Math.floor(Math.random()*360); // 5 turns + random
  currentRotation = (currentRotation + spin) % 360;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  // determine segment
  // 8 segments => 45deg each; needle at top pointing to 0deg
  const normalized = (360 - (currentRotation % 360)) % 360;
  const segment = Math.floor(normalized / 45) % rewards.length;
  setTimeout(()=>{
    const prize = rewards[segment];
    wheelResult.textContent = `You won: ${prize.label} — ${prize.note}!`;
    launchConfetti(240);
  }, 5200); // matches CSS transition (5s)
}
spinBtn.addEventListener('click', spinWheel);
wheelReset.addEventListener('click', ()=>{
  currentRotation = 0;
  wheel.style.transform = 'rotate(0deg)';
  wheelResult.textContent = '';
});

// ---------------- COUPONS ----------------
const couponGrid = document.getElementById('coupon-grid');
const couponTemplate = document.getElementById('coupon-template');
const shuffleBtn = document.getElementById('shuffle-coupons');
const addCouponBtn = document.getElementById('add-coupon');

let coupons = [
  {hero:'🇺🇸', title:"Cap's Day Off Mission", desc:"Redeem to skip all chores for one day.", code:"CAP-FREEDOM-DAY"},
  {hero:'💚', title:"Hulk Smash Hunger", desc:"One free meal of your choice.", code:"HULK-FEED-ME"},
  {hero:'🕷️', title:"Web of Comfort", desc:"Unlimited hugs + cuddle pass.", code:"SPIDEY-HUGS"},
  {hero:'🤖', title:"Stark Industry VIP Pass", desc:"You pick what we do for a day (budget friendly again.", code:"IRON-TECH-UP"},
  {hero:'⚡', title:"Worthy Treatment", desc:"A royal massage session.", code:"THOR-MASSAGE"},
  {hero:'💎', title:"Infinity Power", desc:"Make any wish come true.", code:"THANOS-WISH"},
  {hero:'🎬', title:"Movie Night Takeover", desc:"You pick the lineup.", code:"AVENGERS-CINEMA"},
  {hero:'🍰', title:"Dessert Raid", desc:"Late‑night sweets run.", code:"DESSERT-ASSEMBLE"}
];
function renderCoupons(){
  couponGrid.innerHTML = '';
  coupons.forEach(c=>{
    const node = couponTemplate.content.cloneNode(true);
    node.querySelector('.coupon-hero').textContent = c.hero;
    node.querySelector('.coupon-title').textContent = c.title;
    node.querySelector('.coupon-desc').textContent = c.desc;
    const btn = node.querySelector('.coupon-btn');
    btn.addEventListener('click', ()=> copyText(c.code, btn));
    couponGrid.appendChild(node);
  });
}
function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
}
function copyText(text, btn){
  navigator.clipboard.writeText(text).then(()=>{
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    setTimeout(()=> btn.textContent = original, 1200);
  });
}
shuffleBtn.addEventListener('click', ()=>{ shuffle(coupons); renderCoupons(); });
addCouponBtn.addEventListener('click', ()=>{
  const title = prompt('Coupon title (e.g., Cozy Day Pass)');
  if (!title) return;
  const desc = prompt('Short description');
  const code = prompt('Code to copy (letters/numbers)') || title.toUpperCase().replace(/\s+/g,'-');
  coupons.push({hero:'💖', title, desc: desc||'', code});
  renderCoupons();
});
renderCoupons();

// ---------------- Confetti ----------------
function launchConfetti(count=200){
  const container = document.getElementById('confetti-container');
  const colors = ['#ff2244','#ffd400','#2a66f6','#28d17c','#9b59b6','#ff7a00'];
  for (let i=0;i<count;i++){
    const conf = document.createElement('div');
    conf.className = 'confetti';
    const size = Math.random()*8 + 6;
    conf.style.width = size+'px';
    conf.style.height = size*0.6+'px';
    conf.style.background = colors[Math.floor(Math.random()*colors.length)];
    conf.style.left = Math.random()*100+'%';
    conf.style.top = '-10px';
    conf.style.opacity = (Math.random()*0.6 + 0.4).toFixed(2);
    conf.style.transform = `rotate(${Math.random()*360}deg)`;
    container.appendChild(conf);
    const duration = Math.random()*2 + 2.8;
    conf.animate([
      { transform: conf.style.transform + ' translateY(0)', offset:0 },
      { transform: `rotate(${Math.random()*360}deg) translateY(100vh)`, offset:1 }
    ], { duration: duration*1000, easing:'cubic-bezier(.2,.8,.2,1)' }).onfinish = ()=> conf.remove();
  }
}

// CTA buttons on home
document.querySelectorAll('.cta, .nav-btn').forEach(b=>{
  b.addEventListener('click', e=>{
    const id = b.getAttribute('data-screen');
    if (id) showScreen(id);
  })
});

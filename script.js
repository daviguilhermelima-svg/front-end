// Estado Global
let loopId = null;
let jogoPausado = false;
let jogoAtivo = false;

let faseAtual = 1;
let fase2Desbloqueada = false;

let birdX, birdY, gravity, velocity, jump, score, gameOver, jogoVencido, faseConcluida, pipes;
let estrelas = [];

const pipeWidth = 100;
const pipeGap = 220;

// === MÚSICAS DE FUNDO ===
const musicaInicio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a2b1f8.mp3?filename=relaxing-light-background-116686.mp3');
const musicaFase1 = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
const musicaFase2 = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=relaxing-mountains-rivers-10497.mp3');

// Configuração dos áudios em loop
musicaInicio.loop = true;
musicaFase1.loop = true;
musicaFase2.loop = true;

let volumeAtual = 0.3;
atualizarVolumeGeral(volumeAtual);

function atualizarVolumeGeral(val) {
  musicaInicio.volume = val;
  musicaFase1.volume = val;
  musicaFase2.volume = val;
}

// Altera o volume em todos os sliders e faixas de áudio
function alterarVolume(valor) {
  volumeAtual = parseFloat(valor);
  atualizarVolumeGeral(volumeAtual);

  const sliderMenu = document.getElementById('volumeSliderMenu');
  const sliderPause = document.getElementById('volumeSliderPause');

  if (sliderMenu) sliderMenu.value = volumeAtual;
  if (sliderPause) sliderPause.value = volumeAtual;
}

function pararMusicas() {
  musicaInicio.pause();
  musicaInicio.currentTime = 0;
  musicaFase1.pause();
  musicaFase1.currentTime = 0;
  musicaFase2.pause();
  musicaFase2.currentTime = 0;
}

function tocarMusica(tipo) {
  pararMusicas();
  if (tipo === 'menu') {
    musicaInicio.play().catch(() => {});
  } else if (tipo === 1) {
    musicaFase1.play().catch(() => {});
  } else if (tipo === 2) {
    musicaFase2.play().catch(() => {});
  }
}

// Configuração Inicial de Eventos
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('flappyCanvas');
  
  if (canvas) {
    redimensionarCanvas(canvas);
    window.addEventListener('resize', () => redimensionarCanvas(canvas));

    canvas.addEventListener('click', (e) => {
      if (!jogoAtivo) return;

      if (faseConcluida) {
        tratarCliqueConclusaoFase(e, canvas);
      } else {
        tratarPuloOuReiniciar();
      }
    });
  }
});

function redimensionarCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gerarEstrelas(canvas.width, canvas.height);
}

function gerarEstrelas(w, h) {
  estrelas = [];
  for (let i = 0; i < 60; i++) {
    estrelas.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2 + 1
    });
  }
}

// Navegação entre Menus
function abrirSelecaoFases() {
  document.getElementById('btnEnviar').style.display = 'none';
  document.getElementById('faseMenu').style.display = 'flex';
  tocarMusica('menu');
  atualizarBotoesFase();
}

function voltarParaMenuInicial() {
  pararMusicas();
  document.getElementById('faseMenu').style.display = 'none';
  document.getElementById('btnEnviar').style.display = 'block';
}

function atualizarBotoesFase() {
  const btnFase2 = document.getElementById('btnFase2');
  if (!btnFase2) return;

  if (fase2Desbloqueada) {
    btnFase2.disabled = false;
    btnFase2.classList.remove('btn-bloqueado');
    btnFase2.innerHTML = 'Fase 2';
  } else {
    btnFase2.disabled = true;
    btnFase2.classList.add('btn-bloqueado');
    btnFase2.innerHTML = 'Fase 2 🔒';
  }
}

// Inicialização da Fase
function iniciarJogo(fase) {
  if (fase === 2 && !fase2Desbloqueada) return;

  faseAtual = fase;
  document.getElementById('faseMenu').style.display = 'none';
  
  const gameContainer = document.getElementById('gameContainer');
  gameContainer.style.display = 'block';

  const canvas = document.getElementById('flappyCanvas');
  redimensionarCanvas(canvas);

  tocarMusica(faseAtual);
  reiniciarFaseAtual();
}

// Teclado (Espaço / ESC)
window.addEventListener('keydown', (e) => {
  if (!jogoAtivo) return;

  if (e.code === 'Escape') {
    if (!jogoPausado && !gameOver && !jogoVencido && !faseConcluida) {
      pausarJogo();
    } else if (jogoPausado) {
      continuarJogo();
    }
    return;
  }

  if (e.code === 'Space') {
    e.preventDefault();
    if (!jogoPausado && !faseConcluida) {
      tratarPuloOuReiniciar();
    }
  }
});

function tratarPuloOuReiniciar() {
  if (!jogoAtivo || jogoPausado) return;

  if (gameOver || jogoVencido) {
    reiniciarFaseAtual();
  } else {
    velocity = jump;
  }
}

function reiniciarFaseAtual() {
  const canvas = document.getElementById('flappyCanvas');
  
  jogoAtivo = true;
  jogoPausado = false;
  gameOver = false;
  jogoVencido = false;
  faseConcluida = false;
  
  document.getElementById('pauseMenu').style.display = 'none';

  tocarMusica(faseAtual);

  birdX = canvas.width * 0.2;
  birdY = canvas.height / 2;
  gravity = 0.25;
  velocity = 0;
  jump = -7;
  score = 0;
  pipes = [];

  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = null;
  }

  loop();
}

// Loop Principal
function loop() {
  if (!jogoAtivo || jogoPausado) return;

  const canvas = document.getElementById('flappyCanvas');
  const ctx = canvas.getContext('2d');

  velocity += gravity;
  birdY += velocity;

  // Fundo (Dia/Noite)
  if (faseAtual === 1) {
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    for (let est of estrelas) {
      ctx.beginPath();
      ctx.arc(est.x, est.y, est.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Criar Canos
  const distanciaCanos = Math.max(350, canvas.width * 0.25);
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - distanciaCanos) {
    const minTop = 80;
    const maxTop = canvas.height - pipeGap - 120;
    const pipeTopHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
    
    let dy = 0;
    if ((faseAtual === 1 && score >= 100 && Math.random() < 0.5) || (faseAtual === 2 && Math.random() < 0.6)) {
      dy = Math.random() < 0.5 ? 1 : -1;
    }

    pipes.push({
      x: canvas.width,
      top: pipeTopHeight,
      bottom: canvas.height - pipeTopHeight - pipeGap,
      dy: dy,
      passed: false
    });
  }

  // Desenhar Canos
  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 3;

    if (p.dy !== 0) {
      p.top += p.dy;
      p.bottom = canvas.height - p.top - pipeGap;

      if (p.top <= 50 || p.top >= canvas.height - pipeGap - 80) {
        p.dy *= -1;
      }
    }

    ctx.fillStyle = faseAtual === 1 ? '#22c55e' : '#15803d';
    ctx.fillRect(p.x, 0, pipeWidth, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom);

    if (
      birdX + 22 > p.x &&
      birdX - 22 < p.x + pipeWidth &&
      (birdY - 22 < p.top || birdY + 22 > canvas.height - p.bottom)
    ) {
      gameOver = true;
    }

    if (p.x + pipeWidth < birdX && !p.passed) {
      score += 10;
      p.passed = true;

      if (faseAtual === 1 && score >= 200) {
        faseConcluida = true;
        fase2Desbloqueada = true;
      } else if (faseAtual === 2 && score >= 300) {
        jogoVencido = true;
      }
    }
  }

  if (pipes.length > 0 && pipes[0].x < -pipeWidth) {
    pipes.shift();
  }

  if (birdY + 22 >= canvas.height || birdY - 22 <= 0) {
    gameOver = true;
  }

  // Passarinho
  ctx.save();
  ctx.translate(birdX, birdY);
  ctx.scale(-1, 1);

  let angulo = Math.min(Math.max(-velocity * 4, -70), 30) * (Math.PI / 180);
  ctx.rotate(angulo);

  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐤', 0, 0);
  ctx.restore();

  // HUD
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Fase ${faseAtual}`, 30, 50);
  ctx.fillText(`Pontos: ${score}`, 30, 90);

  // Telas Finais
  if (faseConcluida) {
    pararMusicas();
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 46px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Parabéns! Fase 1 Concluída!', canvas.width / 2, canvas.height / 2 - 80);

    desenharBotaoCanvas(ctx, 'Reiniciar Fase', canvas.width / 2 - 160, canvas.height / 2, 320, 50, '#ef4444');
    desenharBotaoCanvas(ctx, 'Próxima Fase', canvas.width / 2 - 160, canvas.height / 2 + 70, 320, 50, '#3b82f6');
  } 
  else if (jogoVencido) {
    pararMusicas();
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 VOCÊ ZEROU O JOGO! 🏆', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Clique para jogar novamente', canvas.width / 2, canvas.height / 2 + 40);
  } 
  else if (gameOver) {
    pararMusicas();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f87171';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Clique na tela para tentar de novo', canvas.width / 2, canvas.height / 2 + 30);
  } 
  else {
    loopId = requestAnimationFrame(loop);
  }
}

function desenharBotaoCanvas(ctx, texto, x, y, w, h, corHex) {
  ctx.fillStyle = corHex;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, 10);
  } else {
    ctx.rect(x, y, w, h);
  }
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(texto, x + w / 2, y + h / 2);
}

function tratarCliqueConclusaoFase(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const btnX = canvas.width / 2 - 160;
  const btnWidth = 320;
  const btnHeight = 50;

  if (clickX >= btnX && clickX <= btnX + btnWidth && clickY >= canvas.height / 2 && clickY <= canvas.height / 2 + btnHeight) {
    reiniciarFaseAtual();
  }

  if (clickX >= btnX && clickX <= btnX + btnWidth && clickY >= canvas.height / 2 + 70 && clickY <= canvas.height / 2 + 70 + btnHeight) {
    iniciarJogo(2);
  }
}

// Pausa
function pausarJogo() {
  if (jogoPausado) return;
  
  jogoPausado = true;
  document.getElementById('pauseMenu').style.display = 'flex';
  
  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = null;
  }
}

function continuarJogo() {
  if (!jogoPausado) return;
  
  jogoPausado = false;
  document.getElementById('pauseMenu').style.display = 'none';

  if (loopId) {
    cancelAnimationFrame(loopId);
  }
  loopId = requestAnimationFrame(loop);
}

function voltarParaInicio() {
  jogoAtivo = false;
  jogoPausado = false;
  
  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = null;
  }

  document.getElementById('pauseMenu').style.display = 'none';
  document.getElementById('gameContainer').style.display = 'none';
  
  document.getElementById('faseMenu').style.display = 'flex';
  tocarMusica('menu');
  atualizarBotoesFase();
}
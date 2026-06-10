const board = document.getElementById('board');
const hint = document.getElementById('hint');
let selectedColor = '#fef08a';
let zTop = 10;
let noteCount = 0;
let dragging = null, dragOffX = 0, dragOffY = 0;


document.querySelectorAll('.color-pick').forEach(dot => {
    dot.addEventListener('click', () => {
        document.querySelectorAll('.color-pick').forEach(d => d.classList.remove('selected'));
        dot.classList.add('selected');
        selectedColor = dot.dataset.color;
    });
});


board.addEventListener('click', e => {
    if (e.target !== board) return;
    const rect = board.getBoundingClientRect();
    const x = Math.min(e.clientX - rect.left - 95, rect.width - 200);
    const y = Math.min(e.clientY - rect.top - 15, rect.height - 150);
    createNote(Math.max(10, x), Math.max(14, y), selectedColor);
});


function createNote(x, y, color, title = '', body = '') {
    if(hint) hint.style.display = 'none';
    noteCount++;
    const note = document.createElement('div');
    note.className = 'note';
    note.style.left = x + 'px';
    note.style.top = y + 'px';
    note.style.background = color;
    note.style.zIndex = zTop++;
    const rot = (Math.random() * 6 - 3).toFixed(1);
    note.style.transform = `rotate(${rot}deg)`;

    note.innerHTML = `
        <div class="note-pin"></div>
        <div class="note-header">
            <input class="note-title" placeholder="Title…" value="${title}" />
            <button class="note-close" title="Delete note"><i class="ti ti-x" aria-hidden="true"></i></button>
        </div>
        <textarea class="note-body" placeholder="Write something…">${body}</textarea>
        <div class="note-footer">
            ${['#fef08a','#bbf7d0','#bfdbfe','#fecaca','#e9d5ff','#fed7aa'].map(c =>
            `<div class="color-dot${c===color?' active':''}" style="background:${c}" data-c="${c}"></div>`
            ).join('')}
        </div>
    `;

    note.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      note.style.background = dot.dataset.c;
      note.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
    });

    note.querySelector('.note-close').addEventListener('click', (e) => {
        e.stopPropagation();
        note.remove();
        if (!board.querySelectorAll('.note').length) hint.style.display = '';
    });

    note.addEventListener('mousedown', startDrag);
    note.addEventListener('touchstart', startDragTouch, {passive: false});

    board.appendChild(note);
    note.querySelector('.note-body').focus();
}

function startDrag(e) {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('color-dot') || e.target.classList.contains('note-close')) return;
  dragging = e.currentTarget;
  const rect = dragging.getBoundingClientRect();
  const bRect = board.getBoundingClientRect();
  dragOffX = e.clientX - rect.left;
  dragOffY = e.clientY - rect.top;
  dragging.style.zIndex = ++zTop;
  dragging.style.cursor = 'grabbing';
  e.preventDefault();
}

function startDragTouch(e) {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON' || e.target.classList.contains('color-dot')) return;
  const touch = e.touches[0];
  dragging = e.currentTarget;
  const rect = dragging.getBoundingClientRect();
  dragOffX = touch.clientX - rect.left;
  dragOffY = touch.clientY - rect.top;
  dragging.style.zIndex = ++zTop;
  e.preventDefault();
}

document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const bRect = board.getBoundingClientRect();
  let nx = e.clientX - bRect.left - dragOffX;
  let ny = e.clientY - bRect.top - dragOffY;
  nx = Math.max(0, Math.min(nx, bRect.width - 195));
  ny = Math.max(0, Math.min(ny, bRect.height - 135));
  dragging.style.left = nx + 'px';
  dragging.style.top = ny + 'px';
});

document.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  const touch = e.touches[0];
  const bRect = board.getBoundingClientRect();
  let nx = touch.clientX - bRect.left - dragOffX;
  let ny = touch.clientY - bRect.top - dragOffY;
  nx = Math.max(0, Math.min(nx, bRect.width - 195));
  ny = Math.max(0, Math.min(ny, bRect.height - 135));
  dragging.style.left = nx + 'px';
  dragging.style.top = ny + 'px';
  e.preventDefault();
}, {passive: false});

document.addEventListener('mouseup', () => { if (dragging) { dragging.style.cursor = 'grab'; dragging = null; } });
document.addEventListener('touchend', () => { dragging = null; });

document.getElementById('clear-btn').addEventListener('click', () => {
  board.querySelectorAll('.note').forEach(n => n.remove());
  hint.style.display = '';
});

createNote(30, 30, '#fef08a', 'Welcome!', 'Click the board to add notes. Drag me around!');
createNote(250, 80, '#bbf7d0', 'Tip', 'Change note color using the dots at the bottom.');

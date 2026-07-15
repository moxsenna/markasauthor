/** DOM helpers for Telegram mock — no business persistence here. */

export type KeyboardButton = {
  label: string;
  value: string;
  style?: 'primary' | 'danger' | 'default';
};

export type SimContext = {
  phase: 'idle' | 'flow';
  flow: string | null;
  step: number;
  draft: Record<string, string>;
};

export function createContext(): SimContext {
  return { phase: 'idle', flow: null, step: 0, draft: {} };
}

export function clearActiveControls(root: HTMLElement) {
  root.querySelectorAll('.tg-active-controls').forEach((el) => el.remove());
}

export function setStepHint(el: HTMLElement | null, text: string) {
  if (el) el.textContent = text;
}

export function scrollChat(chat: HTMLElement) {
  chat.scrollTop = chat.scrollHeight;
}

export function appendBotBubble(chat: HTMLElement, html: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-msg tg-msg-bot';
  wrap.style.cssText = 'align-self:flex-start;max-width:85%';
  const bubble = document.createElement('div');
  bubble.style.cssText =
    'background:#1C2E32;color:#DDE4E6;border-radius:16px 16px 16px 4px;padding:12px 16px;font-family:Lora,Georgia,serif;font-size:14px;line-height:1.7';
  bubble.innerHTML = html;
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function appendUserBubble(chat: HTMLElement, text: string): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-msg tg-msg-user';
  wrap.style.cssText = 'align-self:flex-end;max-width:80%';
  const bubble = document.createElement('div');
  bubble.style.cssText =
    'background:#7A3341;color:#FBF6EF;border-radius:16px 16px 4px 16px;padding:10px 16px;font-family:Lora,Georgia,serif;font-size:14px;line-height:1.5';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function showTyping(chat: HTMLElement): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-active-controls tg-typing';
  wrap.style.cssText =
    'align-self:flex-start;color:#8AA0A4;font-size:12px;font-family:Lora,Georgia,serif;padding:4px 8px';
  wrap.textContent = 'mengetik…';
  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export async function botReply(
  chat: HTMLElement,
  html: string,
  delayMs = 500,
): Promise<HTMLElement> {
  const t = showTyping(chat);
  await sleep(delayMs);
  t.remove();
  return appendBotBubble(chat, html);
}

export function appendKeyboard(
  chat: HTMLElement,
  buttons: KeyboardButton[],
  onPick: (value: string, label: string) => void,
  cols = 2,
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-active-controls tg-keyboard';
  wrap.style.cssText = `display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding-left:6px;max-width:92%;align-self:flex-start`;

  buttons.forEach((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = b.label;
    const isDanger = b.style === 'danger';
    const isPrimary = b.style === 'primary';
    btn.style.cssText = isPrimary
      ? 'background:#7A3341;border:none;border-radius:12px;padding:10px 12px;color:#FBF6EF;font-family:Lora,Georgia,serif;font-size:13px;font-weight:600;cursor:pointer;text-align:center'
      : isDanger
        ? 'background:transparent;border:1px solid rgba(217,122,122,.35);border-radius:12px;padding:10px 12px;color:#D97A7A;font-family:Lora,Georgia,serif;font-size:13px;cursor:pointer;text-align:center'
        : 'background:rgba(122,51,65,.18);border:1px solid rgba(122,51,65,.3);border-radius:12px;padding:10px 12px;color:#E8C4C8;font-family:Lora,Georgia,serif;font-size:13px;cursor:pointer;text-align:left';
    btn.addEventListener('click', () => onPick(b.value, b.label));
    wrap.appendChild(btn);
  });

  chat.appendChild(wrap);
  scrollChat(chat);
  return wrap;
}

export function appendTextControls(
  chat: HTMLElement,
  opts: {
    placeholder: string;
    allowSkip?: boolean;
    sample?: string;
    onSubmit: (value: string) => void;
    onSkip?: () => void;
  },
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'tg-active-controls tg-text-controls';
  wrap.style.cssText =
    'display:flex;flex-direction:column;gap:8px;align-self:stretch;padding-left:6px';

  if (opts.sample) {
    const sampleBtn = document.createElement('button');
    sampleBtn.type = 'button';
    sampleBtn.textContent = `Isi contoh: ${opts.sample}`;
    sampleBtn.style.cssText =
      'align-self:flex-start;background:transparent;border:1px dashed rgba(232,196,200,.45);border-radius:10px;padding:8px 12px;color:#E8C4C8;font-family:Lora,Georgia,serif;font-size:12px;cursor:pointer;text-align:left;max-width:100%';
    sampleBtn.addEventListener('click', () => {
      input.value = opts.sample || '';
      input.focus();
    });
    wrap.appendChild(sampleBtn);
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = opts.placeholder;
  input.style.cssText =
    'width:100%;height:44px;padding:0 14px;border-radius:22px;border:1px solid rgba(255,255,255,.12);background:#1C2E32;color:#FBF6EF;font-family:Lora,Georgia,serif;font-size:14px;box-sizing:border-box;outline:none';

  const btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';

  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.textContent = 'Kirim';
  submitBtn.style.cssText =
    'height:36px;padding:0 18px;background:#7A3341;color:#FBF6EF;border:none;border-radius:18px;font-family:Lora,Georgia,serif;font-size:13px;font-weight:600;cursor:pointer';

  const doSubmit = () => {
    const val = input.value.trim();
    if (!val) {
      input.style.borderColor = 'rgba(217,122,122,.6)';
      return;
    }
    wrap.remove();
    opts.onSubmit(val);
  };

  submitBtn.addEventListener('click', doSubmit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSubmit();
  });
  btnRow.appendChild(submitBtn);

  if (opts.allowSkip && opts.onSkip) {
    const skipBtn = document.createElement('button');
    skipBtn.type = 'button';
    skipBtn.textContent = 'Lewati';
    skipBtn.style.cssText =
      'height:36px;padding:0 18px;background:transparent;color:#8AA0A4;border:1px solid rgba(255,255,255,.1);border-radius:18px;font-family:Lora,Georgia,serif;font-size:13px;cursor:pointer';
    skipBtn.addEventListener('click', () => {
      wrap.remove();
      opts.onSkip?.();
    });
    btnRow.appendChild(skipBtn);
  }

  wrap.appendChild(input);
  wrap.appendChild(btnRow);
  chat.appendChild(wrap);
  setTimeout(() => input.focus(), 80);
  scrollChat(chat);
  return wrap;
}

export function parseCommand(raw: string): string | null {
  const t = raw.trim().toLowerCase();
  if (!t.startsWith('/')) return null;
  return t.split(/\s+/)[0];
}

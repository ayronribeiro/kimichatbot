(function () {
  if (window.KimiChatWidgetLoaded) return;
  window.KimiChatWidgetLoaded = true;

  // Estilos do widget
  const style = document.createElement('style');
  style.innerHTML = `
    .kimi-chat-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      background: #111827;
      color: #fff;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      border: none;
    }
    .kimi-chat-window {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 350px;
      max-width: 95vw;
      height: 500px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.18);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: sans-serif;
      border: 1px solid #e5e7eb;
    }
    .kimi-chat-header {
      background: #111827;
      color: #fff;
      padding: 16px;
      font-weight: bold;
      font-size: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .kimi-chat-body {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f9fafb;
    }
    .kimi-chat-footer {
      padding: 12px 16px;
      background: #f3f4f6;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .kimi-chat-input {
      flex: 1;
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      font-size: 15px;
    }
    .kimi-chat-send-btn {
      background: #111827;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 15px;
    }
    .kimi-chat-shortcuts {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }
    .kimi-chat-shortcut-btn {
      background: #e5e7eb;
      color: #111827;
      border: none;
      border-radius: 8px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
    }
    .kimi-chat-msg-user {
      text-align: right;
      margin-bottom: 8px;
      color: #2563eb;
    }
    .kimi-chat-msg-bot {
      text-align: left;
      margin-bottom: 8px;
      color: #111827;
    }
  `;
  document.head.appendChild(style);

  // Botão flutuante
  const btn = document.createElement('button');
  btn.className = 'kimi-chat-btn';
  btn.innerHTML = '💬';
  document.body.appendChild(btn);

  // Janela do chat
  const chat = document.createElement('div');
  chat.className = 'kimi-chat-window';
  chat.style.display = 'none';
  chat.innerHTML = `
    <div class="kimi-chat-header">
      Kimi Coach IA
      <span style="cursor:pointer;font-size:20px;" id="kimi-close">×</span>
    </div>
    <div class="kimi-chat-body" id="kimi-body"></div>
    <div class="kimi-chat-footer">
      <input class="kimi-chat-input" id="kimi-input" placeholder="Digite sua dúvida..." />
      <button class="kimi-chat-send-btn" id="kimi-send">Enviar</button>
    </div>
  `;
  document.body.appendChild(chat);

  // Shortcuts
  const shortcuts = [
    'How to get clients for Mentoring?',
    'How to create a sales funnel?',
    'Give me ideas for Reels scripts',
    'Help me create content for Instagram',
  ];
  const shortcutsDiv = document.createElement('div');
  shortcutsDiv.className = 'kimi-chat-shortcuts';
  shortcuts.forEach((s) => {
    const b = document.createElement('button');
    b.className = 'kimi-chat-shortcut-btn';
    b.innerText = s;
    b.onclick = () => sendMessage(s);
    shortcutsDiv.appendChild(b);
  });
  chat.querySelector('.kimi-chat-body').prepend(shortcutsDiv);

  // Eventos
  btn.onclick = () => {
    chat.style.display = 'flex';
    btn.style.display = 'none';
  };
  chat.querySelector('#kimi-close').onclick = () => {
    chat.style.display = 'none';
    btn.style.display = 'flex';
  };
  chat.querySelector('#kimi-send').onclick = () => {
    const input = chat.querySelector('#kimi-input');
    if (input.value.trim()) {
      sendMessage(input.value.trim());
      input.value = '';
    }
  };
  chat.querySelector('#kimi-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      chat.querySelector('#kimi-send').click();
    }
  });

  // Função para enviar mensagem
  async function sendMessage(msg) {
    const body = chat.querySelector('#kimi-body');
    const userMsg = document.createElement('div');
    userMsg.className = 'kimi-chat-msg-user';
    userMsg.innerText = msg;
    body.appendChild(userMsg);
    body.scrollTop = body.scrollHeight;

    const botMsg = document.createElement('div');
    botMsg.className = 'kimi-chat-msg-bot';
    botMsg.innerText = 'Pensando...';
    body.appendChild(botMsg);
    body.scrollTop = body.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      botMsg.innerText = data.choices?.[0]?.message?.content || 'Desculpe, não consegui responder.';
    } catch (e) {
      botMsg.innerText = 'Erro ao conectar com a IA.';
    }
    body.scrollTop = body.scrollHeight;
  }
})(); 
const noteEditor = document.getElementById('noteEditor');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatWindow = document.getElementById('chatWindow');
const generateNotesButton = document.getElementById('generateNotes');
const summarizeNotesButton = document.getElementById('summarizeNotes');
const clearWorkspaceButton = document.getElementById('clearWorkspace');
const splitter = document.getElementById('splitter');
const leftPanel = document.querySelector('.editor-panel');

const aiResponses = [
  'I can help turn your notes into a concise summary or explain any concept in a simple way.',
  'Try asking me to generate practice questions, explain a formula, or turn your chapter into a study guide.',
  'If you paste a lesson here, I can pull out the key ideas and highlight what matters most for exams.',
];

function addChatMessage(role, text) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  const speaker = document.createElement('span');
  speaker.className = 'speaker';
  speaker.textContent = role === 'user' ? 'You' : 'Assistant';
  const message = document.createElement('p');
  message.textContent = text;
  bubble.appendChild(speaker);
  bubble.appendChild(message);
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function getSelectedText() {
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : '';
}

function getEditorText() {
  return noteEditor.innerText.trim();
}

function createAssistantReply(prompt) {
  const content = getEditorText();
  const selected = getSelectedText();

  if (!prompt && !content) {
    return 'Start by typing some notes or asking a question. I will help you create quick study material instantly.';
  }

  if (prompt.toLowerCase().includes('summarize')) {
    if (!content) {
      return 'Paste or type your study notes first, then click Summarize to see a short review of the material.';
    }
    return `Summary: ${content.slice(0, 280)}${content.length > 280 ? '…' : ''}`;
  }

  if (prompt.toLowerCase().includes('generate')) {
    return 'Generated Notes: Use headings, bullets, and key definitions from your study material to build a fast review sheet.';
  }

  if (prompt.toLowerCase().includes('explain')) {
    return selected
      ? `Explanation: ${selected} means ... (use the note context to explain this concept clearly in simple terms).`
      : 'Highlight a phrase in your study notes or type the concept you want explained, and I will break it down for you.';
  }

  return aiResponses[Math.floor(Math.random() * aiResponses.length)];
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const prompt = chatInput.value.trim();
  if (!prompt) return;

  addChatMessage('user', prompt);
  chatInput.value = '';

  setTimeout(() => {
    addChatMessage('assistant', createAssistantReply(prompt));
  }, 300);
});

generateNotesButton.addEventListener('click', () => {
  const content = getEditorText();
  if (!content) {
    addChatMessage('assistant', 'Paste your chapter or type your notes first. Then I can generate a study-friendly version for you.');
    return;
  }

  addChatMessage('assistant', 'Generated Notes: Use this as a study outline and expand it with your own examples.');
  addChatMessage('assistant', `• ${content.slice(0, 120)}${content.length > 120 ? '…' : ''}`);
});

summarizeNotesButton.addEventListener('click', () => {
  const content = getEditorText();
  if (!content) {
    addChatMessage('assistant', 'No notes found. Add some text on the left side and try again.');
    return;
  }

  addChatMessage('assistant', `Quick Summary: ${content.slice(0, 220)}${content.length > 220 ? '…' : ''}`);
});

clearWorkspaceButton.addEventListener('click', () => {
  noteEditor.innerHTML = '';
  chatWindow.innerHTML = '';
  addChatMessage('assistant', 'Workspace reset. Start a new study session anytime.');
});

function initSplitter() {
  let isResizing = false;
  let startX = 0;
  let startWidth = leftPanel.getBoundingClientRect().width;

  splitter.addEventListener('mousedown', (event) => {
    isResizing = true;
    startX = event.clientX;
    startWidth = leftPanel.getBoundingClientRect().width;
    document.body.style.cursor = 'col-resize';
  });

  window.addEventListener('mousemove', (event) => {
    if (!isResizing) return;
    const delta = event.clientX - startX;
    const newWidth = Math.max(280, Math.min(startWidth + delta, window.innerWidth - 360));
    leftPanel.style.width = `${newWidth}px`;
  });

  window.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = '';
  });
}

initSplitter();

noteEditor.dataset.placeholder = 'Start typing your study notes here. Use headings, highlight key ideas, and paste chapters for fast review.';

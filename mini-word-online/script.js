let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    editor.addEventListener('input', () => {
        const text = editor.innerText || editor.textContent;
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const words = cleanText === "" ? 0 : cleanText.split(' ').length;
        wordCountDisplay.innerText = words;
    });
};

function formatDoc(cmd, value = null) {
    if (!cmd) return;
    document.execCommand(cmd, false, value);
    editor.focus();
}

/**
 * Custom function for Exact Font Size
 * This bypasses the 1-7 limitation of execCommand
 */
function changeFontSize(size) {
    // Get what the user highlighted
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = size + 'px';
        
        // Wrap the selected text in the span
        range.surroundContents(span);
    }
    editor.focus();
}

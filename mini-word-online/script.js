// We declare these at the top level so they can be used anywhere
let editor;
let wordCountDisplay;

window.onload = () => {
    // Initialize our elements once the page loads
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Word Count Logic
    editor.addEventListener('input', () => {
        const text = editor.innerText.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCountDisplay.innerText = words;
    });

    // Tab key support
    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
        }
    });
};

/**
 * formatting function
 * Note: Highlighting text before clicking is usually required!
 */
function formatDoc(cmd, value = null) {
    if (!cmd) return;
    document.execCommand(cmd, false, value);
    editor.focus();
}

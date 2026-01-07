// Global variables
let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Word Count Logic
    editor.addEventListener('input', () => {
        const text = editor.innerText.trim();
        const words = text ? text.split(/\s+/).length : 0;
        wordCountDisplay.innerText = words;
    });
};

// Basic formatting (Bold, Italic, Colors)
function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
}

// Exact Pixel Size Logic
function changeFontSize(size) {
    if (!size) return;
    
    // Step 1: Tell the browser to use CSS styles instead of old HTML tags
    document.execCommand("styleWithCSS", false, true);
    
    // Step 2: Use the standard command
    document.execCommand("fontSize", false, "7"); 
    
    // Step 3: Find the elements the browser just changed and fix the PX size
    const elements = editor.querySelectorAll("span, font");
    elements.forEach(el => {
        if (el.style.fontSize === "xxx-large" || el.getAttribute("size") === "7") {
            el.removeAttribute("size");
            el.style.fontSize = size + "px";
        }
    });
}

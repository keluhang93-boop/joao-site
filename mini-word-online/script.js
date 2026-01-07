let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    editor.addEventListener('input', () => {
        const text = editor.innerText || "";
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountDisplay.innerText = words;
    });
};

function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
}

function changeFontSize(size) {
    if (!size) return;

    // 1. Tell the browser we want to use CSS styles, not HTML tags
    document.execCommand("styleWithCSS", false, true);
    
    // 2. Apply a temporary size that we can easily find
    document.execCommand("fontSize", false, "7");

    // 3. Find all elements that just got that size and swap it for our 'PX' value
    const fontElements = editor.querySelectorAll("span, font");
    
    fontElements.forEach(el => {
        // Look for the browser's default 'large' size markers
        if (el.style.fontSize === "xxx-large" || el.getAttribute("size") === "7") {
            el.removeAttribute("size");
            el.style.fontSize = size + "px";
        }
    });

    editor.focus();
}

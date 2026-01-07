let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    editor.addEventListener('input', () => {
        const text = editor.innerText || "";
        const count = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountDisplay.innerText = count;
    });
};

function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
}

function changeFontSize(size) {
    if (!size) return;
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("fontSize", false, "7");

    const fontTags = editor.querySelectorAll("font, span");
    fontTags.forEach(tag => {
        if (tag.getAttribute("size") === "7" || tag.style.fontSize === "xxx-large") {
            tag.removeAttribute("size");
            tag.style.fontSize = size + "px";
        }
    });
    editor.focus();
}

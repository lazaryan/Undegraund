const load = () => {
        let addStylesNode = document.getElementById("deferred-styles");
        let replacement = document.createElement("div");
        replacement.innerHTML = addStylesNode.textContent;
        document.body.appendChild(replacement);
        addStylesNode.parentElement.removeChild(addStylesNode);
}
const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
if (raf) raf(() => { 
        window.setTimeout(load, 0);
});
else window.addEventListener('load', load);
/* maven-skin — diagrams.js
 * Renders ```mermaid```, ```plantuml```, ```dot``` fenced code blocks as diagrams.
 * Mermaid runs locally; PlantUML/Graphviz go to Kroki via deflate+base64url (Pako).
 * Click a rendered diagram to zoom.
 *
 * Globals it expects (loaded ahead of this script): window.mermaid, window.pako.
 */
(function () {
    function createDiagramElement(className) {
        const element = document.createElement('div');
        element.className = className;
        return element;
    }

    function wrapCodeInDiagramContainer(code, krokiMap, lang) {
        const pre = code.parentElement;
        if (!pre || pre.closest('.diagram')) return null;

        const wrapper = createDiagramElement('diagram');
        wrapper.dataset.diagramType = krokiMap[lang];

        const grid = createDiagramElement('diagram-grid');

        const srcCol = createDiagramElement('diagram-source');
        srcCol.appendChild(pre.cloneNode(true));

        const rendCol = createDiagramElement('diagram-render');

        grid.appendChild(srcCol);
        grid.appendChild(rendCol);
        wrapper.appendChild(grid);

        pre.replaceWith(wrapper);
        return wrapper;
    }

    function base64UrlEncode(bytes) {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary)
            .replaceAll('+', '-')
            .replaceAll('/', '_')
            .replace(/=+$/, '');
    }

    function renderKroki(container) {
        if (!container) return;
        const type = container.dataset.diagramType;
        const codeEl = container.querySelector('.diagram-source code');
        if (!type || !codeEl) return;
        const source = codeEl.textContent;
        let target;
        try {
            const deflated = window.pako ? window.pako.deflate(source, {level: 9}) : null;
            if (!deflated) return;
            const encoded = base64UrlEncode(deflated);
            const img = document.createElement('img');
            img.loading = 'lazy';
            img.alt = (container.getAttribute('aria-label') || 'Diagram') + ' (rendered)';
            img.src = 'https://kroki.io/' + type + '/svg/' + encoded;
            target = container.querySelector('.diagram-render');
            if (target) {
                target.innerHTML = '';
                target.appendChild(img);
            }
        } catch (e) {
            target = container.querySelector('.diagram-render');
            if (target) {
                const pre = document.createElement('pre');
                pre.textContent = 'Failed to render diagram via Kroki: ' + (e && e.message ? e.message : e);
                target.innerHTML = '';
                target.appendChild(pre);
            }
        }
    }

    function renderMermaid(container) {
        const codeEl = container.querySelector('.diagram-source code');
        if (!codeEl || !window.mermaid) return;
        const slot = document.createElement('div');
        slot.className = 'mermaid';
        slot.textContent = codeEl.textContent;
        const target = container.querySelector('.diagram-render');
        if (target) {
            target.innerHTML = '';
            target.appendChild(slot);
            window.mermaid.run({querySelector: '.diagram-render .mermaid'});
        }
    }

    function createZoomOverlay(contentEl) {
        const overlay = document.createElement('div');
        overlay.className = 'diagram-zoom-overlay';
        const inner = document.createElement('div');
        inner.className = 'diagram-zoom-overlay__inner';
        const clone = contentEl.cloneNode(true);
        if (clone.removeAttribute) clone.removeAttribute('tabindex');
        inner.appendChild(clone);
        overlay.appendChild(inner);
        overlay.addEventListener('click', function () {
            overlay.remove();
        });
        return overlay;
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (window.mermaid) {
            window.mermaid.initialize({startOnLoad: false, theme: 'default'});
        }

        document.querySelectorAll('.diagram[data-diagram-type]').forEach(function (container) {
            const type = container.dataset.diagramType;
            if (type === 'mermaid') {
                renderMermaid(container);
            } else {
                renderKroki(container);
            }
        });

        document.querySelectorAll('pre > code.language-mermaid').forEach(function (code) {
            const pre = code.parentElement;
            if (pre.closest('.diagram')) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'diagram';
            wrapper.dataset.diagramType = 'mermaid';

            const grid = document.createElement('div');
            grid.className = 'diagram-grid';
            const srcCol = document.createElement('div');
            srcCol.className = 'diagram-source';
            srcCol.appendChild(pre.cloneNode(true));
            const rendCol = document.createElement('div');
            rendCol.className = 'diagram-render';

            grid.appendChild(srcCol);
            grid.appendChild(rendCol);
            wrapper.appendChild(grid);
            pre.replaceWith(wrapper);
            renderMermaid(wrapper);
        });

        const krokiMap = {plantuml: 'plantuml', dot: 'graphviz'};
        Object.keys(krokiMap).forEach(function (lang) {
            document.querySelectorAll('.language-' + lang + ' div > pre > code').forEach(function (code) {
                renderKroki(wrapCodeInDiagramContainer(code, krokiMap, lang));
            });
            document.querySelectorAll('pre > code.language-' + lang).forEach(function (code) {
                renderKroki(wrapCodeInDiagramContainer(code, krokiMap, lang));
            });
        });

        document.body.addEventListener('click', function (e) {
            const target = e.target;
            if (!target) return;
            const isZoomable = (target.tagName === 'IMG' || target.tagName === 'SVG') && target.closest('.diagram-render');
            if (!isZoomable) return;
            document.body.appendChild(createZoomOverlay(target));
        });
    });
})();

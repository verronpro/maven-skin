/**
 * Table of Contents Generator for Maven Skin Documentation
 * Automatically generates and injects a TOC from document headings
 */

(function() {
  'use strict';

  const TOCGenerator = {
    // Configuration
    config: {
      headingSelector: 'article h2, article h3, article h4, article h5, article h6',
      containerSelector: '.toc-container',
      minHeadings: 3,
      smoothScroll: true,
      highlightActiveSection: true,
      maxHeadingLevel: 6
    },

    /**
     * Initialize the TOC generator
     */
    init: function(options) {
      this.config = Object.assign(this.config, options || {});

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.generate());
      } else {
        this.generate();
      }
    },

    /**
     * Generate table of contents
     */
    generate: function() {
      const headings = this.extractHeadings();

      if (headings.length < this.config.minHeadings) {
        return;
      }

      const tocList = this.buildTOCList(headings);
      this.injectTOC(tocList);
      this.attachEventListeners();
    },

    /**
     * Extract headings from the document
     */
    extractHeadings: function() {
      const headings = [];
      const elements = document.querySelectorAll(this.config.headingSelector);

      elements.forEach((element, index) => {
        // Skip if heading has no text content
        if (!element.textContent.trim()) {
          return;
        }

        // Assign ID if not present
        if (!element.id) {
          element.id = `heading-${index}`;
        }

        const level = parseInt(element.tagName[1]);
        headings.push({
          id: element.id,
          text: element.textContent.trim(),
          level: level,
          element: element
        });
      });

      return headings;
    },

    /**
     * Build nested TOC list structure
     */
    buildTOCList: function(headings) {
      if (headings.length === 0) {
        return null;
      }

      const ul = document.createElement('ul');
      ul.className = 'toc-list';
      let currentLevel = headings[0].level;
      let currentList = ul;
      const stack = [{ level: currentLevel, list: ul }];

      headings.forEach((heading) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${heading.id}`;
        a.textContent = heading.text;
        a.className = 'toc-link';
        a.dataset.headingId = heading.id;
        li.appendChild(a);

        if (heading.level > currentLevel) {
          // Going deeper - create nested lists
          for (let i = currentLevel; i < heading.level; i++) {
            const newUl = document.createElement('ul');
            const newLi = document.createElement('li');
            newLi.appendChild(newUl);

            if (stack[stack.length - 1].list.lastChild) {
              stack[stack.length - 1].list.lastChild.appendChild(newUl);
            } else {
              stack[stack.length - 1].list.appendChild(newLi);
            }

            stack.push({ level: i + 1, list: newUl });
          }
          currentList = stack[stack.length - 1].list;
        } else if (heading.level < currentLevel) {
          // Going up - pop stack
          while (stack.length > 1 && stack[stack.length - 1].level > heading.level) {
            stack.pop();
          }
          currentList = stack[stack.length - 1].list;
        }

        currentList.appendChild(li);
        currentLevel = heading.level;
      });

      return ul;
    },

    /**
     * Inject TOC into the page
     */
    injectTOC: function(tocList) {
      const container = document.querySelector(this.config.containerSelector);

      if (!container) {
        // If no container specified, create one at the beginning of main content
        const mainContent = document.querySelector('main') ||
                          document.querySelector('article') ||
                          document.querySelector('.content');

        if (!mainContent) {
          return;
        }

        const tocContainer = document.createElement('div');
        tocContainer.className = 'toc-container';
        tocContainer.innerHTML = '<h3 class="toc-title">Table of Contents</h3>';
        tocContainer.appendChild(tocList);
        mainContent.insertBefore(tocContainer, mainContent.firstChild);
      } else {
        // Clear existing content and inject TOC
        container.innerHTML = '<h3 class="toc-title">Table of Contents</h3>';
        container.appendChild(tocList);
      }
    },

    /**
     * Attach event listeners for smooth scrolling and highlighting
     */
    attachEventListeners: function() {
      const links = document.querySelectorAll('.toc-link');

      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          if (this.config.smoothScroll) {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.history.pushState(null, '', link.getAttribute('href'));
            }
          }
        });
      });

      // Highlight active section on scroll
      if (this.config.highlightActiveSection) {
        this.attachScrollListener();
      }
    },

    /**
     * Attach scroll listener for highlighting active section
     */
    attachScrollListener: function() {
      window.addEventListener('scroll', () => {
        this.updateActiveLink();
      }, { passive: true });

      // Initial update
      this.updateActiveLink();
    },

    /**
     * Update active link based on scroll position
     */
    updateActiveLink: function() {
      const links = document.querySelectorAll('.toc-link');
      let activeLink = null;

      links.forEach((link) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          const rect = target.getBoundingClientRect();
          // Check if heading is in view (within 30% from top)
          if (rect.top <= window.innerHeight * 0.3 && rect.top >= -rect.height) {
            activeLink = link;
          }
        }
      });

      // Remove previous active class
      links.forEach((link) => link.classList.remove('active'));

      // Add active class to current link
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  };

  // Export to global scope
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TOCGenerator;
  } else {
    window.TOCGenerator = TOCGenerator;
  }
})();

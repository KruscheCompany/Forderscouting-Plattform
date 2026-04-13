import DOMPurify from 'dompurify';

/**
 * HTML Sanitizer Mixin
 * Provides methods to safely sanitize HTML content before rendering
 * to prevent XSS attacks and other security vulnerabilities.
 */
export default {
  methods: {
    /**
     * Decode HTML entities and fix list formatting
     * @param {string} text - The text to decode
     * @returns {string} - Decoded and formatted HTML
     */
    decodeAndFixHtml(text) {
      if (!text) return text;

      // Decode HTML entities
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      let decoded = textarea.value;

      // Fix orphaned <li> tags by removing wrapping divs and ensuring proper <ul> wrapping
      // Remove <div> wrappers around list items
      decoded = decoded.replace(/<div>(<li>.*?<\/li>)<\/div>/gi, '$1');
      decoded = decoded.replace(/<div><br><\/div>/gi, '');

      // Wrap all consecutive <li> tags in a <ul> if not already wrapped
      if (decoded.includes('<li>') && !decoded.includes('<ul>') && !decoded.includes('<ol>')) {
        decoded = decoded.replace(/(<li>[\s\S]*<\/li>)/gi, '<ul>$1</ul>');
      }

      return decoded;
    },

    /**
     * Sanitize HTML content with default configuration
     * Allows most formatting tags but removes dangerous elements and attributes
     *
     * @param {string} html - The HTML string to sanitize
     * @returns {string} - Sanitized HTML safe for rendering
     */
    sanitizeHtml(html) {
      if (!html) return '';

      // Remove newline characters
      html = html.replace(/\n/g, '');

      // Replace all heading elements (h1-h6) with p elements
      html = html.replace(/<h[1-6]([^>]*)>/gi, '<p$1>').replace(/<\/h[1-6]>/gi, '</p>');

      // Decode and fix HTML first
      const fixedHtml = this.decodeAndFixHtml(html);

      return DOMPurify.sanitize(fixedHtml, {
        ALLOWED_TAGS: [
          // Text formatting
          'p', 'br', 'span', 'div', 'strong', 'em', 'b', 'i', 'u', 's', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
          // Headings
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          // Lists
          'ul', 'ol', 'li', 'dl', 'dt', 'dd',
          // Tables
          'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
          // Links (href will be sanitized)
          'a',
          // Block elements
          'blockquote', 'pre', 'code', 'hr',
        ],
        ALLOWED_ATTR: [
          'href', 'title', 'target', 'rel',
          'class', 'id',
          'style', // Can be further restricted if needed
          'colspan', 'rowspan',
          'start', 'type', // for ordered lists
        ],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        KEEP_CONTENT: true,
        RETURN_TRUSTED_TYPE: false,
      });
    },

    /**
     * Sanitize HTML with strict configuration
     * Only allows basic text formatting, suitable for user comments or simple content
     *
     * @param {string} html - The HTML string to sanitize
     * @returns {string} - Strictly sanitized HTML
     */
    sanitizeHtmlStrict(html) {
      if (!html) return '';

      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li'],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true,
      });
    },

    /**
     * Strip all HTML tags and return plain text
     * Use this when you need to display content as pure text
     *
     * @param {string} html - The HTML string to convert to plain text
     * @returns {string} - Plain text content
     */
    stripHtml(html) {
      if (!html) return '';

      return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true,
      });
    },
  }
};

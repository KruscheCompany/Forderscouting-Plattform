import DOMPurify from 'dompurify';

/**
 * HTML Sanitizer Mixin
 * Provides methods to safely sanitize HTML content before rendering
 * to prevent XSS attacks and other security vulnerabilities.
 */
export default {
  methods: {
    /**
     * Sanitize HTML content with default configuration
     * Allows most formatting tags but removes dangerous elements and attributes
     *
     * @param {string} html - The HTML string to sanitize
     * @returns {string} - Sanitized HTML safe for rendering
     */
    sanitizeHtml(html) {
      if (!html) return '';

      return DOMPurify.sanitize(html, {
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

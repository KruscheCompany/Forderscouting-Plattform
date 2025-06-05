import { api } from "boot/axios";

export default {
  /**
   * Fetch all translations for a specific locale
   * @param {string} locale - The locale to fetch translations for (e.g., 'en', 'de')
   * @returns {Promise<Array>} Array of translation entries
   */
  async fetchTranslationsByLocale(locale) {
    try {
      const allEntries = [];
      let page = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const response = await api.get(`/api/translations`, {
          params: {
            locale,
            "pagination[page]": page,
            "pagination[pageSize]": 100,
          },
        });

        const { data, meta } = response.data;
        allEntries.push(...data);

        hasMorePages = page < meta.pagination.pageCount;
        page++;
      }

      return allEntries;
    } catch (error) {
      console.error(`Error fetching ${locale} translations:`, error);
      throw error;
    }
  },

  /**
   * Create a new translation entry
   * @param {string} key - Translation key
   * @param {string} value - Translation value
   * @param {string} locale - Locale (e.g., 'en', 'de')
   * @returns {Promise<Object>} Created translation object
   */
  async createTranslation(key, value, locale) {
    const createData = {
      data: {
        key: key,
        value: value,
        locale: locale,
      },
    };

    const response = await api.post("/api/translations", createData);
    return response.data;
  },

  /**
   * Update an existing translation
   * @param {string} id - Translation ID
   * @param {string} value - New translation value
   * @param {string} locale - Optional locale (e.g., 'de')
   * @returns {Promise<Object>} Updated translation object
   */
  async updateTranslation(id, value, locale) {
    const data = {
      data: {
        value: value,
      },
    };

    if (locale === "de") {
      data.data.locale = "de";
    }

    const response = await api.put(`/api/translations/${id}`, data);
    return response.data;
  }
};

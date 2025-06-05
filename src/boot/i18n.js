// import Vue from 'vue'
// import VueI18n from 'vue-i18n'
// import axios from 'axios'

// Vue.use(VueI18n)

// const i18n = new VueI18n({
//   locale: 'de',
//   fallbackLocale: 'en',
//   messages: {},
//   objectNotation: true
// })



// // Fetch and apply translations from Strapi
// async function loadLocaleMessages(locale) {
//   const res = await axios.get(`${process.env.VUE_APP_MAIN_URL}/api/translations?locale=${locale}`)
//   const messages = {}
//   res.data.data.forEach(({ attributes }) => {
//     setNested(messages, attributes.key, attributes.value)
//   })
//   i18n.setLocaleMessage(locale, messages)
//   console.log(JSON.stringify(messages, null, 2))
// }

// export default async ({ app }) => {
//   const defaultLocale = 'de'
//   await loadLocaleMessages(defaultLocale)
//   app.i18n = i18n
// }

// export { i18n, loadLocaleMessages }

import axios from 'axios'
import VueI18n from 'vue-i18n'
import Vue from 'vue'

Vue.use(VueI18n)


// Utility to convert dot-notated keys into nested object
function setNested(obj, key, value) {
  const keys = key.split('.')
  let temp = obj
  while (keys.length > 1) {
    const k = keys.shift()
    temp[k] = temp[k] || {}
    temp = temp[k]
  }
  temp[keys[0]] = value
}

const i18n = new VueI18n({
  locale: 'de',
  fallbackLocale: 'en',
  messages: {},
  objectNotation: true
})

async function fetchAllTranslations(locale) {
  const messages = {}
  let page = 1
  let hasMore = true

  while (hasMore) {
    const res = await axios.get(`${process.env.VUE_APP_MAIN_URL}/api/translations`, {
      params: {
        'pagination[page]': page,
        'pagination[pageSize]': 100,
        'locale': locale
      }
    })

    const entries = res.data?.data || []

    entries.forEach(({ attributes }) => {
      setNested(messages, attributes.key, attributes.value)
    })

    const pagination = res.data.meta?.pagination
    if (pagination && pagination.page < pagination.pageCount) {
      page++
    } else {
      hasMore = false
    }
  }

  return messages
}

export default async ({ app }) => {
  const locale = 'de'
  const messages = await fetchAllTranslations(locale)
  i18n.setLocaleMessage(locale, messages)

  axios.defaults.headers.common['Accept-Language'] = locale
  app.i18n = i18n
}

export { i18n, fetchAllTranslations }

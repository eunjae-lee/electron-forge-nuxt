// https://nuxt.com/docs/api/configuration/nuxt-config
import { nuxtAppPort } from '../const';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: nuxtAppPort,
  },
});

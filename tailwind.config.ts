import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          darkBlue: '#1B262C',   // primary dark
          navy: '#0F4C75',       // deep navy
          blue: '#3282B8',       // main accent
          lightBlue: '#BBE1FA',  // light accent
          deep: '#06121a',       // used for background gradient mid-stop
          darker: '#021316',     // used for background gradient end
        },
      },
    },
  },
  plugins: [],
}

export default config
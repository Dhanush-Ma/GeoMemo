/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './Screens/*.{js,jsx,ts,tsx}',
    './Screens/AuthScreens/*.{js,jsx,ts,tsx}',
    './Screens/UserScreens/*.{js,jsx,ts,tsx}',
    './Screens/UserScreens/SettingsScreens/*.{js,jsx,ts,tsx}',
    './Components/*.{js,jsx,ts,tsx}',
    './Components/*/**.{js,jsx,ts,tsx}',
    './Components/Auth/*.{js,jsx,ts,tsx}',
    './Components/User/*.{js,jsx,ts,tsx}',
    './Components/OnBoard/*.{js,jsx,ts,tsx}',
    './Components/Modals/*.{js,jsx,ts,tsx}',
    './Components/Modals/HowToModal/*.{js,jsx,ts,tsx}',
    './Components/BottomNavbar/*.{js,jsx,ts,tsx}',
    './Stack/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
    colors: {
      primaryColor: {
        DEFAULT: '#131417',
      },
      secondaryColor: {
        DEFAULT: '#24252b',
      },
      secondaryColor1: {
        DEFAULT: '#424349',
      },
      secondaryColor2: {
        DEFAULT: '#747679',
      },
      textColor: {
        DEFAULT: '#edfcff',
      },
      accentColor1: {
        DEFAULT: '#4ac067',
      },
      accentColor2: {
        DEFAULT: '#8766eb',
      },
      accentColor3: {
        DEFAULT: '#ff7043',
      },
      accentColor4: {
        DEFAULT: '#f5ff75',
      },
      accentColor5: {
        DEFAULT: '#6997ee',
      },
      successColor: {
        DEFAULT: '#1dd65f',
      },
      errorColor: {
        DEFAULT: '#d40b10',
        shade: '#e09698',
      },

      white: {
        DEFAULT: '#fff',
      },
      black: {
        DEFAULT: '#000',
      },
    },
  },
  plugins: ['nativewind/babel'],
};


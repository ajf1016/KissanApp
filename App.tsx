import React from 'react'
import SignIn from './src/components/auth/SignIn'
import Login from './src/components/auth/Login'
import UserStore from './src/components/context/stores/Userstore'
import { StatusBar } from 'react-native'
import Navigation from './src/components/navigations/Navigation'
import { COLORS } from './src/constants/theme'


function App() {
  return (
    <UserStore>
    <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
    <Navigation />
  </UserStore>
  )
}

export default App
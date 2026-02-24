import React, { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import ChatInterface from './components/ChatInterface'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 md:p-8 bg-transparent overflow-hidden">
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        <ChatInterface />
      )}
    </div>
  )
}

export default App

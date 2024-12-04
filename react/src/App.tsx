import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { useToast } from "./components/useToast"
import { PWAPrompt } from './components/PWAPrompt'
import { ShareTarget } from './components/ShareTarget'
import BulkTranslation from './pages/BulkTranslation'
import YorubaTextEditor from './components/YorubaTextEditor'

const basename = import.meta.env.BASE_URL || '/';

function App() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast({
        title: "You're back online!",
        description: "YNLB is now fully functional.",
        variant: "default",
      })
    }
    const handleOffline = () => {
      setIsOnline(false)
      toast({
        title: "You're offline",
        description: "Some features may be limited.",
        variant: "destructive",
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }

  }, [toast]);

  return (
    <Router basename={basename}>
      <div className={`app ${!isOnline ? 'offline' : ''}`}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="/share-target" element={<ShareTarget />} />
            <Route path="bulk-translation" element={<BulkTranslation />} />
            <Route path="editor" element={<YorubaTextEditor />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <PWAPrompt />
      </div>
    </Router>
  )
}

export default App
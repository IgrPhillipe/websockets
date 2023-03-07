import { SocketProvider } from './context/SocketProvider'
import { Home } from './pages/home'

function App() {
  return (
    <SocketProvider>
      <Home />
    </SocketProvider>
  )
}

export default App

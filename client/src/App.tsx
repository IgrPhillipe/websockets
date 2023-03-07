import { UserProvider, SocketProvider } from '@/context'
import { AppRoutes } from '@/routes'

function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
    </UserProvider>
  )
}

export default App

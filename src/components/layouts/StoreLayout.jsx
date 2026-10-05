import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import WhatsAppFloat from '../WhatsAppFloat'

export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

import Cursor              from './components/Cursor'
import Navbar              from './components/Navbar'
import Footer              from './components/Footer'
import RegistrationWizard  from './components/RegistrationWizard'

export default function App() {
  return (
    <>
      <Cursor />
      <Navbar />

      <main className="page-wrapper page-enter">
        {/* Background orbs */}
        <div className="orb orb-red"    aria-hidden />
        <div className="orb orb-blue"   aria-hidden />
        <div className="orb orb-orange" aria-hidden />

        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <RegistrationWizard />
        </div>
      </main>

      <Footer />
    </>
  )
}

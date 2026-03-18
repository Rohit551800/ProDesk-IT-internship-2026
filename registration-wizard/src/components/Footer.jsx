export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          REG<span>.</span>WIZARD
        </div>
        <p className="footer-caption">
          © {new Date().getFullYear()} RegWizard. All rights reserved.
        </p>
        <nav className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </nav>
      </div>
    </footer>
  )
}

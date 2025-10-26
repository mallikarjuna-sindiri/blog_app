import React, { useState } from "react";
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const onSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('Enter a valid email');
      return;
    }
    // No backend yet: simulate success and store locally
    const list = JSON.parse(localStorage.getItem('newsletter:list') || '[]');
    if (!list.includes(email)) list.push(email);
    localStorage.setItem('newsletter:list', JSON.stringify(list));
    setStatus('Subscribed!');
    setEmail('');
    setTimeout(()=>setStatus(''), 2000);
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText('+91 6281268002');
      setStatus('Phone copied');
      setTimeout(()=>setStatus(''), 1500);
    } catch {}
  };

  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <footer className="section bg-footer mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-sm-3">
            <div className="">
              <h6 className="footer-heading text-uppercase">Information</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li>
                  <a href="#top" onClick={backToTop}>Back to top</a>
                </li>
                <li>
                  <a href="https://react.dev/" target="_blank" rel="noreferrer">React Docs</a>
                </li>
                <li>
                  <a href="https://developer.mozilla.org/" target="_blank" rel="noreferrer">MDN Web Docs</a>
                </li>
                <li>
                  <a href="https://github.com/mallikarjuna-sindiri" target="_blank" rel="noreferrer">GitHub</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-3">
            <div className="">
              <h6 className="footer-heading text-uppercase">Resources</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li>
                  <a href="https://en.wikipedia.org/" target="_blank" rel="noreferrer">Wikipedia</a>
                </li>
                <li>
                  <a href="https://react.dev/blog" target="_blank" rel="noreferrer">React Blog</a>
                </li>
                <li>
                  <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms &amp; Service</a>
                </li>
                <li>
                  <a href="https://angular.dev/" target="_blank" rel="noreferrer">Angular Dev</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-2">
            <div className="">
              <h6 className="footer-heading text-uppercase">Help</h6>
              <ul className="list-unstyled footer-link mt-4">
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li>
                  <Link to="/signin">Login</Link>
                </li>
                <li>
                  <a href="https://www.termsfeed.com/blog/sample-terms-of-service-template/" target="_blank" rel="noreferrer">Terms of Services</a>
                </li>
                <li>
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="">
              <h6 className="footer-heading text-uppercase">Stay in the loop</h6>
              <p className="contact-info mt-2">Get our latest articles and updates.</p>
              <form className="newsletter" onSubmit={onSubscribe}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <button type="submit">Subscribe</button>
              </form>
              {!!status && <div className="footer-status" role="status">{status}</div>}

              <div className="social mt-3">
                <a className="icon" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.28 4.28 0 0 0 1.88-2.36 8.59 8.59 0 0 1-2.72 1.04A4.27 4.27 0 0 0 12 8.43c0 .33.04.66.11.97A12.12 12.12 0 0 1 3.15 5.1a4.26 4.26 0 0 0-.58 2.15 4.27 4.27 0 0 0 1.9 3.55 4.25 4.25 0 0 1-1.93-.53v.05c0 2.06 1.47 3.77 3.42 4.16-.36.1-.75.15-1.14.15-.28 0-.55-.03-.82-.08.55 1.72 2.15 2.97 4.05 3a8.57 8.57 0 0 1-5.3 1.82c-.34 0-.67-.02-1-.06A12.1 12.1 0 0 0 8.29 21c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.66 8.66 0 0 0 22.46 6z"/></svg>
                </a>
                <a className="icon" href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.03-1.6-4.03-1.6-.55-1.4-1.35-1.78-1.35-1.78-1.1-.76.08-.74.08-.74 1.22.09 1.86 1.25 1.86 1.25 1.08 1.86 2.83 1.33 3.52 1.02.11-.78.42-1.33.76-1.63-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.45 11.45 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.82 1.1.82 2.24v3.31c0 .32.22.69.82.58A12 12 0 0 0 12 .5z"/></svg>
                </a>
                <button className="icon" onClick={copyPhone} aria-label="Copy phone">
                  📞
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="footer-alt mb-0 f-14">2024 © SINDIRI MALLIKARJUNA, All Rights Reserved</p>
        <button className="back-to-top" onClick={backToTop} aria-label="Back to top">↑</button>
      </div>
    </footer>
  );
}

export default Footer;

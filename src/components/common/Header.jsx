import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from "../../assets/logo4.png";
import { useClerk, useUser } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import ThemeToggle from './ThemeToggle'
import './Header.css';

const Header = () => {
  //const { userId } = useAuth();
  const { signOut } = useClerk();
  const { currentUser,setCurrentUser } = useContext(userAuthorContextObj);
 // console.log(currentUser);

 const navigate=useNavigate()
 const [menuOpen, setMenuOpen] = useState(false)
  // Add these lines
  const { isSignedIn, user, isLoaded } = useUser();
  const handleSignOut = async () => {
    console.log("signout called")
    try {
      await signOut();
      // Clear local storage after successful sign out
      setCurrentUser(null)
      localStorage.clear();
      navigate('/')
      setMenuOpen(false)
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <div>
      <nav className="header d-flex justify-content-between align-content-center py-3">
        {/* Left: logo */}
        <div className="d-flex justify-content-center align-items-center">
          <Link to="/" className="brand">
            <img src={logo} alt="Blog logo" width="58" className="ms-2" />
          </Link>
        </div>

        {/* Desktop nav */}
        <ul className="text-white d-none d-md-flex justify-content-center align-items-center list-unstyled nav-list m-0">
          <li className="d-flex align-items-center me-3"><ThemeToggle /></li>
          {!isSignedIn ? (
            <>
              <li><Link to="signin" className="link me-4">Sign In</Link></li>
              <li><Link to="signup" className="link me-2">Sign Up</Link></li>
            </>
          ) : (
            <li className="d-flex align-items-center gap-2">
              <div className="user-button me-2">
                <div className="user-avatar-wrap">
                  <img src={user.imageUrl} width="40" height="40" className="rounded-circle" alt="User avatar" />
                  <span className="role-badge">{currentUser.role}</span>
                </div>
                <p className="mb-0 user-name">{user.firstName}</p>
              </div>
              <button onClick={handleSignOut} className="signout-btn">Signout</button>
            </li>
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          className="menu-toggle d-md-none"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(v => !v)}
        >
          {/* Simple hamburger / close icon */}
          {!menuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu d-md-none">
          {isSignedIn ? (
            <>
              <div className="mobile-user d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <img src={user.imageUrl} width="36" height="36" className="rounded-circle" alt="User avatar" />
                  <div className="d-flex flex-column">
                    <span className="user-name">{user.firstName}</span>
                    <span className="role-pill">{currentUser.role}</span>
                  </div>
                </div>
                <button className="signout-btn" onClick={handleSignOut}>Signout</button>
              </div>
              <div className="mobile-menu-row d-flex align-items-center justify-content-between mt-2">
                <span style={{color:'var(--text-secondary)'}}>Theme</span>
                <ThemeToggle />
              </div>
            </>
          ) : (
            <>
              <div className="mobile-menu-row d-flex align-items-center justify-content-between">
                <span style={{color:'var(--text-secondary)'}}>Theme</span>
                <ThemeToggle />
              </div>
              <Link to="signin" className="mobile-link" onClick={()=>setMenuOpen(false)}>Sign In</Link>
              <Link to="signup" className="mobile-link" onClick={()=>setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header
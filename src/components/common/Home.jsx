import { useContext, useEffect, useState } from 'react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Home.css';

function Home() {
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const { isSignedIn, user, isLoaded } = useUser()
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function onSelectRole(e) {
    setError('');
    const selectedRole = e.target.value;

    const updatedUser = {
      ...currentUser,
      role: selectedRole,
      nameOfAuthor: `${currentUser.firstName} ${currentUser.lastName}`.trim()
    };
    setCurrentUser(updatedUser);

    try {
      let res = null;
      if (selectedRole === 'author') {
        res = await axios.post('http://localhost:3000/author-api/author', updatedUser)
      }
      if (selectedRole === 'user') {
        res = await axios.post('http://localhost:3000/user-api/user', updatedUser)
      }

      if (res) {
        let { message, payload } = res.data;
        if (message === selectedRole) {
          setCurrentUser({ ...updatedUser, ...payload });
          localStorage.setItem("currentuser", JSON.stringify(payload));
        } else {
          setError(message);
        }
      }
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      const email = user.emailAddresses?.[0]?.emailAddress || "";
      const gmailName = email.includes("@") ? email.split("@")[0] : "Guest";

      setCurrentUser(prev => ({
        ...prev,
        firstName: user.firstName || gmailName,
        lastName: user.lastName || "",
        email,
        profileImageUrl: user.imageUrl || "",
        nameOfAuthor: user.firstName
          ? `${user.firstName} ${user.lastName || ''}`.trim()
          : gmailName
      }));
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    if (currentUser?.role === "user" && error.length === 0) {
      navigate(`/user-profile/${currentUser.email}`);
    }
    if (currentUser?.role === "author" && error.length === 0) {
      navigate(`/author-profile/${currentUser.email}`);
    }
  }, [currentUser]);

  return (
    <div className='container'>
      {isSignedIn === false && (
        <div className="home-hero text-center py-5">
          <h1 className="display-4 mb-3" style={{ color: "var(--success-color)", fontWeight: 700 }}>
            Welcome to Blog App !
          </h1>
          <p className="lead mb-3" style={{ fontSize: "1.3rem", color: "var(--text-primary)" }}>
            Discover, share, and connect with a vibrant community of writers and readers.
          </p>
          <p className="lead mb-3" style={{ color: "var(--text-primary)" }}>
            <span style={{ color: "var(--link-color)", fontWeight: 600 }}>Create</span> your own stories, 
            <span style={{ color: "var(--link-color)", fontWeight: 600 }}> explore</span> trending articles, and 
            <span style={{ color: "var(--link-color)", fontWeight: 600 }}> join</span> the conversation.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <a href="/signup" className="btn btn-success btn-lg px-4" style={{ background: "var(--success-color)", border: "none" }}>
              Get Started
            </a>
            <a href="/signin" className="btn btn-outline-success btn-lg px-4" style={{ borderColor: "var(--success-color)", color: "var(--success-color)" }}>
              Sign In
            </a>
          </div>
          <img 
            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80"
            alt="Blogging"
            className="img-fluid mt-5 rounded shadow"
            style={{ maxHeight: "320px", objectFit: "cover" }}
          />
        </div>
      )}

      {isSignedIn && (
        <div>
          <div className='d-flex justify-content-evenly align-items-center p-3 rounded shadow' style={{ backgroundColor: "var(--secondary-bg)", border: "1px solid var(--border-color)" }}>
            <img src={user.imageUrl} width="100px" className='rounded-circle' alt="" />
            <p className="display-6" style={{ color: "var(--text-primary)" }}>
              {user.firstName || user.emailAddresses?.[0]?.emailAddress.split("@")[0]}
            </p>
            <p className="lead" style={{ color: "var(--text-secondary)" }}>{user.emailAddresses[0].emailAddress}</p>
          </div>
          <p className="lead mt-4" style={{ color: "var(--text-primary)" }}>Select role</p>
          {error.length !== 0 && (
            <p className="text-danger fs-5" style={{ fontFamily: "sans-serif" }}>
              {error}
            </p>
          )}
          <div className='d-flex role-radio py-3 justify-content-center rounded shadow' style={{ backgroundColor: "var(--tertiary-bg)", border: "1px solid var(--border-color)" }}>
            <div className="form-check me-4">
              <input
                type="radio"
                name="role"
                id="author"
                value="author"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="author" className="form-check-label" style={{ color: "var(--text-primary)" }}>Author</label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="role"
                id="user"
                value="user"
                className="form-check-input"
                onChange={onSelectRole}
              />
              <label htmlFor="user" className="form-check-label" style={{ color: "var(--text-primary)" }}>User</label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
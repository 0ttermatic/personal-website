import React, { useState } from 'react'
import StockTracker from './components/StockTracker'

export default function App() {
  // State to track which section is active
  const [activeSection, setActiveSection] = useState('home')

  return (
    <div className="app">
      {/* ========== Header Section ========== */}
      <header>
        <h1>Hi, I'm Chris</h1>
        <p>Welcome to my personal website!</p>
        <nav className="header-nav">
          <button onClick={() => setActiveSection('stocks')}>Stocks</button>
          <button onClick={() => setActiveSection('home')}>Home</button>
          <button onClick={() => setActiveSection('visualization')}>Visualization Project</button>
        </nav>
      </header>

      {/* ========== Main Content ========== */}
      <main className="container">
        {/* Show Home sections when activeSection is 'home' */}
        {activeSection === 'home' && (
          <>
            {/* About Section */}
            <section id="about">
              <h2>About</h2>
              <p>Hi — My name is Chris.  I decided to make this website to show off my personal projects, hobbies, and interests.  Also to keep up with my programming skills to not get rusty.</p>
              <p>I graduated from Northern Illinois University with a major in Software Development and a minor in Finance.  I played on the varsity League of Legends team and was the starting support player, making it to LAN and having a fantastic season.</p>
              <p>That being said, you may notice my personal projects revolve around these interests.  Feel free to poke around the website and learn more about what I love!</p>
            </section>

            {/* Projects Section */}
            <section id="projects">
              <h2>Projects</h2>
              <p>My projects will go here as I add them to this site.</p>
            </section>

            {/* Contact Section */}
            <section id="contact">
              <h2>Contact</h2>
              <p>Email: <a href="mailto:you@example.com">chrisgorczo@gmail.com</a></p>
            </section>
          </>
        )}

        {/* Show Stocks section when activeSection is 'stocks' */}
        {activeSection === 'stocks' && (
          <section id="stocks">
            <StockTracker />
          </section>
        )}

        {/* Show Visualization section when activeSection is 'visualization' */}
        {activeSection === 'visualization' && (
          <section id="visualization">
            <h2>Data Visualization Project</h2>
            <p>Your data visualization project content will go here.</p>
          </section>
        )}
      </main>

      {/* ========== Footer ========== */}
      <footer className="site-footer">
        <div className="container">
          <small>© {new Date().getFullYear()} Chris</small>
        </div>
      </footer>
    </div>
  )
}

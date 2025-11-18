import React from 'react'

export default function App() {
  return (
    <div className="app">
      {/* ========== Header Section ========== */}
      <header>
        <h1>Hi, I'm Chris</h1>
        <p>Welcome to my personal website!</p>
        <nav className="header-nav">
          <a href="#stocks">Stocks</a>
          <a href="#visualization">Visualization Project</a>
        </nav>
      </header>

      {/* ========== Main Content ========== */}
      <main className="container">
        {/* About Section */}
        <section id="about">
          <h2>About</h2>
          <p>Hi — I'm a developer who enjoys building interactive data visualizations and web apps. Replace this with your bio.</p>
        </section>

        {/* Projects Section */}
        <section id="projects">
          <h2>Projects</h2>
          <p>Project highlights go here. I can help you showcase projects with cards and links.</p>
        </section>

        {/* Contact Section */}
        <section id="contact">
          <h2>Contact</h2>
          <p>Email: <a href="mailto:you@example.com">you@example.com</a></p>
        </section>
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

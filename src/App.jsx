import React from 'react'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Hi, I'm Chris</h1>
        <p>Welcome to my personal website!</p>
      </header>

      <main className="container">
        <section id="about">
          <h2>About</h2>
          <p>Hi — I'm a developer who enjoys building interactive data visualizations and web apps. Replace this with your bio.</p>
        </section>

        <section id="projects">
          <h2>Projects</h2>
          <p>Project highlights go here. I can help you showcase projects with cards and links.</p>
        </section>

        <section id="contact">
          <h2>Contact</h2>
          <p>Email: <a href="mailto:you@example.com">you@example.com</a></p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <small>© {new Date().getFullYear()} Chris</small>
        </div>
      </footer>
    </div>
  )
}

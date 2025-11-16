// =============== src/App.jsx ===============
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import ProfileCard from "./components/ProfileCard";
import LiquidChrome from "./components/LiquidChrome";
import SplashCursor from "./components/SplashCursor";
import profileImage from "./assets/luigi-foto.png";

import {
  Github,
  Linkedin,
  Mail,
  Code2,
  Cpu,
  Database,
  Workflow,
  FileDown,
  Sun,
  Moon,
  Rocket,
  MousePointerClick,
  ExternalLink,
  ChevronRight,
  MapPin,
  Phone,
  Download,
  Sparkles,
} from "lucide-react";

import "./index.css";

const CV_PDF_URL = "/cv.pdf";


// =================== THEME ===================

const ThemeContext = React.createContext(null)

function ThemeProvider({ children }) {
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === "undefined") return true
    const stored = localStorage.getItem("luigi_theme")
    if (stored) return stored === "dark"
    if (window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return true
  })

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", isDark)
      localStorage.setItem("luigi_theme", isDark ? "dark" : "light")
    }
  }, [isDark])

  const value = React.useMemo(() => ({ isDark, setIsDark }), [isDark])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function useTheme() {
  return React.useContext(ThemeContext)
}

// =================== APP SHELL & LOADER ===================

function AppShell({ children }) {
  const { isDark } = useTheme()

  return (
    <div
      className={
        "min-h-screen transition-colors duration-500 " +
        (isDark
          ? "bg-transparent text-slate-100"
          : "bg-transparent text-slate-900")
      }
    >
      {children}
    </div>
  )
}


function NeonName() {
  return (
    <motion.h1 layout className="text-2xl md:text-3xl font-black tracking-tight">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 drop-shadow-[0_0_30px_rgba(56,189,248,0.35)]">
        Luigi Jhoan Keith Ríos Munar
      </span>
    </motion.h1>
  )
}

function Loader() {
  return (
    <div className="fixed inset-0 grid place-items-center z-[100] bg-black/90 backdrop-blur">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="mb-6">
          <NeonName />
        </div>
        <div className="relative w-64 h-2 rounded-full bg-slate-800 overflow-hidden mx-auto">
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 256 }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500"
          />
        </div>
      </motion.div>
    </div>
  )
}

// =================== BACKGROUND PARTICLES ===================

function ParticlesBG() {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const req = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    let w, h

    function resize() {
      w = canvas.width = window.innerWidth
      h = canvas.height = Math.max(window.innerHeight, document.body.scrollHeight)
    }

    resize()
    window.addEventListener("resize", resize)

    const count = Math.min(160, Math.floor((w * h) / 15000))
    particles.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.8 + 0.2,
    }))

    function loop() {
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = "rgba(2,6,23,0.6)"
      ctx.fillRect(0, 0, w, h)

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i]
        for (let j = i + 1; j < particles.current.length; j++) {
          const q = particles.current[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d = Math.hypot(dx, dy)
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.45
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }

      particles.current.forEach((p) => {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
        g.addColorStop(0, `rgba(168,85,247,${p.a})`)
        g.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = `rgba(56,189,248,${p.a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      })

      req.current = requestAnimationFrame(loop)
    }

    loop()
    return () => {
      cancelAnimationFrame(req.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

// =================== NAVBAR ===================

function Navbar() {
  const { isDark, setIsDark } = useTheme()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/#about", label: "Sobre mí" },
    { to: "/#projects", label: "Proyectos" },
    { to: "/#services", label: "Servicios" },
    { to: "/#contact", label: "Contacto" },
    { to: "/proyectos", label: "Galería" },
    { to: "/cv", label: "CV" },
    { to: "/blog", label: "Blog" },
  ]

  useEffect(() => {
    setOpen(false)
  }, [location])

  const navClasses = isDark
    ? "backdrop-blur bg-slate-950/60 border-b border-white/10"
    : "backdrop-blur bg-white/90 border-b border-slate-200/80 text-slate-900 shadow-sm"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${navClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Rocket className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
            <span className="font-semibold tracking-tight">LuigiJK</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm hover:text-cyan-300 transition ${isActive ? "text-cyan-400" : "text-slate-200"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <button
              aria-label="Cambiar tema"
              onClick={() => setIsDark((v) => !v)}
              className="relative inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs bg-white/5 hover:border-cyan-400/60 transition"
            >
              <span className="sr-only">Tema</span>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun
                  className={`w-4 h-4 text-yellow-300 transition-all ${isDark ? "opacity-0 -rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"
                    }`}
                />
                <Moon
                  className={`w-4 h-4 text-slate-200 absolute transition-all ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"
                    }`}
                />
              </div>
              <span className="text-xs text-slate-100">
                {isDark ? "Oscuro" : "Claro"}
              </span>
            </button>
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden px-3 py-2 rounded-lg border border-white/10"
          >
            Menú
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden pb-4 flex flex-col gap-2"
            >
              {links.map((l) => (
                <NavLink key={l.label} to={l.to} className="px-2 py-2 rounded hover:bg.white/5">
                  {l.label}
                </NavLink>
              ))}

              <button
                onClick={() => setIsDark((v) => !v)}
                className="px-2 py-2 rounded flex items-center gap-2 hover:bg-white/5"
              >
                {isDark ? (
                  <Moon className="w-4 h-4 text-slate-200" />
                ) : (
                  <Sun className="w-4 h-4 text-yellow-300" />
                )}
                <span className="text-sm">
                  {isDark ? "Modo claro" : "Modo oscuro"}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

// =================== HERO ===================

function GridGlow() {
  return (
    <div className="absolute inset-0">
      <div className="absolute -inset-x-40 -top-32 h-72 blur-3xl bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/10 to-blue-500/20" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(transparent 23px, rgba(148,163,184,0.08) 24px), linear-gradient(90deg, transparent 23px, rgba(148,163,184,0.08) 24px)",
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  )
}

function TechPortrait() {
  return (
    <motion.div
      className="relative w-full flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="relative w-full max-w-xl rounded-[40px] border border-white/10 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950/95 shadow-[0_25px_80px_rgba(15,23,42,0.95)] px-6 pt-10 pb-10 overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-64 w-[150%] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-cyan-500/35 via-fuchsia-500/30 to-blue-500/35 blur-3xl" />
        </div>

        <div
          className="pointer-events-none absolute inset-[18px] rounded-[32px] opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 0 0, rgba(56,189,248,0.15), transparent 55%), radial-gradient(circle at 100% 0, rgba(244,114,182,0.15), transparent 55%), linear-gradient(transparent 23px, rgba(148,163,184,0.08) 24px), linear-gradient(90deg, transparent 23px, rgba(148,163,184,0.06) 24px)",
            backgroundSize: "auto, auto, 24px 24px, 24px 24px",
          }}
        />

        <div className="relative flex items-center justify-center py-10">
          <motion.div
            className="pointer-events-none absolute h-[260px] w-[260px] rounded-full border border-cyan-500/20"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
          />
          <motion.div
            className="pointer-events-none absolute h-[230px] w-[230px] rounded-full border border-cyan-500/12"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
          />

          <motion.div
            className="relative h-48 w-48 rounded-full bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-400/70 shadow-[0_0_50px_rgba(34,211,238,0.8)]"
            animate={{ y: [-4, 4, -4] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <motion.div
              className="absolute inset-[-18px] rounded-full bg-cyan-500/15 blur-3xl"
              animate={{ opacity: [0.2, 0.45, 0.2] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            <div className="absolute inset-[6px] rounded-full bg-slate-950/95" />
            <div className="absolute inset-4 rounded-full overflow-hidden">
              <img
                src={profileImage}
                alt="Luigi Jhoan Keith Ríos Munar"
                className="h-full w-full object-cover"
              />
            </div>

            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 rounded-full border border-cyan-400/80" />
              <div className="absolute inset-1 rounded-full border border-fuchsia-500/70" />
            </motion.div>
          </motion.div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          {[
            { label: "Web", icon: <Code2 className="w-3 h-3" /> },
            { label: "IA", icon: <Cpu className="w-3 h-3" /> },
            { label: "Datos", icon: <Database className="w-3 h-3" /> },
            { label: "Automatización", icon: <Workflow className="w-3 h-3" /> },
          ].map((chip, idx) => (
            <motion.div
              key={chip.label}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * idx + 0.4, type: "spring", stiffness: 140, damping: 12 }}
              whileHover={{ y: -3, scale: 1.04 }}
              className="flex items-center gap-1 rounded-full border border-white/18 bg-slate-950/90 px-4 py-1.5 text-[11px] text-slate-100 shadow-sm shadow-slate-900/80 backdrop-blur"
            >
              <span className="inline-flex items-center justify-center rounded-full bg-slate-900/90 p-[3px] text-cyan-300">
                {chip.icon}
              </span>
              <span>{chip.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function Hero() {
  const roles = ["Desarrollador Web", "Analista de Datos", "Especialista en IA", "Innovador Digital"]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative pt-28 pb-24 md:pb-32 overflow-hidden" id="home">
      <div className="absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_40%,#000_60%,transparent)] pointer-events-none">
        <GridGlow />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-xs uppercase tracking-widest text-cyan-300/90 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Portafolio
          </div>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight">
            Hola, soy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500">
              Luigi Jhoan Keith Ríos Munar
            </span>
          </h1>
          <p className="mt-3 text-lg text-slate-300">
            Ingeniero de Sistemas — construyo experiencias digitales eficientes e inteligentes.
          </p>
          <p className="mt-2 text-cyan-300">{roles[index]}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-5 py-2.5 font-medium shadow-lg shadow-cyan-500/20 hover:shadow-fuchsia-600/25"
            >
              Ver Proyectos{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </a>
            <a
              href="/cv#download"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 px-5 py-2.5 font-medium hover:border-fuchsia-400/60"
            >
              <FileDown className="w-4 h-4" /> Descargar CV
            </a>
          </div>

          <div className="mt-6 flex items-center gap-4 text-slate-300">
            <a
              className="hover:text-white inline-flex items-center gap-2"
              href="https://github.com/luigi11munar"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-5 h-5" />
              GitHub
            </a>
            <a
              className="hover:text-white inline-flex.items-center gap-2"
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-5 h-5" />
              LinkedIn
            </a>
            <a
              className="hover:text-white inline-flex items-center gap-2"
              href="mailto:luigijhoan@gmail.com"
            >
              <Mail className="w-5 h-5" />
              Email
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex justify-center"
        >
          <ProfileCard
            avatarUrl={profileImage}
            miniAvatarUrl={profileImage}
            name="Luigi Jhoan Keith Ríos Munar"
            title="Ingeniero de Sistemas"
            handle="luigicodes"
            status="Online"
            contactText="Contact Me"
          />
        </motion.div>
      </div>

      <div className="mt-10 flex justify-center">
        <MousePointerClick className="w-5 h-5 text-slate-500 animate-bounce" />
      </div>
    </section>
  )
}

// =================== ABOUT & SKILLS ===================

const skills = [
  { name: "HTML5", level: 95 },
  { name: "CSS3 / Sass", level: 90 },
  { name: "TypeScript", level: 82 },
  { name: "Jupyter", level: 80 },
  { name: "TensorFlow", level: 80 },
  { name: "Figma", level: 78 },
  { name: "Notion", level: 85 },
  { name: "Postman", level: 86 },
  { name: "Linux", level: 84 },
  { name: "Docker", level: 78 },
  { name: "GitHub Actions", level: 75 },
  { name: "JavaScript (ES6+)", level: 92 },
  { name: "React.js", level: 90 },
  { name: "Next.js", level: 85 },
  { name: "Vite", level: 88 },
  { name: "TailwindCSS", level: 93 },
  { name: "Node.js", level: 85 },
  { name: "Express.js", level: 82 },
  { name: "Python", level: 92 },
  { name: "TensorFlow", level: 80 },
  { name: "spaCy", level: 78 },
  { name: "OpenAI API", level: 90 },
  { name: "Modelos Predictivos", level: 85 },
  { name: "Algoritmos Genéticos (DEAP)", level: 90 },
  { name: "Machine Learning", level: 88 },
  { name: "MySQL", level: 85 },
  { name: "MongoDB", level: 82 },
  { name: "PostgreSQL", level: 78 },
  { name: "Selenium", level: 83 },
  { name: "Docker", level: 78 },
  { name: "Git / GitHub", level: 90 },
  { name: "Pandas", level: 90 },
  { name: "NumPy", level: 88 },
  { name: "Power BI", level: 85 },
  { name: "Comunicación Asertiva", level: 95 },
  { name: "Trabajo en Equipo", level: 92 },
  { name: "Liderazgo", level: 88 },
  { name: "Gestión del Tiempo", level: 93 },
  { name: "Resolución de Problemas", level: 94 },
  { name: "Pensamiento Crítico", level: 90 },
]

const logoSkills = [
  // Lenguajes
  {
    name: "JavaScript",
    label: "JavaScript",
    category: "Lenguaje",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    label: "TypeScript",
    category: "Lenguaje",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "Python",
    label: "Python",
    category: "Lenguaje",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "Java",
    label: "Java",
    category: "Lenguaje",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },

  // Frontend
  {
    name: "React",
    label: "React",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Next.js",
    label: "Next.js",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "HTML5",
    label: "HTML5",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    label: "CSS3",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    name: "TailwindCSS",
    label: "TailwindCSS",
    category: "Frontend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
  },

  // Backend & APIs
  {
    name: "Node.js",
    label: "Node.js",
    category: "Backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express",
    label: "Express",
    category: "Backend",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },

  // Datos & Bases de Datos
  {
    name: "MySQL",
    label: "MySQL",
    category: "Datos",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    name: "MongoDB",
    label: "MongoDB",
    category: "Datos",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "PostgreSQL",
    label: "PostgreSQL",
    category: "Datos",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "Pandas",
    label: "Pandas",
    category: "Datos",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  {
    name: "NumPy",
    label: "NumPy",
    category: "Datos",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },

  // IA & Ciencia de Datos
  {
    name: "TensorFlow",
    label: "TensorFlow",
    category: "IA",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "Jupyter",
    label: "Jupyter",
    category: "IA",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  },

  // DevOps / Automation / Tools
  {
    name: "Git",
    label: "Git",
    category: "Colaboración",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    name: "GitHub",
    label: "GitHub",
    category: "Colaboración",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  {
    name: "Docker",
    label: "Docker",
    category: "DevOps",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  {
    name: "Linux",
    label: "Linux",
    category: "DevOps",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  {
    name: "VSCode",
    label: "VS Code",
    category: "Herramienta",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
  {
    name: "Postman",
    label: "Postman",
    category: "Herramienta",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },

  // Innovación / Diseño / Gestión
  {
    name: "Figma",
    label: "Figma",
    category: "Innovación",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    name: "Notion",
    label: "Notion",
    category: "Productividad",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg",
  },
  {
    name: "Jira",
    label: "Jira",
    category: "Gestión",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg",
  },
]

const orbitSkills = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    area: "Frontend",
    description: "Interfaces SPA rápidas y animadas.",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    area: "Frontend / Fullstack",
    description: "SSR, SEO y APIs integradas.",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    area: "Lenguaje",
    description: "Tipado sólido para proyectos escalables.",
  },
  {
    name: "TailwindCSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg",
    area: "Estilos",
    description: "Interfaces modernas con diseño atómico.",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    area: "Backend",
    description: "APIs rápidas y servicios en tiempo real.",
  },
  {
    name: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    area: "Backend",
    description: "Microservicios y APIs REST limpias.",
  },
  {
    name: "Python",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    area: "IA / Datos",
    description: "Automatización, análisis y modelos de IA.",
  },
  {
    name: "TensorFlow",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
    area: "Deep Learning",
    description: "Redes neuronales y modelos avanzados.",
  },
  {
    name: "scikit-learn",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
    area: "Machine Learning",
    description: "Modelos clásicos, clasificación y predicción.",
  },
  {
    name: "Jupyter",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
    area: "Ciencia de Datos",
    description: "Experimentación y prototipado de notebooks.",
  },
  {
    name: "Pandas",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
    area: "Ciencia de Datos",
    description: "Limpieza y transformación de datasets.",
  },
  {
    name: "NumPy",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
    area: "Cálculo numérico",
    description: "Cómputo matricial de alto rendimiento.",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
    area: "Bases de Datos",
    description: "Relacional, sólido y muy usado en producción.",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    area: "Bases de Datos",
    description: "SQL avanzado y extensiones potentes.",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    area: "NoSQL",
    description: "Documentos flexibles para apps modernas.",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    area: "DevOps",
    description: "Contenedores listos para producción.",
  },
  {
    name: "Linux",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
    area: "Entorno",
    description: "Servidores, scripts y automatización.",
  },
  {
    name: "GitHub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    area: "Colaboración",
    description: "Control de versiones y trabajo en equipo.",
  },
]

function SkillsConstellation() {
  const categories = [
    {
      title: "Inteligencia Artificial",
      items: [
        "OpenAI API / LLMs",
        "TensorFlow · PyTorch",
        "scikit-learn · spaCy",
        "Algoritmos genéticos (DEAP)",
        "NLP y clasificación de texto",
      ],
    },
    {
      title: "Ciencia de Datos",
      items: [
        "Python · Jupyter Notebook",
        "Pandas · NumPy",
        "Limpieza y transformación de datos",
        "Análisis exploratorio (EDA)",
        "Dashboards con Power BI",
      ],
    },
    {
      title: "Bases de Datos",
      items: [
        "MySQL · PostgreSQL · MongoDB",
        "Modelado relacional",
        "Consultas SQL optimizadas",
        "Integración con ORMs y APIs",
      ],
    },
    {
      title: "Web & Backend",
      items: ["React · Next.js · Vite", "Node.js · Express", "APIs REST/JSON", "Autenticación y JWT"],
    },
    {
      title: "Automatización & DevOps",
      items: ["Selenium / RPA", "Bots automatizados", "Docker · Linux", "Git · GitHub · CI/CD básico"],
    },
  ]

  return (
    <section className="relative.py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Herramientas & tecnologías que uso
          </h2>
          <p className="text-sm text-slate-300 mb-5">
            Un stack que combina desarrollo web, ciencia de datos, inteligencia artificial,
            bases de datos y automatización para construir soluciones completas y medibles.
          </p>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"
              >
                <p className="font-semibold text-slate-100 mb-1">{cat.title}</p>
                <p className="text-[11px] text-slate-300">
                  {cat.items.join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[480px] rounded-[32px] border border-cyan-400/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_28px_80px_rgba(8,47,73,0.9)] overflow-hidden">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-40 left-1/2 h-72 w-[180%] -translate-x-1/2 rounded-[55%] bg-gradient-to-r from-cyan-500/30 via-blue-500/15 to-fuchsia-500/30 blur-3xl" />
            </div>

            <div className="relative px-6 pt-6 pb-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/90 mb-1">
                Luigi · Tech Stack
              </p>
              <p className="text-sm font-semibold text-slate-100 mb-4">
                Herramientas que uso a diario
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {logoSkills.map((tool) => (
                  <motion.div
                    key={tool.name}
                    className="flex flex-col items-center gap-1 rounded-2xl bg-slate-950/70 border border-white/10 px-3 py-3 backdrop-blur"
                    whileHover={{ scale: 1.06, y: -2 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  >
                    <div className="h-11 w-11 rounded-full bg-slate-900 flex items-center justify-center overflow-hidden shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                      <img
                        src={tool.icon}
                        alt={tool.label}
                        className="w-7 h-7 object-contain"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[11px] text-slate-100 text-center">
                      {tool.label}
                    </span>
                    <span className="text-[10px] text-slate-400 text-center">
                      {tool.category}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillLogoCarousel() {
  const doubled = [...logoSkills, ...logoSkills]

  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-4 py-3 px-4"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((s, i) => (
          <div
            key={i + s.name}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 min-w-[160px]"
          >
            <div className="h-7 w-7 rounded-full bg-slate-900/80 flex items-center justify-center overflow-hidden border border.white/10">
              <img
                src={s.icon}
                alt={s.label}
                className="w-5 h-5 object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-slate-100">{s.label}</span>
              <span className="text-[10px] text-slate-400">{s.category}</span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function About() {
  const webStack = ["React", "Next.js", "Node.js", "Python", "TailwindCSS", "OpenAI", "MySQL", "MongoDB"]

  const skillGroups = [
    {
      title: "Desarrollo Web",
      icon: <Code2 className="w-5 h-5 text-cyan-300" />,
      items: [
        "SPA con React y Next.js",
        "Diseño responsive y accesible",
        "Integración de APIs REST/JSON",
        "Optimización de rendimiento (Lighthouse)",
      ],
    },
    {
      title: "Inteligencia Artificial",
      icon: <Cpu className="w-5 h-5 text-fuchsia-300" />,
      items: [
        "Modelos con OpenAI y LLMs",
        "Algoritmos genéticos (DEAP)",
        "Clasificación y predicción con ML",
        "Procesamiento de lenguaje natural (NLP)",
      ],
    },
    {
      title: "Datos & Automatización",
      icon: <Database className="w-5 h-5 text-emerald-300" />,
      items: [
        "ETL con Python y Pandas",
        "Dashboards con Power BI",
        "Automatización con RPA y Selenium",
        "Scripts para tareas repetitivas",
      ],
    },
    {
      title: "Trabajo & Liderazgo",
      icon: <Workflow className="w-5 h-5 text-amber-300" />,
      items: [
        "Comunicación clara con clientes",
        "Liderazgo de pequeños equipos",
        "Gestión del tiempo y prioridades",
        "Mentoría y guía técnica básica",
      ],
    },
  ]

  const topSkills = skills.slice(0, 10)

  const primaryStackIcons = [
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "TailwindCSS",
    "MySQL",
    "MongoDB",
    "TensorFlow",
  ]

  return (
    <section id="about" className="relative py-20">
      <SectionHeader title="Sobre mí" subtitle="Tecnología, innovación y propósito" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div className="relative rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur">
            <p className="text-slate-300 leading-relaxed">
              Soy <b>Luigi Jhoan Keith Ríos Munar</b>, Ingeniero de Sistemas con
              enfoque en <b>desarrollo web</b>, <b>inteligencia artificial</b>,{" "}
              <b>análisis de datos</b> y <b>automatización</b>. Me gusta convertir ideas en
              productos funcionales, medibles y mantenibles.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              Combino una base sólida técnica con una mentalidad muy práctica:
              construir rápido, medir, aprender y mejorar.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/40 bg-slate-950/70 p-6 space-y-4 shadow-[0_24px_70px_rgba(8,47,73,0.85)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span className="inline-flex rounded-full bg-cyan-500/15 p-1">
                  <Code2 className="w-4 h-4 text-cyan-300" />
                </span>
                Mi stack principal
              </h3>
              <span className="text-[11px] uppercase tracking-[0.22em] text-cyan-300/80">
                Web · IA · Datos · DevOps
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              {[
                "Full-Stack JavaScript",
                "IA aplicada al negocio",
                "Data-Driven Solutions",
                "Automatización de procesos",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-400/40 text-cyan-100"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
              {logoSkills
                .filter((tool) => primaryStackIcons.includes(tool.name))
                .map((tool, i) => (
                  <motion.div
                    key={tool.name + i}
                    whileHover={{ y: -3, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    className="flex flex-col.items-center gap-1 rounded-xl bg-slate-900/80 border border-white/10 px-3 py-3"
                    title={`${tool.label} · ${tool.category}`}
                  >
                    <div className="h-9 w-9 rounded-full bg-slate-950 flex items-center justify-center overflow-hidden shadow-[0_0_18px_rgba(34,211,238,0.6)]">
                      <img
                        src={tool.icon}
                        alt={tool.label}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="text-[11px] text-slate-100 text-center">
                      {tool.label}
                    </span>
                    <span className="text-[10px] text-slate-400 text-center">
                      {tool.category}
                    </span>
                  </motion.div>
                ))}
            </div>

            <SkillLogoCarousel />
          </div>

          <div className="rounded-2xl border border-white/10 p-6 bg-white/5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <span className="inline-flex rounded-full bg-fuchsia-500/10 p-1">
                <Sparkles className="w-4 h-4 text-fuchsia-300" />
              </span>
              Habilidades blandas
            </h3>
            <p className="text-sm text-slate-300">
              Disfruto trabajar con personas, explicar conceptos complejos de
              forma sencilla y aportar estabilidad en momentos de presión.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                "Comunicación asertiva",
                "Trabajo en equipo",
                "Liderazgo",
                "Gestión del tiempo",
                "Resolución de problemas",
                "Pensamiento crítico",
              ].map((s) => (
                <span
                  key={s}
                  className="px-3 py-1 rounded-full bg-slate-900/60 border border-white/10 text-slate-200"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  {group.icon}
                  <h4 className="text-sm font-semibold">{group.title}</h4>
                </div>
                <ul className="text-xs text-slate-300 space-y-1">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-1">
                      <span className="mt-[6px] h-[3px] w-3 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-cyan-400/40 bg-slate-950/80 p-5">
            <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
              <span className="inline-flex rounded-full bg-cyan-500/15 p-1">
                <Sparkles className="w-4 h-4 text-cyan-300" />
              </span>
              Nivel técnico (top skills)
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {topSkills.map((s, i) => (
                <div key={s.name}>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>{s.name}</span>
                    <span className="text-cyan-300 font-semibold">
                      {s.level}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-900/70 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.9, delay: i * 0.04 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 shadow-[0_0_18px_rgba(56,189,248,0.7)]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-slate-400">
              * Porcentaje basado en experiencia práctica, proyectos reales y
              uso frecuente en mi trabajo diario.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// =================== PROJECTS ===================

const projects = [
  {
    title: "Optimizador de Horarios Universitarios",
    desc: "Sistema basado en algoritmos genéticos que genera horarios sin choques y cumple todas las restricciones académicas.",
    tech: ["Python", "DEAP", "Pandas"],
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Asistente IA para WhatsApp",
    desc: "Chatbot con OpenAI + Twilio que mantiene conversaciones naturales, responde preguntas y automatiza tareas 24/7.",
    tech: ["Node.js", "OpenAI", "Twilio"],
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Sistema Multiagente para Apoyo Emocional",
    desc: "Arquitectura multiagente que analiza emociones mediante NLP y modelos de IA para brindar apoyo personalizado.",
    tech: ["Python", "TensorFlow", "spaCy"],
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Plataforma Web Punto Frío Zulay",
    desc: "Aplicación web para gestión de pedidos, ventas y administración de tienda.",
    tech: ["React", "Node.js", "MySQL"],
    img: "https://images.unsplash.com/photo-1522199710521-72d69614c702?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "E-Commerce JLP Sports Supplement",
    desc: "Tienda online con pagos, carrito, historial y panel admin.",
    tech: ["Next.js", "Stripe", "MongoDB"],
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Dashboard Deportivo Inteligente",
    desc: "Dashboard avanzado para análisis de métricas deportivas y predicción de rendimiento.",
    tech: ["Power BI", "Python", "React"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Scraper de Precios de Suplementos",
    desc: "Comparador automatizado de precios de tiendas online para optimizar compras.",
    tech: ["Python", "BeautifulSoup", "Pandas"],
    img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Plataforma de Automatización RPA",
    desc: "Bots inteligentes que automatizan correos, reportes y tareas repetitivas.",
    tech: ["Python", "Selenium", "Docker"],
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Sistema de Gestión Académica",
    desc: "Panel académico con roles, notas, registros y autenticación segura.",
    tech: ["React", "Node.js", "MySQL"],
    img: "https://images.unsplash.com/photo-1581090124554-7acb2ca9ffbb?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Chat en Tiempo Real estilo Discord",
    desc: "Aplicación de chat con canales, estados, reacciones y baja latencia.",
    tech: ["React", "Socket.IO", "Redis"],
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "CV Interactivo con Estadísticas",
    desc: "CV web con animaciones, descarga, tracking y chatbot IA.",
    tech: ["React", "Firebase", "Tailwind"],
    img: "https://images.unsplash.com/photo-1559027615-cd4628902d4e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    title: "Portafolio Futurista 3D",
    desc: "Portafolio con efectos neón, IA integrada, animaciones avanzadas y subpáginas.",
    tech: ["React", "Framer Motion", "Vite"],
    img: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1400&auto=format&fit=crop",
  },
]

function ProjectCard({ p }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 shadow-xl"
    >
      <div className="aspect-video overflow-hidden">
        <motion.img
          src={p.img}
          alt={p.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg">{p.title}</h3>
        <p className="mt-1 text-sm text-slate-300">{p.desc}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {p.tech.map((t) => (
            <span
              key={t}
              className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-5">
          <Link to="/proyectos" className="text-sm text-cyan-300 hover:text-white">
            Ver más →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

function ProjectsPreview() {
  const items = projects.slice(0, 3)
  return (
    <section id="projects" className="relative py-20">
      <SectionHeader title="Proyectos" subtitle="Selección destacada" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-6">
        {items.map((p, i) => (
          <ProjectCard key={i} p={p} />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/proyectos"
          className="inline-flex items-center gap-2 text-cyan-300 hover:text-white"
        >
          Ver galería completa <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

// =================== TIMELINE ===================

function Timeline() {
  const items = [
    {
      when: "2023 — 2025",
      where: "Ingeniería de Sistemas",
      details: "Énfasis en desarrollo web, IA y analítica.",
    },
    {
      when: "2024",
      where: "Proyecto IA en WhatsApp",
      details: "Diseño de asistente conversacional para soporte.",
    },
    {
      when: "2025",
      where: "Automatización de procesos",
      details: "Bots RPA y pipelines de datos en producción.",
    },
  ]
  return (
    <section className="relative py-20">
      <SectionHeader title="Experiencia & Educación" subtitle="Línea del tiempo" />
      <div className="max-w-5xl mx-auto px-4">
        <ol className="relative border-s border-white/10">
          {items.map((it, i) => (
            <li key={i} className="mb-10 ms-6">
              <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"></span>
              <h4 className="text-sm text-cyan-300">{it.when}</h4>
              <p className="font-medium">{it.where}</p>
              <p className="text-slate-300 text-sm">{it.details}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

// =================== SERVICES ===================

function Services() {
  const items = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Desarrollo Web",
      text: "Sitios y apps con React, Next.js y APIs rápidas.",
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "Inteligencia Artificial",
      text: "LLMs, clasificación, embeddings y chatbots.",
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Análisis de Datos",
      text: "ETL, dashboards y data storytelling.",
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "Automatización",
      text: "RPA, integraciones y pipelines CI/CD.",
    },
  ]
  return (
    <section id="services" className="relative py-20">
      <SectionHeader title="Servicios" subtitle="¿Cómo puedo ayudarte?" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-4 gap-6">
        {items.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -6 }}
            className="rounded-2xl p-6 bg-white/5 border border-white/10"
          >
            <div className="text-cyan-300">{s.icon}</div>
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="text-sm text-slate-300">{s.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// =================== CONTACT ===================

function validateFields(form) {
  const e = {}
  if (!form.name) e.name = "Tu nombre es requerido"
  if (!form.email || !/.+@.+\..+/.test(form.email)) e.email = "Email válido requerido"
  if (!form.message || form.message.length < 10) e.message = "Cuéntame más (10+ caracteres)"
  return e
}

function getFormspreeId() {
  try {
    return (
      import.meta?.env?.VITE_FORMSPREE_ID ??
      (typeof window !== "undefined" ? window.__VITE_FORMSPREE_ID__ : null)
    )
  } catch {
    return null
  }
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const FORMSPREE = getFormspreeId()

  function validate() {
    const e = validateFields(form)
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(ev) {
    ev.preventDefault()
    if (!validate()) return
    try {
      if (FORMSPREE) {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE}`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          setSent(true)
          setForm({ name: "", email: "", message: "" })
        } else throw new Error("send")
      } else {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          setSent(true)
          setForm({ name: "", email: "", message: "" })
        } else throw new Error("send")
      }
    } catch (err) {
      alert("No se pudo enviar el mensaje. Intenta de nuevo.")
    }
  }

  return (
    <section id="contact" className="relative py-20">
      <SectionHeader title="Contacto" subtitle="Construyamos algo increíble" />
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8">
        <form
          onSubmit={submit}
          className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4"
        >
          <div>
            <label className="text-sm">Nombre</label>
            <input
              name="name"
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && (
              <p className="text-xs text-fuchsia-300 mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="text-sm">Email</label>
            <input
              name="email"
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-xs text-fuchsia-300 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="text-sm">Mensaje</label>
            <textarea
              name="message"
              rows={4}
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            {errors.message && (
              <p className="text-xs text-fuchsia-300 mt-1">{errors.message}</p>
            )}
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-5 py-2.5 font-medium shadow-lg">
            Enviar
          </button>
          {sent && (
            <p className="text-cyan-300 text-sm">¡Gracias! Responderé pronto.</p>
          )}
          {!FORMSPREE && (
            <p className="text-xs text-slate-400">
              *Configura /api/contact o usa Formspree fijando VITE_FORMSPREE_ID.
            </p>
          )}
        </form>
        <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
          <h4 className="font-semibold">Conéctate</h4>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-300" />{" "}
              <a
                href="mailto:luigijhoan@gmail.com"
                className="underline decoration-dotted"
              >
                luigijhoan@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-300" /> Colombia
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-300" /> +57 ••• ••• ••••
            </li>
          </ul>
          <div className="mt-6 flex gap-3">
            <a
              className="hover:opacity-90 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"
              href="https://github.com/luigi11munar"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a
              className="hover:opacity-90 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </div>
          <div className="mt-8 rounded-xl border border-white/10 p-4 bg-black/20">
            <p className="text-sm text-slate-300">Chatbot IA en vivo:</p>
            <p className="text-xs text-slate-400">
              Pulsa el botón flotante y conversa. Requiere configurar OPENAI_API_KEY en tu
              hosting.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// =================== FOOTER ===================

function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(1000px 200px at 50% -20%, rgba(56,189,248,0.15), transparent)",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-400">
          © {new Date().getFullYear()} Luigi Jhoan Keith Ríos Munar. Todos los derechos
          reservados.
        </p>
        <div className="flex items-center gap-4 text-slate-300">
          <a href="/proyectos" className="hover:text-white">
            Proyectos
          </a>
          <a href="/cv" className="hover:text-white">
            CV
          </a>
          <a href="/contacto" className="hover:text-white">
            Contacto
          </a>
        </div>
      </div>
    </footer>
  )
}

// =================== SECTION HEADER ===================

function SectionHeader({ title, subtitle }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          <p className="text-slate-400">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}

// =================== PAGES ===================

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <SkillsConstellation />
      <ProjectsPreview />
      <Timeline />
      <Services />
      <Contact />
    </main>
  )
}

function ProyectosPage() {
  const [filter, setFilter] = useState("Todos")
  const categories = ["Todos", "Web", "IA", "Datos", "Automatización", "Otros"]

  const filtered = projects.filter((p) => {
    if (filter === "Todos") return true
    if (filter === "Web") return p.tech.includes("React") || p.tech.includes("Next.js")
    if (filter === "IA") return p.tech.includes("OpenAI") || p.tech.includes("TensorFlow")
    if (filter === "Datos") return p.tech.includes("Pandas") || p.tech.includes("Power BI")
    if (filter === "Automatización") return p.tech.includes("Selenium") || p.tech.includes("RPA")
    return true
  })

  return (
    <main className="pt-28 pb-20">
      <SectionHeader title="Galería de Proyectos" subtitle="Explora por categoría" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 rounded-full border ${filter === c ? "border-cyan-400/60 bg-white/5" : "border-white/10"
                } text-sm`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => (
            <ProjectCard key={i} p={p} />
          ))}
        </div>
      </div>
    </main>
  )
}

function CVPage() {
  return (
    <main className="pt-28 pb-20">
      <SectionHeader title="Hoja de Vida" subtitle="Interactiva y descargable" />
      <div className="max-w-5xl mx-auto px-4.grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 h-[70vh]">
          <iframe
            title="CV Luigi"
            className="w-full h-full rounded-lg"
            srcDoc={`<style>html,body{margin:0;height:100%;background:#0b1220;color:#dbeafe;font-family:Inter,system-ui}.wrap{padding:20px}</style><div class=wrap><h2>Luigi Jhoan Keith Ríos Munar</h2><p>Ingeniero de Sistemas — Desarrollo web, IA y datos.</p><ul><li>GitHub: github.com/luigi11munar</li><li>Email: luigijhoan@gmail.com</li><li>Colombia</li></ul><h3>Experiencia</h3><ul><li><b>Asistente IA WhatsApp</b> — Bot conversacional (Node+LLMs).</li><li><b>Dashboard KPIs</b> — ETL y visualización (Python+React).</li></ul><h3>Educación</h3><ul><li>Ingeniería de Sistemas</li></ul><h3>Tech</h3><p>React • Python • LLMs • SQL • RPA</p></div>`}
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6" id="download">
          <h4 className="font-semibold">Descargar</h4>
          <p className="text-sm text-slate-300">
            Obtén la versión PDF lista para ATS.
          </p>
          <a
            href={CV_PDF_URL}
            download
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-4 py-2"
          >
            <Download className="w-4 h-4" /> Descargar PDF
          </a>
          <p className="mt-6 text-sm text-slate-400">
            Tip: también puedes alojarlo en Google Drive y enlazarlo aquí.
          </p>
        </div>
      </div>
    </main>
  )
}

function BlogPage() {
  const posts = [
    { title: "Cómo integrar LLMs en tu stack", date: "Oct 2025", tag: "IA" },
    {
      title: "Patrones de arquitectura para dashboards",
      date: "Sep 2025",
      tag: "Datos",
    },
    { title: "Animaciones performantes en React", date: "Ago 2025", tag: "Web" },
  ]
  return (
    <main className="pt-28 pb-20">
      <SectionHeader title="Blog" subtitle="Ideas sobre IA, web y datos" />
      <div className="max-w-5xl mx-auto px-4 space-y-4">
        {posts.map((p, i) => (
          <article
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <h3 className="font-semibold flex items-center gap-2">
              {p.title} <span className="text-xs text-cyan-300">• {p.tag}</span>
            </h3>
            <p className="text-xs text-slate-400">{p.date}</p>
            <p className="text-sm text-slate-300 mt-1">
              Resumen del artículo… (reemplaza por tu contenido).
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}

function ContactPage() {
  return (
    <main className="pt-28 pb-20">
      <Contact />
    </main>
  )
}

// =================== SCROLL TO HASH ===================

function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [pathname, hash])
  return null
}

// =================== CHAT WIDGET ===================

function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [msgs, setMsgs] = useState([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente de Luigi. ¿En qué te ayudo?",
    },
  ])
  const [pending, setPending] = useState(false)

  async function send() {
    if (!input.trim()) return
    const me = { role: "user", content: input }
    setMsgs((m) => [...m, me])
    setInput("")
    setPending(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...msgs, me].slice(-10) }),
      })
      const data = await res.json()
      setMsgs((m) => [
        ...m,
        {
          role: "assistant",
          content: data.reply || "Configura tu API backend para respuestas reales.",
        },
      ])
    } catch (e) {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "No se pudo conectar con el servicio de IA." },
      ])
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed.bottom-5 right-5 z-50 rounded-full p-3 border border-white/10 bg-gradient-to-r from-cyan-500 to-fuchsia-600 shadow-xl"
      >
        <Sparkles className="w-5 h-5" />
      </button>
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur p-3">
          <div className="text-sm font-semibold mb-2">Asistente IA</div>
          <div className="h-56 overflow-y-auto space-y-2 pr-1">
            {msgs.map((m, i) => (
              <div key={i} className={`text-sm ${m.role === "user" ? "text-right" : ""}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-xl ${m.role === "user"
                      ? "bg-white/10"
                      : "bg-cyan-500/10 border border-cyan-500/30"
                    }`}
                >
                  {m.content}
                </span>
              </div>
            ))}
            {pending && <p className="text-xs text-slate-400">Pensando…</p>}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm"
              placeholder="Escribe un mensaje"
            />
            <button
              onClick={send}
              className="px-3 rounded-lg bg-gradient.to-r from-cyan-500 to-fuchsia-600 text-sm"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// =================== APP ROOT COMPONENT ===================
// =================== APP ROOT COMPONENT ===================

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(id);
  }, []);

  return (
    <ThemeProvider>
      <AppShell>
        {/* 🔮 Fondo líquido fijo atrás de todo */}
        <LiquidChrome
          className="fixed inset-0 -z-30 opacity-95"
          baseColor={[0.3, 0.0, 0.4]}
          speed={0.3}
          amplitude={0.3}
          frequencyX={3}
          frequencyY={3}
          interactive={true}
        />

        {/* 💧 Fluido siguiendo el cursor encima del fondo */}
        <SplashCursor
          DYE_RESOLUTION={1440}
          COLOR_UPDATE_SPEED={10}
          BACK_COLOR={{ r: 0.3, g: 0.0, b: 0.4 }}
          SHADING={true}
          TRANSPARENT={true}
        />

        {/* Loader inicial */}
        {loading && <Loader />}

        {/* Router de toda la app */}
        <BrowserRouter>
          <Navbar />
          <ScrollToHash />

          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/proyectos" element={<ProyectosPage />} />
              <Route path="/cv" element={<CVPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/contacto" element={<ContactPage />} />
            </Routes>
          </AnimatePresence>

          <Footer />
          <ChatWidget />
        </BrowserRouter>
      </AppShell>
    </ThemeProvider>
  );
}

export default App;


// =================== TESTS BÁSICOS ===================

function runTests() {
  console.assert(typeof validateFields === "function", "validateFields existe")
  console.assert(typeof getFormspreeId === "function", "getFormspreeId existe")
  const e1 = validateFields({ name: "", email: "", message: "" })
  console.assert(e1.name && e1.email && e1.message, "valida campos vacíos")
  const e2 = validateFields({
    name: "Luigi",
    email: "test@example.com",
    message: "Hola mundo!!!",
  })
  console.assert(Object.keys(e2).length === 0, "valida campos correctos")
  const id = getFormspreeId()
  console.assert(id === null || typeof id === "string", "id válido o nulo")
}
runTests()

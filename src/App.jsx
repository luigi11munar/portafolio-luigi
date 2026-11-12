// =============== src/App.jsx ===============
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  Server,
  Database,
  Cpu,
  Workflow,
  GitBranch,
  ShieldCheck,
  Users,
  FileDown,
  Sun,
  Moon,
  Menu,
  X,
  MapPin,
  Phone,
  GraduationCap,
  Briefcase,
  BrainCircuit,
  Scale,
  Smartphone,
  ArrowUpRight,
  ChevronDown,
  Send,
  Award,
  ArrowUp,
} from "lucide-react";

import ProfileCard from "./components/ProfileCard";
import SplashCursor from "./components/SplashCursor";
import profileImage from "./assets/luigi-foto.webp";
import "./index.css";

// =================== DATOS (fuente: CV) ===================

const CONTACT = {
  email: "riosmunar_luigi@hotmail.com",
  phone: "+57 317 725 9443",
  phoneHref: "tel:+573177259443",
  city: "Bogotá D.C., Colombia",
  github: "https://github.com/luigi11munar",
  linkedin: "https://www.linkedin.com/in/luigi-jhoan-keith-rios-munar-145319174",
  cv: "/cv-luigi-rios.pdf",
};

const NAV = [
  { id: "about", label: "Sobre mí" },
  { id: "skills", label: "Habilidades" },
  { id: "projects", label: "Proyectos" },
  { id: "experience", label: "Experiencia" },
  { id: "contact", label: "Contacto" },
];

const ROLES = ["Full Stack Developer", "Integración de APIs", "Datos & IA", "Automatización"];

const STATS = [
  { value: "3", label: "Proyectos destacados" },
  { value: "3", label: "Experiencias profesionales" },
  { value: "~100", label: "Estudiantes formados" },
  { value: "4", label: "Cursos y certificaciones" },
];

const SKILL_GROUPS = [
  {
    title: "Frontend",
    icon: Code2,
    items: ["React", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Angular"],
  },
  {
    title: "Backend y APIs",
    icon: Server,
    items: ["Python", "FastAPI", "Flask / Django", "Node.js", "Spring Boot", "REST", "OpenAPI", "JWT / OAuth2"],
  },
  {
    title: "Bases de datos",
    icon: Database,
    items: ["PostgreSQL", "MySQL", "Oracle", "SQL Server", "MongoDB", "Redis"],
  },
  {
    title: "Datos e IA",
    icon: BrainCircuit,
    items: ["Power BI", "Excel avanzado", "Pandas", "NumPy", "Jupyter", "Scikit-learn", "Agentes de IA", "APIs de IA"],
  },
  {
    title: "DevOps",
    icon: GitBranch,
    items: ["Git", "GitHub", "GitLab", "Docker", "Linux", "CI/CD", "Kubernetes (básico)"],
  },
  {
    title: "Seguridad",
    icon: ShieldCheck,
    items: ["OWASP", "Nmap", "Wireshark", "Análisis básico de vulnerabilidades"],
  },
  {
    title: "Lenguajes",
    icon: Cpu,
    items: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "R", "Bash"],
  },
  {
    title: "Metodologías y herramientas",
    icon: Workflow,
    items: ["Scrum", "Kanban", "Postman", "VS Code", "Jira", "Trello", "Inglés B1"],
  },
];

const SOFT_SKILLS = [
  "Comunicación asertiva",
  "Pensamiento analítico",
  "Resolución de problemas",
  "Trabajo en equipo",
  "Gestión del tiempo",
  "Adaptabilidad",
  "Proactividad",
  "Liderazgo",
  "Atención al detalle",
];

const TECH_LOGOS = [
  ["Python", "python/python-original"],
  ["Java", "java/java-original"],
  ["JavaScript", "javascript/javascript-original"],
  ["TypeScript", "typescript/typescript-original"],
  ["React", "react/react-original"],
  ["Next.js", "nextjs/nextjs-original"],
  ["Node.js", "nodejs/nodejs-original"],
  ["FastAPI", "fastapi/fastapi-original"],
  ["PostgreSQL", "postgresql/postgresql-original"],
  ["MongoDB", "mongodb/mongodb-original"],
  ["Docker", "docker/docker-original"],
  ["Git", "git/git-original"],
].map(([name, path]) => ({
  name,
  src: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${path}.svg`,
}));

// Campos opcionales por proyecto (se muestran solo si existen):
//   image:      "/projects/archivo.png|gif|webp"  → captura o GIF real (carpeta public/projects)
//   repo:       "https://github.com/..."          → botón "Código"
//   stack:      ["Python", "FastAPI", ...]        → tecnologías reales usadas
//   highlights: ["Resultado o reto técnico", ...] → 1 o 2 logros concretos
const PROJECTS = [
  {
    title: "Sistema multiagente y multimodal de apoyo en salud mental",
    desc: "Diseño e implementación de un prototipo de sistema multiagente y multimodal para la asistencia y el apoyo a pacientes diagnosticados con trastornos mentales.",
    tags: ["IA", "Multiagente", "Multimodal"],
    image: "/projects/salud-mental-multiagente.jpg",
    icon: BrainCircuit,
    gradient: "from-cyan-500/30 via-indigo-500/20 to-fuchsia-500/30",
    featured: true,
  },
  {
    title: "Gestión de reclamaciones de seguros de vida",
    desc: "Plataforma con IA para gestionar reclamaciones de seguros de vida y controlar los plazos legales.",
    tags: ["IA", "Seguros", "Plazos legales"],
    image: "/projects/reclamaciones-seguros.jpg",
    links: [
      { label: "Canal de radicación", href: "https://gsv-web.livelyocean-d1f9a4a6.eastus2.azurecontainerapps.io" },
      { label: "Panel del analista", href: "https://gsv-web.livelyocean-d1f9a4a6.eastus2.azurecontainerapps.io/panel/login" },
    ],
    icon: Scale,
    gradient: "from-indigo-500/30 via-violet-500/20 to-cyan-500/20",
  },
  {
    title: "Caudal",
    desc: "App móvil para dominar tus finanzas y hábitos.",
    tags: ["App móvil", "Finanzas", "Hábitos"],
    image: "/projects/caudal.jpg",
    links: [{ label: "Ver app", href: "https://app-finance.expo.app" }],
    icon: Smartphone,
    gradient: "from-emerald-500/25 via-cyan-500/20 to-indigo-500/30",
  },
];

const EXPERIENCE = [
  {
    company: "Institución Educativa San Lucas",
    role: "Docente de Matemáticas, Programación y TIC",
    period: "Oct 2024 – Oct 2025",
    place: "Santa Rosa del Sur, Bolívar",
    points: [
      "Integré pensamiento computacional y herramientas digitales para fortalecer la lógica y la resolución de problemas.",
      "Gestioné 6 grupos (~100 estudiantes) con evaluación por competencias y metodologías activas.",
      "Elaboré reportes mensuales de rendimiento por estudiante para la toma de decisiones pedagógicas.",
    ],
  },
  {
    company: "JLP Sports Suplement",
    role: "Desarrollador Freelance · Automatización, Inventario y BI",
    period: "Feb 2023 – Ago 2023",
    place: "Santa Rosa del Sur, Bolívar",
    points: [
      "Desarrollé una página web de catálogo digital de productos para facilitar consulta y disponibilidad.",
      "Implementé control y trazabilidad de inventario con Excel y Power BI, reduciendo errores por gestión manual.",
      "Construí dashboards con indicadores de inventario y rotación, y generé reportes semanales y mensuales.",
    ],
  },
  {
    company: "Fundessub",
    role: "Formador TIC e IA",
    period: "Abr 2022 – Oct 2022",
    place: "Santa Rosa del Sur, Bolívar",
    points: [
      "Diseñé e impartí talleres prácticos de TIC con enfoque en automatización y soluciones digitales.",
      "Hice seguimiento al progreso de los participantes y documenté avances y oportunidades de mejora.",
    ],
  },
];

const COURSES = [
  { org: "SENA", name: "Construcción de bases de datos con MySQL · Análisis exploratorio con Python" },
  { org: "MinTIC", name: "Análisis de datos · Ciberseguridad · Inteligencia Artificial" },
  { org: "Oracle", name: "Database Foundations" },
  { org: "CertiProf", name: "Scrum Foundation Professional Certificate (SFPC™)" },
];

// =================== TEMA ===================

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    try {
      const stored = localStorage.getItem("luigi_theme");
      if (stored) return stored === "dark";
    } catch {
      /* sin acceso a localStorage */
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("luigi_theme", isDark ? "dark" : "light");
    } catch {
      /* sin acceso a localStorage */
    }
  }, [isDark]);

  return [isDark, setIsDark];
}

// =================== UTILIDADES UI ===================

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};

function Container({ children, className = "" }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <motion.div {...fadeUp} className="mb-10 md:mb-14 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gradient">{eyebrow}</p>
      <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-muted leading-relaxed">{subtitle}</p>}
    </motion.div>
  );
}

// =================== SCROLL: sección activa, progreso, volver arriba ===================

function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const visible = new Map();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setActive(best && best[1] > 0 ? best[0] : "");
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 inset-x-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500"
    />
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Volver arriba"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          className="btn btn-primary fixed bottom-5 right-5 z-50 !p-3"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}

const NAV_IDS = ["about", "skills", "projects", "experience", "contact"];

// =================== NAVBAR ===================

function Navbar({ isDark, setIsDark }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const themeButton = (
    <button
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      onClick={() => setIsDark((v) => !v)}
      className="btn btn-ghost !p-2.5"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? "border-b backdrop-blur-xl" : "border-b border-transparent"
      }`}
      style={scrolled || open ? { background: "color-mix(in srgb, var(--bg) 80%, transparent)", borderColor: "var(--border)" } : undefined}
    >
      <Container>
        <nav className="h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2 font-display font-bold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 text-white text-sm">
              LR
            </span>
            <span className="hidden sm:inline">Luigi Ríos</span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            {NAV.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={`relative py-1 text-sm transition ${
                  active === l.id ? "text-[var(--text)] font-medium" : "text-muted hover:text-[var(--text)]"
                }`}
              >
                {l.label}
                {active === l.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                  />
                )}
              </a>
            ))}
            {themeButton}
            <a href="#contact" className="btn btn-primary !py-2">
              Hablemos
            </a>
          </div>

          <div className="md:hidden flex items-center gap-2">
            {themeButton}
            <button
              aria-label="Abrir menú"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="btn btn-ghost !p-2.5"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 flex flex-col">
                {NAV.map((l) => (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    onClick={() => setOpen(false)}
                    className={`py-3 text-base border-t ${active === l.id ? "text-[var(--accent)] font-medium" : ""}`}
                    style={{ borderColor: "var(--border)" }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}

// =================== HERO ===================

function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative pt-28 md:pt-36 pb-16 md:pb-24">
      <Container className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-8 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="chip">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Disponible para nuevos retos
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
            Hola, soy <span className="text-gradient">Luigi Ríos</span>
          </h1>

          <div className="mt-3 h-9 sm:h-10 overflow-hidden text-xl sm:text-2xl font-display font-semibold">
            <AnimatePresence mode="wait">
              <motion.p
                key={ROLES[index]}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {ROLES[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <p className="mt-5 max-w-xl text-muted leading-relaxed">
            Ingeniero de Sistemas orientado al desarrollo de software: construyo soluciones Full Stack,
            integro APIs, modelo bases de datos y automatizo procesos, cuidando tanto el código como la
            experiencia de uso.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              Ver proyectos <ArrowUpRight className="w-4 h-4" />
            </a>
            <a href={CONTACT.cv} download="CV-Luigi-Rios.pdf" className="btn btn-ghost">
              <FileDown className="w-4 h-4" /> Descargar CV
            </a>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {[
              { href: CONTACT.github, label: "GitHub", Icon: Github, external: true },
              { href: CONTACT.linkedin, label: "LinkedIn", Icon: Linkedin, external: true },
              { href: `mailto:${CONTACT.email}`, label: "Email", Icon: Mail },
            ].map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="btn btn-ghost !p-3"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex justify-center"
        >
          <ProfileCard
            avatarUrl={profileImage}
            miniAvatarUrl={profileImage}
            name="Luigi Ríos Munar"
            title="Ingeniero de Sistemas"
            handle="luigi11munar"
            status="Full Stack"
            contactText="Contactar"
            onContactClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          />
        </motion.div>
      </Container>

      <Container className="mt-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.07 }} className="card p-4 md:p-5">
              <p className="font-display text-3xl font-bold text-gradient">{s.value}</p>
              <p className="mt-1 text-xs md:text-sm text-muted">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>

      <a
        href="#about"
        aria-label="Bajar a la siguiente sección"
        className="hidden md:flex mt-12 justify-center text-muted hover:text-[var(--text)]"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </a>
    </section>
  );
}

// =================== SOBRE MÍ ===================

function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Sobre mí"
          title="Tecnología con criterio de producto"
          subtitle="Analizo requerimientos, desarrollo Frontend y Backend, integro servicios y optimizo soluciones según las necesidades del negocio."
        />
        <div className="grid lg:grid-cols-3 gap-5">
          <motion.div {...fadeUp} className="card p-6 lg:col-span-2">
            <p className="leading-relaxed">
              Soy <b>Ingeniero de Sistemas</b> (Universidad de Pamplona, 2025) con experiencia en la
              construcción de soluciones tecnológicas, desarrollo Full Stack, integración de APIs, manejo de
              bases de datos y automatización de procesos.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              Soy un profesional proactivo, analítico y orientado a resultados, con facilidad para aprender
              nuevas tecnologías, resolver problemas y trabajar bajo metodologías ágiles, tanto de forma
              autónoma como en equipo.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {SOFT_SKILLS.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="card p-6">
            <div className="flex items-center gap-2 font-display font-semibold">
              <GraduationCap className="w-5 h-5 text-[var(--accent)]" /> Educación
            </div>
            <p className="mt-4 font-medium">Ingeniería de Sistemas</p>
            <p className="text-sm text-muted">Universidad de Pamplona · 2025</p>
            <div className="mt-5 flex items-center gap-2 font-display font-semibold">
              <Users className="w-5 h-5 text-[var(--accent)]" /> Idiomas
            </div>
            <p className="mt-2 text-sm text-muted">Español nativo · Inglés B1</p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// =================== HABILIDADES ===================

function Skills() {
  return (
    <section id="skills" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Stack"
          title="Habilidades técnicas"
          subtitle="Un stack completo para llevar una idea desde la interfaz hasta la base de datos y el despliegue."
        />

        <motion.div {...fadeUp} className="card p-4 md:p-5 mb-6">
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {TECH_LOGOS.map((t) => (
              <li
                key={t.name}
                className="flex flex-col items-center gap-2 rounded-xl py-3 border transition hover:-translate-y-0.5"
                style={{ borderColor: "var(--border)" }}
              >
                <img src={t.src} alt="" className="h-8 w-8 object-contain" loading="lazy" />
                <span className="text-xs text-muted">{t.name}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILL_GROUPS.map((g, i) => (
            <motion.div
              key={g.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: (i % 4) * 0.06 }}
              className="card card-hover p-5"
            >
              <div className="flex items-center gap-2 font-display font-semibold">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--glow-1)] text-[var(--accent)]">
                  <g.icon className="w-4 h-4" />
                </span>
                {g.title}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {g.items.map((it) => (
                  <span key={it} className="chip !text-[0.72rem] !py-1">
                    {it}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// =================== PROYECTOS ===================

function ProjectCard({ p, index }) {
  const ref = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useTransform(mx, [0, 1], [-7, 7]);
  const rotateX = useTransform(my, [0, 1], [7, -7]);
  const glare = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.10), transparent 60%)`
  );

  function onMove(e) {
    if (e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay: index * 0.08 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`group card card-hover relative overflow-hidden flex flex-col ${p.featured ? "lg:col-span-2 lg:flex-row" : ""}`}
    >
      <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 z-10" />
      {/* Vista previa: imagen a todo el ancho; sin imagen, marco de navegador con degradado */}
      {p.image ? (
        <div className={`relative aspect-[4/3] overflow-hidden ${p.featured ? "lg:aspect-auto lg:w-1/2 lg:shrink-0" : ""}`}>
          <img
            src={p.image}
            alt={`Vista previa de ${p.title}`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>
      ) : (
        <div className={`relative bg-gradient-to-br ${p.gradient} p-3 md:p-4`}>
          <div
            className="overflow-hidden rounded-xl border shadow-lg"
            style={{ borderColor: "var(--border)", background: "var(--surface-strong)" }}
          >
            <div className="flex items-center gap-1.5 px-3 py-2 border-b" style={{ borderColor: "var(--border)" }}>
              <span className="h-2 w-2 rounded-full bg-rose-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </div>
            <div className="relative aspect-[16/8] grid place-items-center">
              <p.icon className="w-12 h-12 text-muted opacity-60" strokeWidth={1.2} />
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 flex flex-col flex-1 ${p.featured ? "lg:p-10 lg:justify-center" : ""}`}>
        <h3 className="text-xl font-semibold leading-snug">{p.title}</h3>
        <p className="mt-2 text-muted leading-relaxed">{p.desc}</p>

        {p.highlights?.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {(p.stack ?? p.tags).map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>

        {(p.links || p.repo) && (
          <div className="mt-auto pt-5 flex flex-wrap gap-2">
            {p.links?.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn-primary !py-2 !px-4 !text-[0.82rem]">
                {l.label} <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ))}
            {p.repo && (
              <a href={p.repo} target="_blank" rel="noreferrer" className="btn btn-ghost !py-2 !px-4 !text-[0.82rem]">
                <Github className="w-3.5 h-3.5" /> Código
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Trabajo"
          title="Proyectos destacados"
          subtitle="Soluciones donde combino desarrollo de software, inteligencia artificial y experiencia de usuario."
        />
        <div className="grid lg:grid-cols-2 gap-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} p={p} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

// =================== EXPERIENCIA ===================

function Experience() {
  return (
    <section id="experience" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Trayectoria"
          title="Experiencia profesional"
          subtitle="Desarrollo, datos y formación: tres frentes donde he aplicado la tecnología a problemas reales."
        />

        <ol className="relative ms-3 md:ms-4 border-s" style={{ borderColor: "var(--border)" }}>
          {EXPERIENCE.map((e, i) => (
            <motion.li key={e.company} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }} className="mb-8 ms-6 md:ms-8">
              <span className="absolute -start-[7px] mt-6 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 ring-4 ring-[var(--bg)]" />
              <div className="card card-hover p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[var(--accent)]" /> {e.company}
                    </h3>
                    <p className="text-sm text-muted">{e.role}</p>
                  </div>
                  <div className="text-right text-xs text-muted">
                    <p className="font-semibold text-[var(--accent)]">{e.period}</p>
                    <p>{e.place}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  {e.points.map((pt) => (
                    <li key={pt} className="flex gap-2">
                      <span className="mt-2 h-1 w-3 shrink-0 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.div {...fadeUp} className="mt-6">
          <h3 className="flex items-center gap-2 font-display font-semibold mb-4">
            <Award className="w-5 h-5 text-[var(--accent)]" /> Cursos y certificaciones
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {COURSES.map((c) => (
              <div key={c.org} className="card p-4">
                <p className="font-semibold">{c.org}</p>
                <p className="text-sm text-muted">{c.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

// =================== CONTACTO ===================

function validateFields(form) {
  const e = {};
  if (!form.name.trim()) e.name = "Tu nombre es requerido";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Ingresa un email válido";
  if (form.message.trim().length < 10) e.message = "Cuéntame un poco más (mínimo 10 caracteres)";
  return e;
}

const RAW_FORMSPREE_ID = (import.meta.env.VITE_FORMSPREE_ID || "").trim();
// Ignora valores vacíos o de relleno ("null", "undefined") para no enviar a una URL inválida.
const FORMSPREE_ID = ["", "null", "undefined"].includes(RAW_FORMSPREE_ID) ? "" : RAW_FORMSPREE_ID;

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function submit(ev) {
    ev.preventDefault();
    const e = validateFields(form);
    setErrors(e);
    if (Object.keys(e).length) return;

    // Sin Formspree configurado: abre el cliente de correo (no depende de ningún backend).
    if (!FORMSPREE_ID) {
      const subject = encodeURIComponent(`Contacto desde el portafolio · ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("send");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const field = (key, label, props = {}) => (
    <div>
      <label htmlFor={key} className="text-sm font-medium">
        {label}
      </label>
      {key === "message" ? (
        <textarea
          id={key}
          rows={5}
          className="input"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      ) : (
        <input
          id={key}
          className="input"
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          {...props}
        />
      )}
      {errors[key] && <p className="mt-1 text-xs text-rose-400">{errors[key]}</p>}
    </div>
  );

  const info = [
    { Icon: Mail, text: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { Icon: Phone, text: CONTACT.phone, href: CONTACT.phoneHref },
    { Icon: MapPin, text: CONTACT.city },
  ];

  return (
    <section id="contact" className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="Contacto"
          title="Construyamos algo juntos"
          subtitle="¿Tienes un proyecto, una vacante o una idea? Escríbeme y te respondo pronto."
        />
        <div className="grid md:grid-cols-5 gap-5">
          <motion.form {...fadeUp} onSubmit={submit} noValidate className="card p-6 md:col-span-3 space-y-4">
            {field("name", "Nombre", { autoComplete: "name" })}
            {field("email", "Email", { type: "email", autoComplete: "email" })}
            {field("message", "Mensaje")}
            <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-60">
              <Send className="w-4 h-4" /> {status === "sending" ? "Enviando…" : "Enviar mensaje"}
            </button>
            <p role="status" className="text-sm min-h-5">
              {status === "sent" && <span className="text-emerald-400">¡Gracias! Te responderé pronto.</span>}
              {status === "error" && (
                <span className="text-rose-400">
                  No se pudo enviar. Escríbeme directamente a {CONTACT.email}.
                </span>
              )}
            </p>
          </motion.form>

          <motion.div {...fadeUp} className="card p-6 md:col-span-2 flex flex-col">
            <h3 className="font-display font-semibold text-lg">Conéctate</h3>
            <ul className="mt-5 space-y-4 text-sm">
              {info.map(({ Icon, text, href }) => (
                <li key={text} className="flex items-center gap-3 min-w-0">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--glow-1)] text-[var(--accent)]">
                    <Icon className="w-4 h-4" />
                  </span>
                  {href ? (
                    <a href={href} className="truncate hover:text-[var(--accent)]">
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-6 flex flex-wrap gap-3">
              <a href={CONTACT.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

// =================== FOOTER ===================

function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <Container className="py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>© {new Date().getFullYear()} Luigi Jhoan Keith Ríos Munar. Todos los derechos reservados.</p>
        <div className="flex items-center gap-5">
          {NAV.slice(0, 4).map((l) => (
            <a key={l.id} href={`#${l.id}`} className="hover:text-[var(--text)]">
              {l.label}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}

// =================== APP ===================

// El fluido del cursor solo tiene sentido con mouse y sin "reducir movimiento".
const SHOW_SPLASH =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function App() {
  const [isDark, setIsDark] = useTheme();

  return (
    <>
      <div className="bg-scene" aria-hidden="true" />
      {SHOW_SPLASH && (
        <SplashCursor DYE_RESOLUTION={1024} BACK_COLOR={{ r: 0.3, g: 0.0, b: 0.4 }} TRANSPARENT />
      )}
      <ScrollProgress />
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

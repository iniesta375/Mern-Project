import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Pill, ShieldCheck, Heart, BarChart3, ChevronRight,
  Bell, Clock, CheckCircle2, Star, ArrowRight,
  Smartphone, FileText, Users
} from 'lucide-react';
import { LogoWithText } from '../components/Logo';

/* ── Reusable fade-in-up on scroll ─────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter ───────────────────────────────────────────── */
function StatCard({ value, label, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="display-5 fw-bold text-success mb-1"
      >
        {value}{suffix}
      </motion.div>
      <p className="text-secondary small mb-0">{label}</p>
    </div>
  );
}

/* ── Data ───────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Bell,
    title: 'Smart Reminders',
    desc: 'Get notified at exactly the right time — never miss a dose again, no matter how busy your schedule.',
    color: 'bg-success bg-opacity-10 text-success',
  },
  {
    icon: Heart,
    title: 'Wellness Tracking',
    desc: 'Log your mood and energy levels daily to see how your medication routine impacts your overall wellbeing.',
    color: 'bg-danger bg-opacity-10 text-danger',
  },
  {
    icon: BarChart3,
    title: 'Adherence Reports',
    desc: 'Generate detailed PDF reports of your medication history — perfect for your next doctor visit.',
    color: 'bg-primary bg-opacity-10 text-primary',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Private',
    desc: 'Your health data is encrypted and never shared. You are always in full control of your information.',
    color: 'bg-warning bg-opacity-10 text-warning',
  },
  {
    icon: Users,
    title: 'Caregiver Access',
    desc: 'Add a trusted caregiver who gets alerts if you miss a dose — great for elderly patients or busy families.',
    color: 'bg-info bg-opacity-10 text-info',
  },
  {
    icon: FileText,
    title: 'Prescription History',
    desc: 'Keep a complete log of all past and current medications with dosage details in one organised place.',
    color: 'bg-secondary bg-opacity-10 text-secondary',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create your account',
    desc: 'Sign up in under a minute — no credit card needed.',
    icon: Smartphone,
  },
  {
    step: '02',
    title: 'Add your medications',
    desc: 'Enter your prescriptions, dosage, and schedule.',
    icon: Pill,
  },
  {
    step: '03',
    title: 'Get timely reminders',
    desc: 'Receive notifications and mark doses as taken.',
    icon: Bell,
  },
  {
    step: '04',
    title: 'Track your progress',
    desc: 'View adherence stats and share reports with your doctor.',
    icon: BarChart3,
  },
];

const TESTIMONIALS = [
  {
    name: 'Adaeze Okafor',
    role: 'Managing hypertension',
    location: 'Lagos, Nigeria',
    quote: 'MediWell has completely changed how I manage my blood pressure medication. I haven\'t missed a dose in three months!',
    rating: 5,
  },
  {
    name: 'Emeka Nwosu',
    role: 'Caregiver for elderly parent',
    location: 'Abuja, Nigeria',
    quote: 'I use MediWell for my mother\'s diabetes medication. The caregiver alerts give me peace of mind when I\'m at work.',
    rating: 5,
  },
  {
    name: 'Dr. Funmi Adeyemi',
    role: 'General Practitioner',
    location: 'Ibadan, Nigeria',
    quote: 'I recommend MediWell to all my chronic patients. The adherence reports they bring to appointments are incredibly useful.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>

      <section className="position-relative py-5 overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0f9ff 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center' }}>

        <div className="position-absolute top-0 end-0 opacity-25 d-none d-lg-block" style={{ width: '480px', height: '480px', background: 'radial-gradient(circle, #86efac 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />
        <div className="position-absolute bottom-0 start-0 opacity-15 d-none d-lg-block" style={{ width: '360px', height: '360px', background: 'radial-gradient(circle, #6ee7b7 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />

        <div className="container position-relative">
          <div className="row align-items-center g-5">

            <div className="col-lg-6">
              <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 mb-4 d-inline-flex align-items-center gap-2">
                  <span className="rounded-circle bg-success d-inline-block" style={{ width: '6px', height: '6px' }} />
                  Now available across Nigeria 🇳🇬
                </span>

                <h1 className="fw-bold text-dark mb-4" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', lineHeight: 1.15 }}>
                  Never Miss a <br />
                  <span className="text-success position-relative">
                    Dose Again
                    <svg className="position-absolute w-100" style={{ bottom: '-4px', left: 0, height: '6px' }} viewBox="0 0 200 6" preserveAspectRatio="none">
                      <path d="M0 5 Q50 0 100 4 Q150 8 200 3" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                    </svg>
                  </span>
                </h1>

                <p className="lead text-secondary mb-5" style={{ maxWidth: '480px', lineHeight: 1.75 }}>
                  MediWell helps Nigerians stay consistent with their prescriptions — smart reminders, wellness tracking, and doctor-ready reports, all in one place.
                </p>

                <div className="d-flex flex-column flex-sm-row gap-3 mb-5">
                  <Link to="/register" className="btn btn-success btn-lg px-5 py-3 rounded-3 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2">
                    Get Started Free
                    <ChevronRight size={20} />
                  </Link>
                  <Link to="/login" className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-3 fw-bold">
                    Sign In
                  </Link>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-4">
                  {[
                    { icon: ShieldCheck, label: 'HIPAA-style privacy' },
                    { icon: Clock, label: 'Setup in 2 minutes' },
                    { icon: CheckCircle2, label: 'Free forever plan' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="d-flex align-items-center gap-2 text-secondary small">
                      <Icon size={15} className="text-success" />
                      {label}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="col-lg-6 d-none d-lg-block">
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: 8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ perspective: '1000px' }}
              >
                <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ background: '#fff' }}>
                  <div className="px-4 pt-4 pb-3 border-bottom d-flex align-items-center justify-content-between" style={{ background: '#f8fafc' }}>
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle bg-success d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                        <Pill size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="fw-bold text-dark mb-0 small">Good morning, Adaeze 👋</p>
                        <p className="text-secondary mb-0" style={{ fontSize: '11px' }}>3 doses scheduled today</p>
                      </div>
                    </div>
                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill small">87% this week</span>
                  </div>

                  <div className="p-3">
                    {[
                      { name: 'Lisinopril 10mg', time: '08:00 AM', taken: true },
                      { name: 'Metformin 500mg', time: '01:00 PM', taken: false },
                      { name: 'Vitamin D3', time: '08:00 PM', taken: false },
                    ].map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                        className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-2"
                        style={{ background: med.taken ? '#f0fdf4' : '#f8fafc' }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center ${med.taken ? 'bg-success' : 'bg-light'}`} style={{ width: '36px', height: '36px' }}>
                            {med.taken
                              ? <CheckCircle2 size={18} className="text-white" />
                              : <Pill size={18} className="text-secondary" />}
                          </div>
                          <div>
                            <p className="fw-bold text-dark mb-0 small">{med.name}</p>
                            <p className="text-secondary mb-0" style={{ fontSize: '11px' }}>{med.time}</p>
                          </div>
                        </div>
                        {med.taken
                          ? <span className="badge bg-success bg-opacity-10 text-success rounded-pill" style={{ fontSize: '11px' }}>Taken</span>
                          : <span className="badge bg-light text-secondary rounded-pill border" style={{ fontSize: '11px' }}>Pending</span>}
                      </motion.div>
                    ))}

                    {/* Mini adherence bar */}
                    <div className="mt-3 p-3 rounded-3 border" style={{ background: '#f8fafc' }}>
                      <div className="d-flex justify-content-between small mb-2">
                        <span className="text-secondary fw-bold">Weekly adherence</span>
                        <span className="text-success fw-bold">87%</span>
                      </div>
                      <div className="rounded-pill overflow-hidden" style={{ height: '8px', background: '#e2e8f0' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '87%' }}
                          transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
                          className="h-100 rounded-pill bg-success"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-5 border-top border-bottom" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {[
              { value: '12,000+', label: 'Nigerians using MediWell', suffix: '' },
              { value: '94%',     label: 'Average adherence rate',   suffix: '' },
              { value: '3M+',     label: 'Doses tracked to date',    suffix: '' },
              { value: '4.9',     label: 'Average user rating',      suffix: '★' },
            ].map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <FadeUp delay={i * 0.1}>
                  <StatCard value={s.value} label={s.label} suffix={s.suffix} />
                </FadeUp>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <FadeUp>
            <div className="text-center mb-5">
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 mb-3">Features</span>
              <h2 className="fw-bold text-dark mb-3" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                Everything you need for better health
              </h2>
              <p className="text-secondary mx-auto" style={{ maxWidth: '560px', lineHeight: 1.75 }}>
                MediWell is built specifically for the Nigerian context — from network-friendly design to caregiver alerts for multi-generational homes.
              </p>
            </div>
          </FadeUp>

          <div className="row g-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="col-md-6 col-lg-4">
                <FadeUp delay={i * 0.08}>
                  <div className="card h-100 border-0 shadow-sm p-4 rounded-4" style={{ transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div className={`rounded-3 d-flex align-items-center justify-content-center mb-4 ${f.color}`} style={{ width: '52px', height: '52px' }}>
                      <f.icon size={24} />
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-2">{f.title}</h3>
                    <p className="text-secondary mb-0" style={{ lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </FadeUp>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" style={{ background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)' }}>
        <div className="container py-4">
          <FadeUp>
            <div className="text-center mb-5">
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 mb-3">How it works</span>
              <h2 className="fw-bold text-dark mb-3" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                Up and running in minutes
              </h2>
              <p className="text-secondary mx-auto" style={{ maxWidth: '480px' }}>
                No complicated setup. Just four simple steps to a healthier, more consistent you.
              </p>
            </div>
          </FadeUp>

          <div className="row g-4 position-relative">
            <div className="d-none d-lg-block position-absolute top-50 start-0 w-100" style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #bbf7d0, #86efac, #bbf7d0, transparent)', zIndex: 0, marginTop: '-24px' }} />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="col-sm-6 col-lg-3">
                <FadeUp delay={i * 0.12}>
                  <div className="text-center position-relative" style={{ zIndex: 1 }}>
                    <div className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center bg-white border border-2 border-success shadow-sm" style={{ width: '72px', height: '72px' }}>
                      <step.icon size={28} className="text-success" />
                    </div>
                    <span className="fw-bold text-success small d-block mb-1">{step.step}</span>
                    <h4 className="fw-bold text-dark mb-2">{step.title}</h4>
                    <p className="text-secondary small mb-0" style={{ lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </FadeUp>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <FadeUp>
            <div className="text-center mb-5">
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 mb-3">Testimonials</span>
              <h2 className="fw-bold text-dark mb-3" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                Loved by Nigerians across the country
              </h2>
            </div>
          </FadeUp>

          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="col-md-4">
                <FadeUp delay={i * 0.1}>
                  <div className="card h-100 border-0 shadow-sm p-4 rounded-4">
                    {/* Stars */}
                    <div className="d-flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} size={16} className="text-warning" fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-dark mb-4" style={{ lineHeight: 1.75, fontStyle: 'italic' }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="d-flex align-items-center gap-3 mt-auto">
                      <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center fw-bold text-success" style={{ width: '44px', height: '44px', fontSize: '16px' }}>
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="fw-bold text-dark mb-0 small">{t.name}</p>
                        <p className="text-secondary mb-0" style={{ fontSize: '12px' }}>{t.role} · {t.location}</p>
                      </div>
                    </div>
                  </div>
                </FadeUp>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-4">
          <FadeUp>
            <div className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #0d9488 100%)' }}>
              <div className="position-absolute" style={{ width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', top: '-100px', right: '-80px' }} />
              <div className="position-absolute" style={{ width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', bottom: '-60px', right: '80px' }} />
              <div className="position-absolute end-0 bottom-0 opacity-10 d-none d-md-block pe-4 pb-2">
                <ShieldCheck size={260} />
              </div>

              <div className="row position-relative" style={{ zIndex: 1 }}>
                <div className="col-lg-7">
                  <span className="badge rounded-pill bg-white bg-opacity-25 text-white px-3 py-2 mb-4 d-inline-block">
                    Start today — it&apos;s free
                  </span>
                  <h2 className="fw-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.2 }}>
                    Take control of your health journey today
                  </h2>
                  <p className="mb-5 opacity-75" style={{ maxWidth: '480px', lineHeight: 1.75 }}>
                    Join thousands of Nigerians who have improved their medication adherence with MediWell. Your health is your wealth — protect it.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3">
                    <Link to="/register" className="btn btn-light btn-lg px-5 py-3 fw-bold text-success rounded-3 d-flex align-items-center justify-content-center gap-2">
                      Create Free Account
                      <ArrowRight size={20} />
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3 fw-bold rounded-3">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <footer className="py-5 border-top" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <LogoWithText size={28} fontSize="1.2rem" />
              <p className="text-secondary small mt-3 mb-0" style={{ maxWidth: '260px', lineHeight: 1.7 }}>
                Helping Nigerians stay consistent with their medication, one dose at a time.
              </p>
            </div>
            <div className="col-6 col-md-2">
              <p className="fw-bold text-dark small mb-3">Product</p>
              {['Features', 'How it works', 'Pricing'].map(l => (
                <p key={l} className="text-secondary small mb-2" style={{ cursor: 'pointer' }}>{l}</p>
              ))}
            </div>
            <div className="col-6 col-md-2">
              <p className="fw-bold text-dark small mb-3">Support</p>
              {['Help Centre', 'Contact Us', 'Privacy Policy'].map(l => (
                <p key={l} className="text-secondary small mb-2" style={{ cursor: 'pointer' }}>{l}</p>
              ))}
            </div>
            <div className="col-md-4">
              <p className="fw-bold text-dark small mb-3">Get started today</p>
              <Link to="/register" className="btn btn-success fw-bold px-4 py-2 rounded-3 d-inline-flex align-items-center gap-2">
                Create Free Account
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          <div className="border-top pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <p className="text-secondary small mb-0">
              © {new Date().getFullYear()} MediWell. Built with love for Nigerians.
            </p>
            <p className="text-secondary small mb-0">
              Made in 🇳🇬 Nigeria
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
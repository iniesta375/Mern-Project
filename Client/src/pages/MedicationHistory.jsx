import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill, ShieldCheck, Heart, BarChart3, ChevronRight } from 'lucide-react';
import { LogoWithText } from '../components/Logo';

export default function LandingPage() {
  return (
    <div className="bg-white">
      <section className="py-5 py-md-5 overflow-hidden">
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2 mb-4">
                  Now available in Nigeria 🇳🇬
                </span>
                <h1 className="display-3 fw-bold text-dark mb-4">
                  Helping Nigerians Stay <br />
                  <span className="text-success">Consistent</span> With Their Medication
                </h1>
                <p className="lead text-secondary mb-5">
                  MediWell is your companion for better health. Track your prescriptions, 
                  get timely reminders, and monitor your wellness all in one place.
                </p>
                <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                  <Link
                    to="/register"
                    className="btn btn-success btn-lg px-5 py-3 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-2"
                  >
                    Get Started Free
                    <ChevronRight size={20} />
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline-secondary btn-lg px-5 py-3 rounded-3"
                  >
                    Sign In
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-3">Everything you need for wellness</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '600px' }}>
              We&apos;ve built MediWell to solve the problem of medication non-adherence, 
              which affects millions of people every day.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                title: 'Medication Reminders',
                desc: 'Never miss a dose again with smart notifications tailored to your schedule.',
                icon: Pill,
                color: 'bg-success bg-opacity-10 text-success'
              },
              {
                title: 'Wellness Tracking',
                desc: 'Log your mood and mental state to see how your physical health impacts your mind.',
                icon: Heart,
                color: 'bg-danger bg-opacity-10 text-danger'
              },
              {
                title: 'Adherence Reports',
                desc: 'Generate detailed reports for your doctor visits and monitor your long-term progress.',
                icon: BarChart3,
                color: 'bg-primary bg-opacity-10 text-primary'
              }
            ].map((feature, i) => (
              <div key={i} className="col-md-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card h-100 p-4 border-0 shadow-sm"
                >
                  <div className={`rounded-3 d-flex align-items-center justify-content-center mb-4 ${feature.color}`} style={{ width: '48px', height: '48px' }}>
                    <feature.icon size={24} />
                  </div>
                  <h3 className="h4 fw-bold text-dark mb-3">{feature.title}</h3>
                  <p className="text-secondary mb-0">{feature.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-5">
          <div className="bg-success rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden">
            <div className="row position-relative z-1">
              <div className="col-lg-7">
                <h2 className="display-5 fw-bold mb-4">Join the community taking control of their health</h2>
                <p className="lead mb-5 opacity-75">
                  Medication adherence is critical for managing chronic conditions. 
                  MediWell makes it simple, social, and rewarding.
                </p>
                <Link
                  to="/register"
                  className="btn btn-light btn-lg px-5 py-3 fw-bold text-success rounded-3"
                >
                  Start Your Journey
                </Link>
              </div>
            </div>
            <div className="position-absolute end-0 bottom-0 opacity-10 d-none d-md-block" style={{ width: '300px', height: '300px' }}>
              <ShieldCheck size={300} />
            </div>
          </div>
        </div>
      </section>

      <footer className="py-5 border-top">
        <div className="container text-center">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <LogoWithText size={24} fontSize="1.1rem" />
          </div>
          <p className="text-secondary small mb-0">
            © {new Date().getFullYear()} MediWell. Helping Nigerians stay healthy.
          </p>
        </div>
      </footer>
    </div>
  );
}

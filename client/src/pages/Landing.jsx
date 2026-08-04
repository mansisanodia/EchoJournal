import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Brain, ShieldCheck, TrendingUp, Leaf, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: Mic,          color: 'terra',  title: 'Voice-First Design',   desc: 'Record journal entries with your voice. Live Web Speech transcription — no typing required.' },
  { icon: Brain,        color: 'sage',   title: 'Gemini AI Insights',   desc: 'Deep emotion analysis, stress scoring, wellness advice, and trend detection powered by Google AI.' },
  { icon: ShieldCheck,  color: 'forest', title: 'AES-256 Encryption',   desc: 'Your thoughts are encrypted before saving. Zero-knowledge privacy — only your session decrypts them.' },
  { icon: TrendingUp,   color: 'honey',  title: 'Mood Analytics',       desc: 'Interactive Recharts dashboards, heatmap calendars, month-over-month trends, and 7-day AI predictions.' },
];

const colorMap = {
  terra:  { bg: 'bg-terra-50  border-terra-100',  icon: 'bg-terra-100  text-terra-500'  },
  sage:   { bg: 'bg-sage-50   border-sage-100',   icon: 'bg-sage-100   text-sage-500'   },
  forest: { bg: 'bg-forest-50 border-forest-100', icon: 'bg-forest-100 text-forest-600' },
  honey:  { bg: 'bg-honey-50  border-honey-100',  icon: 'bg-honey-100  text-honey-600'  },
};

const Landing = () => {
  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-28 px-4">
        {/* Decorative blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-sage-200/30 blur-3xl animate-blob pointer-events-none" />
        <div className="absolute bottom-0 left-0  w-96 h-96 rounded-full bg-terra-100/20 blur-3xl animate-blob pointer-events-none" style={{animationDelay:'2s'}} />
        <div className="absolute top-40 left-1/3 w-48 h-48 rounded-full bg-honey-200/25 blur-2xl animate-blob pointer-events-none" style={{animationDelay:'4s'}} />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-50 border border-sage-100 text-sage-600 text-xs font-semibold mb-8 shadow-nature-sm">
            <Sparkles className="w-3.5 h-3.5 text-honey-500" />
            Powered by Google Gemini AI & AES-256 Encryption
          </span>

          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-sage-900 leading-tight mb-6">
            Your Thoughts,{' '}
            <span className="text-gradient-sage italic">Understood.</span>
          </h1>

          <p className="text-lg sm:text-xl text-sage-500 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
            EchoJournal transforms your daily voice reflections into deep wellness insights.
            Speak freely, stay private, and watch your emotional patterns emerge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="btn-primary text-base px-8 py-4 rounded-2xl">
              <Leaf className="w-5 h-5" />
              Start Journaling Free
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-4 rounded-2xl">
              Already have an account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-sage-400 font-medium">
            {['No credit card needed','Voice + text journaling','Instant AI analysis','Fully encrypted'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-sage-400" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Why EchoJournal</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-sage-800">
              Everything your journal should be
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, color, title, desc }) => {
              const c = colorMap[color];
              return (
                <div key={title} className={`card card-hover rounded-3xl p-6 border ${c.bg} flex flex-col gap-4`}>
                  <div className={`w-11 h-11 rounded-2xl ${c.icon} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-semibold text-sage-800 mb-1.5">{title}</h3>
                    <p className="text-sm text-sage-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-sage-800">Three steps to clarity</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step:'01', icon: Mic,        color:'terra',  title:'Record your voice', desc:'Tap the mic and speak naturally about your day, feelings, or anything on your mind.'  },
              { step:'02', icon: Brain,       color:'sage',   title:'AI analyzes emotion',desc:'Gemini AI reads your transcript and returns emotion, stress, topics, and wellness advice.' },
              { step:'03', icon: TrendingUp,  color:'honey',  title:'Track your journey', desc:'Your dashboard fills with trends, heatmaps, and insights as your entries grow.'           },
            ].map(({ step, icon: Icon, color, title, desc }) => {
              const c = colorMap[color];
              return (
                <div key={step} className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-3xl ${c.bg} border flex items-center justify-center shadow-nature-md`}>
                      <Icon className={`w-7 h-7 ${c.icon.split(' ')[1]}`} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-sage-100 text-[10px] font-bold text-sage-500 flex items-center justify-center shadow-nature-sm">
                      {step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-sage-800 mb-1.5">{title}</h3>
                    <p className="text-sm text-sage-500 leading-relaxed">{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center card rounded-3xl p-12 bg-sage-gradient shadow-nature-xl">
          <Leaf className="w-10 h-10 text-white mx-auto mb-4 animate-sway" />
          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Begin your wellness journey today
          </h2>
          <p className="text-sage-100 mb-8 text-sm leading-relaxed">
            Join thousands of mindful journalers using AI to understand their emotions.
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-sage-700 font-bold text-base hover:shadow-nature-lg hover:scale-105 transition-all duration-200">
            Create Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;

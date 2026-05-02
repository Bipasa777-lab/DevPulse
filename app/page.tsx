import Link from 'next/link';
import { ArrowRight, Activity, Zap, Shield, BarChart3 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-neutral-300 font-sans selection:bg-[#7161EF]/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#111111]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight text-white">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#7161EF] to-[#5a4cdb] flex items-center justify-center text-sm">
              DP
            </div>
            <span>DevPulse</span>
          </div>
          <div className="flex items-center gap-6">
            <Link 
              href="/dashboard"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard"
              className="px-4 py-2 rounded bg-[#7161EF] hover:bg-[#5a4cdb] text-white text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#7161EF]/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-white/5 text-sm text-neutral-400 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            DevPulse v2.0 is now live
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight mb-8 leading-[1.1] text-white">
            Monitor your systems with <br className="hidden lg:block" />
            <span className="text-neutral-400">
              unprecedented clarity
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-neutral-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Real-time analytics, intelligent alerts, and seamless integrations. Everything you need to keep your infrastructure running smoothly in one intuitive dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="group flex items-center gap-2 px-6 py-3 rounded bg-white text-[#111111] font-medium hover:bg-neutral-200 transition-colors"
            >
              Enter Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="#features"
              className="px-6 py-3 rounded bg-[#1A1A1A] text-white font-medium border border-white/5 hover:bg-[#252525] transition-colors"
            >
              View Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#111111] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold mb-4 text-white">Why choose DevPulse?</h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">Built for modern engineering teams who demand performance, reliability, and beautiful design.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded bg-[#111111] border border-white/5 flex items-center justify-center mb-6 text-[#7161EF]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Lightning Fast</h3>
              <p className="text-neutral-500 leading-relaxed text-sm">Built on edge networks to deliver real-time metrics with zero latency. Don't wait for your data.</p>
            </div>
            
            <div className="p-8 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded bg-[#111111] border border-white/5 flex items-center justify-center mb-6 text-emerald-500">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Secure by Design</h3>
              <p className="text-neutral-500 leading-relaxed text-sm">Enterprise-grade security built-in from day one. Your telemetry data is encrypted and safe.</p>
            </div>

            <div className="p-8 rounded-xl bg-[#1A1A1A] border border-white/5 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded bg-[#111111] border border-white/5 flex items-center justify-center mb-6 text-orange-500">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-white">Deep Analytics</h3>
              <p className="text-neutral-500 leading-relaxed text-sm">Turn raw data into actionable insights with powerful querying and visualization tools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-neutral-600 text-sm bg-[#111111]">
        <p>&copy; {new Date().getFullYear()} DevPulse Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

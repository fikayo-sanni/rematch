'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Swords,
  Trophy,
  Users,
  Zap,
  Shield,
  TrendingUp,
  Play,
  ChevronRight,
  Star,
  Check,
  ArrowRight,
  MessageSquare,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Animated counter component
function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <span className="tabular-nums">
      {value.toLocaleString()}{suffix}
    </span>
  );
}

// Feature card component
function FeatureCard({
  icon: Icon,
  title,
  description,
  color
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="group relative p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// Game card component
function GameCard({ name, players, color, logo }: { name: string; players: string; color: string; logo: string }) {
  return (
    <div
      className="relative p-6 rounded-2xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-all duration-300 group cursor-pointer"
    >
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-2xl font-bold"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {logo}
      </div>
      <h3 className="text-white font-bold text-lg">{name}</h3>
      <p className="text-gray-500 text-sm mt-1">{players} active players</p>
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `0 0 40px ${color}20` }}
      />
    </div>
  );
}

// Testimonial card
function TestimonialCard({
  quote,
  author,
  role,
  avatar
}: {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}) {
  return (
    <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-300 mb-6 leading-relaxed">&quot;{quote}&quot;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Rematch</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Features</a>
            <a href="#games" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Games</a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Pricing</a>
            <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-violet-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[150px]" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-8">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300 font-medium">The future of competitive gaming is here</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Compete. Win.{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Dominate.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              The ultimate platform for competitive gamers. Challenge opponents, join tournaments,
              climb the ranks, and build your legacy.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/register">
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  Start Playing Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="secondary" size="lg" className="min-w-[200px]">
                <Play className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">
                  <AnimatedNumber value={50000} suffix="+" />
                </p>
                <p className="text-gray-500 text-sm mt-1">Active Players</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">
                  <AnimatedNumber value={1000000} suffix="+" />
                </p>
                <p className="text-gray-500 text-sm mt-1">Matches Played</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white">
                  <AnimatedNumber value={500} suffix="+" />
                </p>
                <p className="text-gray-500 text-sm mt-1">Tournaments Run</p>
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <div className="aspect-[16/9] bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
                    <Swords className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Platform Preview</h3>
                  <p className="text-gray-400">Experience the thrill of competitive gaming</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Everything you need to dominate
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Built by gamers, for gamers. Every feature designed to enhance your competitive experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Swords}
              title="1v1 Matches"
              description="Challenge any player instantly. Prove your skills and claim victory in head-to-head battles."
              color="#8B5CF6"
            />
            <FeatureCard
              icon={Trophy}
              title="Tournaments"
              description="Daily, weekly, and seasonal tournaments. Compete against the best and climb to the top."
              color="#F59E0B"
            />
            <FeatureCard
              icon={Users}
              title="Guilds & Squads"
              description="Join game-specific communities, form squads with friends, and compete in squad-based competitions."
              color="#10B981"
            />
            <FeatureCard
              icon={TrendingUp}
              title="Leaderboards"
              description="Track your progress with comprehensive rankings. Earn XP, climb divisions, and show off your achievements."
              color="#EF4444"
            />
            <FeatureCard
              icon={Shield}
              title="Fair Play System"
              description="Advanced verification and dispute resolution ensures every match is fair and every win is legitimate."
              color="#06B6D4"
            />
            <FeatureCard
              icon={Award}
              title="XP & Achievements"
              description="Win matches, complete challenges, and earn XP to unlock achievements, badges, and exclusive rewards."
              color="#EC4899"
            />
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section id="games" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Your favorite games, competitive
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join thriving communities around the biggest titles. More games added regularly.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GameCard name="EA FC" players="24.5K" color="#00FF87" logo="FC" />
            <GameCard name="Call of Duty" players="18.2K" color="#FF6B00" logo="COD" />
            <GameCard name="NBA 2K" players="15.8K" color="#FF1744" logo="2K" />
            <GameCard name="Madden NFL" players="12.4K" color="#1E88E5" logo="NFL" />
          </div>

          <div className="text-center mt-12">
            <Button variant="ghost" size="lg">
              View All Games
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Start competing in minutes
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Simple setup, instant action. Here&apos;s how it works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', description: 'Sign up free in seconds. Connect your gaming profiles and set up your player profile.' },
              { step: '02', title: 'Find Opponents', description: 'Use Quick Match for instant games or challenge specific players in your favorite titles.' },
              { step: '03', title: 'Play & Climb', description: 'Complete your match, submit results, and climb the leaderboards. Simple as that.' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-bold text-gray-800/50 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-700" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Loved by competitive gamers
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See what our community has to say about their Rematch experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Finally a platform that takes competitive gaming seriously. The matchmaking is fast, disputes are handled fairly, and I've climbed 200 spots on the leaderboard."
              author="ShadowStrike"
              role="Top 100 FC Player"
              avatar="SS"
            />
            <TestimonialCard
              quote="The guild system is amazing. Found a great community of 2K players and we run tournaments every week. Best gaming decision I've made."
              author="HoopDreams"
              role="Guild Leader"
              avatar="HD"
            />
            <TestimonialCard
              quote="I was skeptical at first, but the verification system is legit. No more fake wins or disputed matches. Every game counts."
              author="ViperQueen"
              role="Pro Player"
              avatar="VQ"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Simple, fair pricing
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              No pay-to-win. No special privileges. Just access to the communities you want.
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className="relative p-8 rounded-2xl bg-gradient-to-b from-violet-900/20 to-gray-900 border border-violet-500/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-xs font-semibold text-white">
                Per Guild
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Guild Membership</h3>
                <p className="text-gray-400">Access everything a guild has to offer</p>
              </div>

              <div className="text-center mb-8">
                <span className="text-5xl font-bold text-white">$3.99</span>
                <span className="text-gray-400 ml-2">/month per guild</span>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  'Full access to all guild features',
                  'Unlimited 1v1 matches',
                  'Join tournaments & leagues',
                  'Complete leaderboard access',
                  'Create & join crews',
                  'Access to guild feed & community',
                  'All game editions included',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button variant="primary" className="w-full" size="lg">
                  Get Started
                </Button>
              </Link>

              <p className="text-center text-gray-500 text-sm mt-4">
                Join as many guilds as you like. Same features in every one.
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                <span className="text-white font-semibold">No hidden fees.</span> Everyone plays on equal footing.
                <br />Your skill is all that matters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-12 md:p-16 rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-700" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:24px_24px]" />

            <div className="relative text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to prove yourself?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Join thousands of competitive gamers already on Rematch.
                Your first match is just a click away.
              </p>

              {/* Email signup */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full sm:flex-1 px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-colors"
                />
                <Link href="/register">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 border-0"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>

              <p className="text-white/60 text-sm mt-4">
                Free to play. No credit card required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Rematch</span>
              </Link>
              <p className="text-gray-500 text-sm max-w-xs">
                The ultimate competitive gaming platform.
                Challenge opponents, climb the ranks, build your legacy.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-500 hover:text-white text-sm transition-colors">Features</a></li>
                <li><a href="#games" className="text-gray-500 hover:text-white text-sm transition-colors">Games</a></li>
                <li><a href="#pricing" className="text-gray-500 hover:text-white text-sm transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">About</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Cookies</a></li>
                <li><a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Rematch. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

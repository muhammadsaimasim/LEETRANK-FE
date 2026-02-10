import { Link } from 'react-router-dom';
import { Trophy, Users, Target, TrendingUp, ArrowRight, Terminal, Code2, Braces, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';

export default function Landing() {
  const stats = [
    { label: 'Active Coders', value: '500+', icon: Users },
    { label: 'Problems Solved', value: '25K+', icon: Code2 },
    //{ label: 'Universities', value: '10+', icon: Trophy },
  ];

  const features = [
    {
      icon: Trophy,
      title: 'Competitive Rankings',
      description: 'Real-time leaderboards updated with your latest LeetCode progress. See where you stand.',
      tag: 'ranking',
    },
    {
      icon: Target,
      title: 'Track Difficulty',
      description: 'Monitor your Easy, Medium, and Hard problem counts. Push your limits.',
      tag: 'progress',
    },
    {
      icon: Users,
      title: 'Find Your Peers',
      description: 'Filter by batch and department. Find study partners and competitors.',
      tag: 'community',
    },
    {
      icon: TrendingUp,
      title: 'Auto-Sync Stats',
      description: 'Connect your LeetCode profile once. We handle the rest automatically.',
      tag: 'sync',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 pattern-grid opacity-50" />
        
        {/* Gradient orbs */}
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[100px]" />
        
        <div className="container relative py-20 lg:py-28">
          <div className="max-w-4xl">
            {/* Terminal-style badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 font-mono text-sm shadow-sm">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">$</span>
              <span>leetrank --leaderboard</span>
              <span className="animate-cursor text-primary">_</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Compete. Code.{' '}
              <span className="text-gradient">Climb.</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Track your LeetCode progress, compete with fellow students, and rise through 
              the ranks. Your university's competitive programming leaderboard.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="group h-12 px-6 text-base font-medium">
                <Link to={ROUTES.LEADERBOARD}>
                  View Leaderboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-6 text-base font-medium border-2">
                <Link to={ROUTES.REGISTER}>Get Started</Link>
              </Button>
            </div>

            {/* Code snippet decoration */}
            <div className="mt-16 hidden lg:block">
              <div className="inline-block bg-gradient-code rounded-lg border border-border/50 p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
                  <div className="w-3 h-3 rounded-full bg-destructive/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">ranking.ts</span>
                </div>
                <code className="font-mono text-sm text-foreground/90">
                  <span className="text-secondary">const</span>{' '}
                  <span className="text-primary">yourRank</span>{' '}
                  <span className="text-muted-foreground">=</span>{' '}
                  <span className="text-success">getLeaderboard</span>
                  <span className="text-muted-foreground">()</span>
                  <span className="text-secondary">.</span>
                  <span className="text-primary">climb</span>
                  <span className="text-muted-foreground">();</span>
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 border-y border-border bg-card/50">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="flex items-center gap-4 justify-center sm:justify-start"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      <section className="py-16 border-y border-border bg-card/50">
  <div className="container">
    <div className="mx-auto grid grid-flow-col auto-cols-fr items-center gap-12 max-w-8xl">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-4 justify-center"
        >
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <stat.icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container">
          <div className="max-w-xl mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-mono text-primary mb-4">
              <Hash className="h-4 w-4" />
              features
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to level up
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join the community of competitive programmers and track your journey to the top.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{feature.title}</h3>
                      <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        {feature.tag}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-code" />
        <div className="absolute inset-0 pattern-grid opacity-10" />
        
        <div className="container relative">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-primary/20 mb-6">
              <Braces className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Ready to compete?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join LeetRank and start climbing the leaderboard today.
            </p>
            <div className="mt-8">
              <Button size="lg" asChild className="group h-12 px-8 text-base font-medium">
                <Link to={ROUTES.REGISTER}>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

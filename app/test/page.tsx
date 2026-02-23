"use client";

import * as React from "react";
import { GlassCalendar } from "@/components/ui/glass-calendar";
import { TestimonialStack, Testimonial } from "@/components/ui/glass-testimonial-swiper";
import { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardContent, GlassCardDescription, GlassCardAction, GlassCardFooter } from "@/components/ui/glass-card";
import { GlassTimeCard } from "@/components/ui/glass-time-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Calendar, ThumbsUp, ShieldCheck, Clock, Share, Rocket, Zap, Gem } from "lucide-react";

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    initials: "SM",
    name: "Sarah Mitchell",
    role: "VP of Engineering at TechFlow",
    quote: "This platform has completely transformed how our team collaborates. The AI-powered analytics provide insights we never had before, and the performance improvements are remarkable. Best investment we've made this year.",
    tags: [{ text: "FEATURED", type: "featured" }, { text: "Enterprise", type: "default" }],
    stats: [{ icon: Users, text: "200+ team" }, { icon: Calendar, text: "2 years customer" }],
    avatarGradient: "linear-gradient(135deg, #5e6ad2, #8b5cf6)",
  },
  {
    id: 2,
    initials: "MC",
    name: "Marcus Chen",
    role: "Product Manager at DataSync",
    quote: "The real-time collaboration features are game-changing. Our remote team feels more connected than ever, and the platform's reliability is outstanding. The mobile experience is seamless across all devices.",
    tags: [{ text: "Startup", type: "default" }, { text: "Mobile", type: "default" }],
    stats: [{ icon: ThumbsUp, text: "Helpful" }, { icon: ShieldCheck, text: "Verified" }],
    avatarGradient: "linear-gradient(135deg, #10b981, #059669)",
  },
  {
    id: 3,
    initials: "AR",
    name: "Alex Rodriguez",
    role: "CTO at StartupFlow",
    quote: "Incredible performance boost and the mobile apps are flawless. Support team is responsive and the feature roadmap aligns perfectly with our needs. The customization options are endless.",
    tags: [{ text: "Enterprise", type: "default" }, { text: "API User", type: "default" }],
    stats: [{ icon: Clock, text: "6 months ago" }, { icon: Share, text: "Shared 8 times" }],
    avatarGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    id: 4,
    initials: "EJ",
    name: "Emily Johnson",
    role: "Founder of Innovate Inc.",
    quote: "As a new company, speed is everything. This tool allowed us to scale our operations twice as fast without doubling our headcount. A must-have for any ambitious startup.",
    tags: [{ text: "New", type: "default" }, { text: "Growth", type: "featured" }],
    stats: [{ icon: Rocket, text: "Scaled 2x" }, { icon: Zap, text: "Fast Setup" }],
    avatarGradient: "linear-gradient(135deg, #ec4899, #d946ef)",
  },
  {
    id: 5,
    initials: "DW",
    name: "David Wong",
    role: "Lead Designer at Creative Co.",
    quote: "The user interface is not just beautiful, it's intuitive. Our design team was able to adopt it instantly, streamlining our entire workflow and improving creative output.",
    tags: [{ text: "Design", type: "default" }],
    stats: [{ icon: Gem, text: "Top UI/UX" }],
    avatarGradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
  },
];

export default function TestPage() {
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const calendarBgUrl =
    "https://plus.unsplash.com/premium_photo-1673873438024-81d29f555b95?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjM2fHxjb2xvcnxlbnwwfHwwfHx8MA%3D%3D";

  return (
    <main>
      {/* Component 1: GlassCalendar */}
      <section
        className="flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4 bg-slate-900"
        style={{ backgroundImage: `url(${calendarBgUrl})` }}
      >
        <GlassCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          className="transform transition-transform duration-500 hover:scale-105"
        />
      </section>

      {/* Component 2: TestimonialStack */}
      <section
        className="relative w-full min-h-screen flex items-center justify-center p-4 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(244,143,177,0.45) 0%, rgba(159,168,237,0.4) 40%, rgba(224,231,255,0.2) 70%, #f8f9fc 100%)",
        }}
      >
        <div
          className="absolute inset-0 bg-cover bg-bottom bg-no-repeat opacity-70 scale-[1.6]"
          style={{ backgroundImage: 'url("https://res.cloudinary.com/drhx7imeb/image/upload/v1756215257/gradient-optimized_nfrakk.svg")' }}
        />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <TestimonialStack testimonials={testimonialsData} />
        </div>
      </section>

      {/* Component 3: GlassCard Login */}
      <section
        className="bg-[url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] w-full min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      >
        <GlassCard className="w-full max-w-sm">
          <GlassCardHeader>
            <GlassCardTitle>Login to your account</GlassCardTitle>
            <GlassCardDescription>
              Enter your email below to login to your account
            </GlassCardDescription>
            <GlassCardAction>
              <Button variant="link">Sign Up</Button>
            </GlassCardAction>
          </GlassCardHeader>
          <GlassCardContent>
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
              </div>
            </form>
          </GlassCardContent>
          <GlassCardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="ghost" className="w-full">
              Login with Google
            </Button>
          </GlassCardFooter>
        </GlassCard>
      </section>

      {/* Component 4: GlassTimeCard */}
      <section
        className="w-full min-h-screen flex items-center justify-center bg-cover bg-center p-4"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533158326339-7f3cf2404354?q=80&w=1068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      >
        <GlassTimeCard showSeconds showTimezone />
      </section>
    </main>
  );
}

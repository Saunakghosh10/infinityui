'use client';

import { motion } from 'framer-motion';
import { Sparkles, Code, Wand2, Infinity, Boxes, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Spotlight } from '@/components/ui/spotlight';
import { Meteors } from '@/components/ui/meteors';
import { Navbar } from '@/components/ui/navbar';
import { RevealText } from '@/components/ui/reveal-text';
import { ScrollAnimation } from '@/components/ui/scroll-animations';
import { GestureAnimation } from '@/components/ui/gesture-animations';

const features = [
  {
    icon: <Sparkles className="h-6 w-6" />,
    title: "Beautiful Components",
    description: "Meticulously crafted components with stunning animations and interactions."
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Developer Experience",
    description: "Built with TypeScript and RadixUI for the best possible developer experience."
  },
  {
    icon: <Wand2 className="h-6 w-6" />,
    title: "Animations",
    description: "Powered by Framer Motion for smooth, natural animations that enhance user experience."
  },
  {
    icon: <Boxes className="h-6 w-6" />,
    title: "Composable",
    description: "Components that work together seamlessly to create complex interfaces."
  }
];

const showcaseComponents = [
  {
    title: "Buttons",
    preview: (
      <div className="flex gap-4">
        <Button className="bg-gradient-to-r from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600">
          Primary
        </Button>
        <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800/50">
          Secondary
        </Button>
      </div>
    )
  },
  {
    title: "Cards",
    preview: (
      <Card className="w-full max-w-sm p-6 bg-gradient-to-br from-zinc-900 to-zinc-800">
        <h3 className="text-zinc-100 font-semibold">Card Title</h3>
        <p className="text-zinc-400 text-sm mt-2">Beautiful, customizable cards with smooth animations.</p>
      </Card>
    )
  }
];

export default function HomePage() {
  return (
    <AuroraBackground className="bg-black">
      <Navbar />
      <div className="relative z-10 min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
          <Meteors number={20} />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <RevealText className="flex items-center justify-center mb-6">
              <h1 className="text-6xl md:text-7xl md:leading-[1.1] font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 via-zinc-300 to-neutral-50 leading-[1.1] font-space-grotesk tracking-tight flex items-center gap-4">
                Infinity <Infinity className="h-12 w-12 text-zinc-200 animate-float" /> UI
              </h1>
            </RevealText>
            <RevealText delay={0.2}>
              <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
                A modern UI component library that transcends the boundaries of design
              </p>
            </RevealText>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                variant="white"
                className="px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/docs'}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 px-8 py-6 rounded-full transform hover:scale-105 transition-all duration-300"
                onClick={() => window.location.href = '/documentation'}
              >
                Documentation
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <RevealText>
              <h2 className="text-3xl font-bold text-zinc-100 mb-12 text-center">Features</h2>
            </RevealText>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }
                    }
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group cursor-pointer"
                >
                  <Card className="p-6 h-full bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-zinc-800/50 hover:border-zinc-700/50 transform transition-all duration-500 hover:shadow-lg">
                    <div className="mb-4 p-2 rounded-lg bg-zinc-900/50 w-fit group-hover:bg-zinc-800/50 transition-all duration-500">
                      <div className="text-zinc-300 group-hover:text-zinc-100 transition-colors transform group-hover:rotate-6 duration-300">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-zinc-100 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-all duration-300 flex-grow">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Showcase Section */}
        <section className="py-20 px-4 border-t border-zinc-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-zinc-100 mb-12 text-center">Component Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {showcaseComponents.map((component, index) => (
                <motion.div
                  key={component.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Card className="p-8 bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 backdrop-blur-lg border border-zinc-800">
                    <h3 className="text-lg font-semibold mb-4 text-zinc-100">{component.title}</h3>
                    <div className="flex items-center justify-center p-6 bg-zinc-900/50 rounded-lg">
                      {component.preview}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AuroraBackground>
  );
} 
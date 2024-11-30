import { InteractiveElement } from '@/components/ui/interactive-element';
import { ScrollAnimation } from '@/components/ui/scroll-animations';
import { motion } from 'framer-motion';
import { advancedAnimations, springConfigs } from '@/lib/animation-variants';

export function ExampleComponent() {
  return (
    <div className="space-y-8">
      {/* Interactive Card */}
      <InteractiveElement
        effects={['tilt', 'magnetic', 'glow', 'ripple']}
        className="p-6 bg-zinc-900/50 border border-zinc-800"
      >
        <h3>Interactive Card</h3>
        <p>Hover me to see multiple effects!</p>
      </InteractiveElement>

      {/* Scroll Animations */}
      <ScrollAnimation
        animation="scale"
        className="space-y-4"
      >
        <motion.div
          variants={advancedAnimations.entrance.elastic}
          className="p-4 bg-zinc-900/50 border border-zinc-800"
        >
          Elastic entrance animation
        </motion.div>
      </ScrollAnimation>

      {/* Gesture-based interaction */}
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.3}
        whileDrag={{ scale: 1.1 }}
        className="p-4 bg-zinc-900/50 border border-zinc-800 cursor-grab active:cursor-grabbing"
      >
        Drag me around!
      </motion.div>
    </div>
  );
} 
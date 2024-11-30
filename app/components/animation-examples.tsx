import { AdvancedAnimation } from '@/components/ui/advanced-animations';
import { GestureInteraction } from '@/components/ui/gesture-interactions';

export function AnimationExamples() {
  return (
    <div className="space-y-8 p-8">
      {/* Parallax Animation */}
      <AdvancedAnimation
        type="parallax"
        intensity={1.5}
        className="p-6 bg-zinc-900/50 rounded-lg"
      >
        <h2>Parallax Scroll</h2>
        <p>This section moves on scroll</p>
      </AdvancedAnimation>

      {/* Reveal Animation */}
      <AdvancedAnimation
        type="reveal"
        delay={0.2}
        className="p-6 bg-zinc-900/50 rounded-lg"
      >
        <h2>Reveal Animation</h2>
        <p>This content fades in</p>
      </AdvancedAnimation>

      {/* Gesture Interactions */}
      <div className="grid grid-cols-2 gap-4">
        <GestureInteraction
          type="drag"
          className="p-6 bg-zinc-900/50 rounded-lg cursor-grab"
          onGesture={(info) => console.log('Dragged:', info)}
        >
          <h3>Drag Me</h3>
        </GestureInteraction>

        <GestureInteraction
          type="hover3d"
          className="p-6 bg-zinc-900/50 rounded-lg"
        >
          <h3>Hover 3D Effect</h3>
        </GestureInteraction>

        <GestureInteraction
          type="magnetic"
          className="p-6 bg-zinc-900/50 rounded-lg"
        >
          <h3>Magnetic Effect</h3>
        </GestureInteraction>

        <GestureInteraction
          type="swipe"
          className="p-6 bg-zinc-900/50 rounded-lg"
          onGesture={(info) => console.log('Swiped:', info)}
        >
          <h3>Swipe Me</h3>
        </GestureInteraction>
      </div>
    </div>
  );
} 
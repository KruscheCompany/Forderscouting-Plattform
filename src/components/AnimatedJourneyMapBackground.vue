<template>
  <div class="journey-bg-wrap" aria-hidden="true">
    <div class="journey-contour"></div>
    <div class="journey-veil"></div>

    <div class="journey-pin journey-pin-1">
      <div class="journey-pin-pulse"></div>
      <div class="journey-pin-dot"></div>
    </div>
    <div class="journey-pin journey-pin-2" style="animation-delay: -1.5s;">
      <div class="journey-pin-pulse journey-pin-pulse-2"></div>
      <div class="journey-pin-dot"></div>
    </div>
    <div class="journey-pin journey-pin-3" style="animation-delay: -3s;">
      <div class="journey-pin-pulse journey-pin-pulse-3"></div>
      <div class="journey-pin-dot"></div>
    </div>

    <div class="journey-bars">
      <div class="journey-bar" style="height: 62%;"></div>
      <div class="journey-bar" style="height: 88%; animation-delay: -0.6s;"></div>
      <div class="journey-bar journey-bar-accent" style="height: 48%; animation-delay: -1.2s;"></div>
      <div class="journey-bar" style="height: 40%; animation-delay: -1.8s;"></div>
      <div class="journey-bar" style="height: 30%; animation-delay: -2.4s;"></div>
      <div class="journey-bar journey-bar-accent" style="height: 55%; animation-delay: -3s;"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnimatedJourneyMapBackground"
};
</script>

<style scoped>
.journey-bg-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.journey-contour {
  position: absolute;
  inset: clamp(-60px, -20px - 2.0833vw, -40px);
  opacity: 0.55;
  background-image: repeating-radial-gradient(
      circle at 30% 20%,
      rgba(27, 42, 120, 0.22) 0 clamp(1.5px, 1px + 0.0521vw, 2px),
      rgba(27, 42, 120, 0) clamp(1.5px, 1px + 0.0521vw, 2px) clamp(26px, 12px + 1.4583vw, 40px)
    ),
    repeating-radial-gradient(
      circle at 78% 74%,
      rgba(27, 42, 120, 0.16) 0 clamp(1.5px, 1px + 0.0521vw, 2px),
      rgba(27, 42, 120, 0) clamp(1.5px, 1px + 0.0521vw, 2px) clamp(32px, 14px + 1.875vw, 50px)
    );
  animation: journey-pan 40s linear infinite;
}

/* fades the contour out with distance from the top, in fixed px so it
   holds the same shape regardless of panel height (percentages here
   would stretch/shrink the fade band with viewport height). The stops
   themselves grow gently with viewport width so the fade band keeps
   pace with the enlarged contour/pins on very wide screens. */
.journey-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(199, 209, 251, 0) 0,
    rgba(199, 209, 251, 0.15) clamp(160px, 72px + 9.167vw, 248px),
    rgba(199, 209, 251, 0.95) clamp(300px, 135px + 17.1875vw, 465px),
    rgba(199, 209, 251, 0.97) 100%
  );
}

/* pins render above the veil, unaffected by the fade */
.journey-pin {
  position: absolute;
  width: clamp(12px, 4px + 0.8333vw, 20px);
  height: clamp(12px, 4px + 0.8333vw, 20px);
}
.journey-pin-1 {
  left: 22%;
  top: clamp(162px, 73px + 9.271vw, 251px);
}
.journey-pin-2 {
  left: 47%;
  top: clamp(111px, 50px + 6.354vw, 172px);
}
.journey-pin-3 {
  left: 77%;
  top: clamp(237px, 107px + 13.542vw, 367px);
}
.journey-pin-pulse {
  position: absolute;
  width: clamp(54px, 20px + 3.5417vw, 88px);
  height: clamp(54px, 20px + 3.5417vw, 88px);
  margin: calc(clamp(54px, 20px + 3.5417vw, 88px) / -2) 0 0
    calc(clamp(54px, 20px + 3.5417vw, 88px) / -2);
  border-radius: 50%;
  background: rgba(242, 236, 74, 0.6);
  animation: journey-pin-pulse 4.5s ease-out infinite;
}
.journey-pin-pulse-2 {
  animation-delay: -1.5s;
}
.journey-pin-pulse-3 {
  animation-delay: -3s;
}
.journey-pin-dot {
  position: absolute;
  width: clamp(12px, 4px + 0.8333vw, 20px);
  height: clamp(12px, 4px + 0.8333vw, 20px);
  margin: calc(clamp(12px, 4px + 0.8333vw, 20px) / -2) 0 0
    calc(clamp(12px, 4px + 0.8333vw, 20px) / -2);
  border-radius: 50%;
  background: #f2ec4a;
  border: clamp(2px, 1px + 0.1042vw, 3px) solid #1b2a78;
}

/* bar chart */
.journey-bars {
  position: absolute;
  left: 40px;
  right: 40px;
  bottom: 96px;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 74px;
  opacity: 0.65;
}
.journey-bar {
  flex: 1;
  background: rgba(27, 42, 120, 0.3);
  border-radius: 3px 3px 0 0;
  transform-origin: bottom;
  animation: journey-bar 8s ease-in-out infinite;
}
.journey-bar-accent {
  background: rgba(242, 236, 74, 0.85);
}

@keyframes journey-pan {
  0% { background-position: 0 0, 0 0; }
  100% { background-position: 0 -220px, 0 -220px; }
}
@keyframes journey-pin-pulse {
  0% { transform: scale(0.5); opacity: 0.7; }
  100% { transform: scale(2.6); opacity: 0; }
}
@keyframes journey-bar {
  0%, 100% { transform: scaleY(0.25); }
  50% { transform: scaleY(1); }
}

@media (prefers-reduced-motion: reduce) {
  .journey-contour,
  .journey-pin-pulse,
  .journey-bar {
    animation: none !important;
  }
}
</style>

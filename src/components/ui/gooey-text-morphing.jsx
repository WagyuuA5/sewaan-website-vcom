import { useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName
}) {
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let currentIndex = 0;

    // Initialize texts
    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[0];
      text2Ref.current.textContent = texts.length > 1 ? texts[1] : texts[0];
      
      text1Ref.current.style.opacity = "100%";
      text1Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "0%";
      text2Ref.current.style.filter = "";
    }

    const setMorph = (fraction) => {
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        let invFraction = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / invFraction - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(invFraction, 0.4) * 100}%`;
      }
    };

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const newTime = new Date();
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      if (cooldown > 0) {
        cooldown -= dt;
      } else {
        morph += dt;
        let fraction = morph / morphTime;

        if (fraction >= 1) {
          fraction = 1;
          setMorph(fraction);

          currentIndex++;
          
          if (currentIndex >= texts.length - 1) {
             cancelAnimationFrame(animationFrameId);
             return;
          }

          cooldown = cooldownTime;
          morph = 0;
          
          if (text1Ref.current && text2Ref.current) {
             text1Ref.current.textContent = texts[currentIndex];
             text2Ref.current.textContent = texts[currentIndex + 1];
             
             text1Ref.current.style.opacity = "100%";
             text1Ref.current.style.filter = "";
             text2Ref.current.style.opacity = "0%";
             text2Ref.current.style.filter = "";
          }
        } else {
          setMorph(fraction);
        }
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative", className)}>
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="flex items-center justify-center"
        style={{ filter: "url(#threshold)" }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "absolute inline-block select-none text-center text-4xl md:text-5xl font-bold",
            "text-white",
            textClassName
          )}
        />
        <span
          ref={text2Ref}
          className={cn(
            "absolute inline-block select-none text-center text-4xl md:text-5xl font-bold",
            "text-white",
            textClassName
          )}
        />
      </div>
    </div>
  );
}

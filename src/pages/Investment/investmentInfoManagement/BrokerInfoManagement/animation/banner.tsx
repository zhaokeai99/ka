import { gsap, Power2 } from 'gsap';
import { memo, useEffect, useRef } from 'react';

function random(low: any, high: any) {
  return Math.random() * (high - low) + low;
}

interface ModalProps {
  canvasWidth: number;
  canvasHeight: number;
  particleLength?: number;
  particleMaxRadius?: number;
  style: any;
}

const FormBackground = (props: ModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    canvasWidth = 1500,
    canvasHeight = 100,
    particleLength = 150,
    particleMaxRadius = 8,
    style,
  } = props;

  //画布尺寸变更
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasWidth * window.devicePixelRatio;
      canvas.height = canvasHeight * window.devicePixelRatio;
      const context = canvas.getContext('2d');
      context?.scale(window.devicePixelRatio, window.devicePixelRatio);
    }
  };
  //开始执行

  const particles: any = [];

  let canvas = canvasRef.current;
  // @ts-ignore
  let context = canvas?.getContext('2d');

  //创建圆
  const createParticle = (id: number, isRecreate: any = undefined) => {
    const radius = random(1, particleMaxRadius);
    const x = isRecreate
      ? -radius - random(particleMaxRadius * 2, canvasWidth)
      : random(0, canvasWidth);
    let y = random(canvasHeight / 2 - 150, canvasHeight / 2 + 150);
    y += random(-100, 100);
    const alpha = random(0.05, 1);

    return {
      id: id,
      x: x,
      y: y,
      startY: y,
      radius: radius,
      defaultRadius: radius,
      startAngle: 0,
      endAngle: Math.PI * 2,
      alpha: alpha,
      color: { r: random(0, 100), g: random(0, 100), b: 255 },
      speed: alpha + 1,
      amplitude: random(50, 200),
      isBurst: false,
    };
  };
  //移动圆
  const moveParticle = (particle: any) => {
    particle.x += particle.speed;
    particle.y =
      particle.startY + particle.amplitude * Math.sin(((particle.x / 5) * Math.PI) / 180);
  };
  //移除圆
  const drawParticles = () => {
    particles.forEach((particle: any) => {
      moveParticle(particle);
      if (context) {
        context.beginPath();
        context.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${particle.alpha})`;
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          particle.startAngle,
          particle.endAngle,
        );
        context.fill();
      }
    });
  };
  //初始化圆
  const initialize = () => {
    for (let i = 0; i < particleLength; i++) {
      particles.push(createParticle(i));
    }
  };
  //变大
  const enlargeParticle = (clientX: number, clientY: number) => {
    particles.forEach((particle: any) => {
      if (particle.isBurst) return;

      const distance = Math.hypot(particle.x - clientX, particle.y - clientY);

      if (distance <= 100) {
        const scaling = (100 - distance) / 1.5;
        gsap.to(particle, {
          radius: particle.defaultRadius + scaling,
          ease: Power2.easeOut,
        });
      } else {
        gsap.to(particle, {
          duration: 0.5,
          radius: particle.defaultRadius,
          ease: Power2.easeOut,
        });
      }
    });
  };
  //爆炸
  const burstParticle = (clientX: number, clientY: number) => {
    particles.forEach((particle: any) => {
      const distance = Math.hypot(particle.x - clientX, particle.y - clientY);
      if (distance <= 100) {
        particle.isBurst = true;
        gsap.to(particle, {
          duration: 0.5,
          radius: particle.defaultRadius + 200,
          alpha: 0,
          ease: Power2.easeOut,
          onComplete: () => {
            particles[particle.id] = createParticle(particle.id, true);
          },
        });
      }
    });
  };

  const handleMouseMove = (e: any) => {
    if (canvas) {
      // @ts-ignore
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      enlargeParticle(x, y);
    }
  };

  const handleClick = (e: any) => {
    if (canvas) {
      // @ts-ignore
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      burstParticle(x, y);
    }
  };

  const bindEvent = () => {
    document.body.addEventListener('click', handleClick, false);
    document.body.addEventListener('mousemove', handleMouseMove, false);
  };
  //绘制
  const render = () => {
    context?.clearRect(0, 0, canvasWidth + particleMaxRadius * 2, canvasHeight);

    drawParticles();

    particles.forEach((particle: any) => {
      if (particle.x - particle.radius >= canvasWidth) {
        particles[particle.id] = createParticle(particle.id, true);
      }
    });
    window.requestAnimationFrame(render);
  };

  //尺寸变动
  useEffect(() => {
    resizeCanvas();
  }, [canvasWidth, canvasHeight, props]);
  //开始执行
  useEffect(() => {
    canvas = canvasRef.current;
    // @ts-ignore
    context = canvas?.getContext('2d');

    // initCanvas();
    initialize();
    render();
    bindEvent();
  }, []);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={style}></canvas>;

  // };
};

export default memo(FormBackground);

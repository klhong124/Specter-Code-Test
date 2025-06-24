import { Box, useColorModeValue } from "@chakra-ui/react";
import { memo, useCallback, useEffect, useRef, type PropsWithChildren } from "react";
import { animate, m, LazyMotion, domAnimation, useInView } from "framer-motion";

interface GlowingEffectProps {
    blur?: number;
    inactiveZone?: number;
    proximity?: number;
    spread?: number;
    glow?: boolean;
    className?: string;
    disabled?: boolean;
    movementDuration?: number;
    borderWidth?: number;
    index?: number;
}

const GlowingCard = memo(({
    children,
    blur = 2,
    inactiveZone = 0.01,
    proximity = 80,
    spread = 50,
    glow = true,
    className,
    disabled = false,
    movementDuration = 1.5,
    borderWidth = 2,
    index = 0,
}: PropsWithChildren<GlowingEffectProps>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);
    const isInView = useInView(containerRef);

    const handleMove = useCallback(
        (e?: MouseEvent | { x: number; y: number }) => {
            if (!containerRef.current || disabled) return;

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            animationFrameRef.current = requestAnimationFrame(() => {
                const element = containerRef.current;
                if (!element) return;

                const { left, top, width, height } = element.getBoundingClientRect();
                const mouseX = e?.x ?? lastPosition.current.x;
                const mouseY = e?.y ?? lastPosition.current.y;

                if (e) {
                    lastPosition.current = { x: mouseX, y: mouseY };
                }

                const center = [left + width * 0.5, top + height * 0.5];
                const distanceFromCenter = Math.hypot(
                    mouseX - center[0],
                    mouseY - center[1]
                );
                const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

                if (distanceFromCenter < inactiveRadius) {
                    element.style.setProperty("--active", "0");
                    return;
                }

                const isActive =
                    mouseX > left - proximity &&
                    mouseX < left + width + proximity &&
                    mouseY > top - proximity &&
                    mouseY < top + height + proximity;

                element.style.setProperty("--active", isActive && glow ? "1" : "0");

                if (!isActive) return;

                const currentAngle =
                    parseFloat(element.style.getPropertyValue("--start")) || 0;
                let targetAngle =
                    (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
                    Math.PI + 90;

                const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
                const newAngle = currentAngle + angleDiff;

                animate(currentAngle, newAngle, {
                    duration: movementDuration,
                    ease: [0.16, 1, 0.3, 1],
                    onUpdate: (value) => {
                        element.style.setProperty("--start", String(value));
                    },
                });
            });
        },
        [disabled, glow, inactiveZone, movementDuration, proximity]
    );

    useEffect(() => {
        if (disabled) return;
        const handleScroll = () => handleMove();
        const handlePointerMove = (e: PointerEvent) => handleMove(e);

        window.addEventListener("scroll", handleScroll, { passive: true });
        document.body.addEventListener("pointermove", handlePointerMove, {
            passive: true,
        });

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener("scroll", handleScroll);
            document.body.removeEventListener("pointermove", handlePointerMove);
        };
    }, [handleMove, disabled]);

    const gradient = useColorModeValue(
        `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%),
         radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%),
         radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%),
         radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%),
         repeating-conic-gradient(
           from 236.84deg at 50% 50%,
           #dd7bbb 0%,
           #d79f1e calc(25% / 5),
           #5a922c calc(50% / 5),
           #4c7894 calc(75% / 5),
           #dd7bbb calc(100% / 5)
         )`,
        `radial-gradient(circle, #a78bfa 10%, #a78bfa00 20%),
         radial-gradient(circle at 40% 40%, #fde047 5%, #fde04700 15%),
         radial-gradient(circle at 60% 60%, #6ee7b7 10%, #6ee7b700 20%),
         radial-gradient(circle at 40% 60%, #7dd3fc 10%, #7dd3fc00 20%),
         repeating-conic-gradient(
           from 236.84deg at 50% 50%,
           #a78bfa 0%,
           #fde047 calc(25% / 5),
           #6ee7b7 calc(50% / 5),
           #7dd3fc calc(75% / 5),
           #a78bfa calc(100% / 5)
         )`
    );

    const cssVars = {
        "--spread": spread,
        "--start": "0",
        "--active": "0",
        "--glowingeffect-border-width": `${borderWidth}px`,
        "--gradient": gradient,
        "--blur": `${blur}px`,
    } as React.CSSProperties;


    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9, filter: "blur(2px)" },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                delay: Math.sin((index % 10) * (Math.PI / 5)) * 0.1,
                duration: 0.3,
                ease: "easeOut" as const
            }
        }
    };

    return (
        <LazyMotion features={domAnimation} strict>
            <Box
                as={m.div}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={cardVariants}
                position="relative"
                h="full" borderRadius="2xl"
                p={`${borderWidth}px`}
                className={className}
            >
                <Box
                    ref={containerRef}
                    style={cssVars}
                    position="absolute"
                    inset="0"
                    borderRadius="inherit"
                    pointerEvents="none"
                    opacity={1}
                    transition="opacity 0.3s"
                    sx={{
                        _after: {
                            content: '""',
                            borderRadius: "inherit",
                            position: "absolute",
                            inset: `calc(-1 * var(--glowingeffect-border-width))`,
                            border: `var(--glowingeffect-border-width) solid transparent`,
                            background: `var(--gradient)`,
                            backgroundAttachment: "fixed",
                            opacity: `var(--active)`,
                            transition: "opacity 0.3s",
                            maskClip: "padding-box, border-box",
                            maskComposite: "intersect",
                            maskImage: `linear-gradient(#0000,#0000), conic-gradient(from calc((var(--start) - var(--spread)) * 1deg), #00000000 0deg, #fff, #00000000 calc(var(--spread) * 2deg))`,
                            filter: `blur(var(--blur))`,
                        }
                    }}
                />
                <Box
                    position="relative"
                    h="full"
                    borderRadius="2xl"
                    overflow="hidden"
                >
                    {children}
                </Box>
            </Box>
        </LazyMotion>
    );
});

GlowingCard.displayName = "GlowingCard";
export { GlowingCard };
import { useEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
    to: number;
    from?: number;
    direction?: "up" | "down";
    delay?: number;
    duration?: number;
    className?: string;
    separator?: string;
    suffix?: string;
    onStart?: () => void;
    onEnd?: () => void;
}

export default function CountUp({
    to,
    from = 0,
    delay = 0,
    duration = 2,
    className = "",
    separator = "",
    suffix = "",
    onStart,
    onEnd,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(from);

    const damping = 20 + 40 * (1 / duration);
    const stiffness = 100 * (1 / duration);

    const springValue = useSpring(motionValue, {
        damping,
        stiffness,
    });


    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = String(from);
        }
    }, [from, to]);

    useEffect(() => {
        if (typeof onStart === "function") {
            onStart();
        }

        const timeoutId = setTimeout(() => {
            motionValue.set(to);
        }, delay * 1000);

        const durationTimeoutId = setTimeout(
            () => {
                if (typeof onEnd === "function") {
                    onEnd();
                }
            },
            delay * 1000 + duration * 1000
        );

        return () => {
            clearTimeout(timeoutId);
            clearTimeout(durationTimeoutId);
        };
    }, [
        motionValue,
        from,
        to,
        delay,
        onStart,
        onEnd,
        duration,
    ]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (ref.current) {
                const options = {
                    useGrouping: !!separator,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                };

                const formattedNumber = Intl.NumberFormat("en-US", options).format(
                    Number(latest.toFixed(0))
                );

                ref.current.textContent = separator
                    ? formattedNumber.replace(/,/g, separator)
                    : formattedNumber;
            }
        });

        return () => unsubscribe();
    }, [springValue, separator]);

    return (
        <>
            <span className={`${className}`} ref={ref} />
            {suffix}
        </>
    );
}

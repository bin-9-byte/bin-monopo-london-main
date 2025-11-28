import { VFC, useEffect, useRef, useState, RefObject } from 'react';

export type ScrollControllerProps = {
    onScrollChange: (progress: number) => void
    scrollThreshold?: number
    debounceMs?: number
    scrollElementRef?: RefObject<HTMLElement>
}

export const ScrollController: VFC<ScrollControllerProps> = ({
    onScrollChange,
    scrollThreshold = 0.01,
    debounceMs = 16,
    scrollElementRef
}) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const lastScrollProgressRef = useRef(0);
    const tickingRef = useRef(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleScroll = () => {
        if (!tickingRef.current) {
            window.requestAnimationFrame(() => {
                const scroller = scrollElementRef?.current;
                const { scrollTop, scrollHeight, clientHeight } = scroller ?? document.documentElement;
                const progress = Math.min(scrollTop / (scrollHeight - clientHeight), 1);
				
                // 只有当滚动进度变化超过阈值时才更新
                if (Math.abs(progress - lastScrollProgressRef.current) > scrollThreshold) {
                    setScrollProgress(progress);
                    lastScrollProgressRef.current = progress;

                    // 如果不需要防抖，立即上报；否则按防抖时间上报
                    if (debounceMs <= 0) {
                        onScrollChange(progress);
                    } else {
                        if (debounceTimerRef.current) {
                            clearTimeout(debounceTimerRef.current);
                        }
                        debounceTimerRef.current = setTimeout(() => {
                            onScrollChange(progress);
                        }, debounceMs);
                    }
                }
				
				tickingRef.current = false;
			});

            tickingRef.current = true;
        }
    };

    useEffect(() => {
        const scroller = scrollElementRef?.current;
        const target: any = scroller ?? window;
        target.addEventListener('scroll', handleScroll, { passive: true });
        
        // 初始调用
        handleScroll();
        
        return () => {
            target.removeEventListener('scroll', handleScroll);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [onScrollChange, scrollThreshold, debounceMs, scrollElementRef?.current]);

    return null;
};

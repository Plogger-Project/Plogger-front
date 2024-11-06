declare module 'react-spring-carousel' {
    import { ReactNode } from 'react';

    interface CarouselItem {
        id: string;
        renderItem: ReactNode;
    }

    interface UseSpringCarouselProps {
        items: CarouselItem[];
        slideType?: 'fluid' | 'fixed';
        withLoop?: boolean;
    }

    export function useSpringCarousel(
        props: UseSpringCarouselProps
    ): {
        carouselFragment: ReactNode;
        slideToPrevItem: () => void;
        slideToNextItem: () => void;
    };
}

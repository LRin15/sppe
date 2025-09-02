// resources/js/types/global.d.ts

import { Config, RouteParam, Router } from 'ziggy-js';

declare global {
    // Versi 1: Untuk membuat URL
    function route(
        name: string,
        params?: RouteParam,
        absolute?: boolean,
        config?: Config
    ): string;

    // Versi 2: Untuk mengakses instance router Ziggy
    function route(): Router;
}
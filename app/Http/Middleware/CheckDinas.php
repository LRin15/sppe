<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckDinas
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $dinas  Nama dinas yang diizinkan untuk mengakses rute
     */
    public function handle(Request $request, Closure $next, string $dinas): Response
    {
        // Periksa apakah pengguna sudah login DAN dinasnya tidak cocok dengan yang diizinkan
        if (auth()->check() && auth()->user()->dinas !== $dinas) {
            // Jika tidak cocok, hentikan request dan tampilkan halaman error 403
            abort(403, 'AKSES DITOLAK. Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        // Jika dinasnya cocok, lanjutkan request ke controller
        return $next($request);
    }
}
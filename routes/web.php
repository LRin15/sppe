<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Alternatif 1: Redirect otomatis berdasarkan status auth
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

// Alternatif 2: Langsung tampilkan halaman login di root
// Route::get('/', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])
//     ->middleware('guest')
//     ->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
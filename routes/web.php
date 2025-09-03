<?php

use App\Http\Controllers\DinasPerikananController;
use App\Http\Controllers\DinasPerikananExportController;
use Illuminate\Support\Facades\Route;

// Root redirect
Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dinas-perikanan/dashboard');
    }
    return redirect()->route('login');
})->name('home');


// Test route (sementara untuk debugging)
Route::get('/test', function () {
    return 'Test route working! User: ' . (auth()->check() ? auth()->user()->name : 'Not logged in');
});

Route::get('/test-auth', function () {
    return 'Auth test: ' . (auth()->check() ? 'Logged in as ' . auth()->user()->name : 'Not logged in');
})->middleware('auth');

// Dinas Perikanan routes
Route::middleware(['auth', 'verified'])
    ->prefix('dinas-perikanan')
    ->name('dinas-perikanan.')
    ->group(function () {
        // Test route di dalam group
        Route::get('test', function () {
            return 'Dinas perikanan group working! User: ' . auth()->user()->name;
        });

        Route::get('input', [DinasPerikananController::class, 'input'])->name('input');
        Route::get('dashboard', [DinasPerikananController::class, 'dashboard'])->name('dashboard');
        Route::post('store', [DinasPerikananController::class, 'storeInput'])->name('store');
        Route::get('export', [DinasPerikananExportController::class, 'export'])->name('export');
        Route::get('edit', [DinasPerikananController::class, 'edit'])->name('edit');
        Route::post('store-edit', [DinasPerikananController::class, 'storeEdit'])->name('store-edit');
    });



// Include auth routes
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';

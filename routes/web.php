<?php

use App\Http\Controllers\DinasPerikananController;
use App\Http\Controllers\DinasPerikananExportController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

// Root redirect
Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();
        
        // Arahkan berdasarkan dinas pengguna, sama seperti logika login
        return match ($user->dinas) {
            'perikanan' => redirect()->route('dinas-perikanan.dashboard'),
            default => redirect()->route('dashboard'),
        };
    }

    return redirect()->route('login');
})->name('home');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Test route (sementara untuk debugging)
Route::get('/test', function () {
    return 'Test route working! User: ' . (auth()->check() ? auth()->user()->name : 'Not logged in');
});

Route::get('/test-auth', function () {
    return 'Auth test: ' . (auth()->check() ? 'Logged in as ' . auth()->user()->name : 'Not logged in');
})->middleware('auth');

// Dinas Perikanan routes
Route::middleware(['auth', 'verified', 'dinas.check:perikanan'])
    ->prefix('dinas-perikanan')
    ->name('dinas-perikanan.')
    ->group(function () {
        // Test route di dalam group
        Route::get('test', function () {
            return 'Dinas perikanan group working! User: ' . auth()->user()->name;
        });

        // Dashboard dengan chart dan filter
        Route::get('dashboard', [DinasPerikananController::class, 'dashboard'])->name('dashboard');

        // Data viewing page
        Route::get('data', [DinasPerikananController::class, 'data'])->name('data');

        // Input data page
        Route::get('input', [DinasPerikananController::class, 'input'])->name('input');
        Route::post('store', [DinasPerikananController::class, 'storeInput'])->name('store');

        // Edit data page
        Route::get('edit', [DinasPerikananController::class, 'edit'])->name('edit');
        Route::post('store-edit', [DinasPerikananController::class, 'storeEdit'])->name('store-edit');

        // Export functionality
        Route::get('export', [DinasPerikananExportController::class, 'export'])->name('export');

        Route::get('table-data', [DinasPerikananController::class, 'getTableData']);
    });

// Include auth routes
require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // Inertia akan secara otomatis membagikan data 'auth.user'
        // jadi kita hanya perlu merender nama view-nya.
        return Inertia::render('Dashboard');
    }
}
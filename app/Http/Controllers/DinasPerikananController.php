<?php

// app/Http/Controllers/DinasPerikananController.php
namespace App\Http\Controllers;

use App\Models\DataPerikanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class DinasPerikananController extends Controller
{
    // Daftar indikator yang tetap
    private $indikatorList = [
        "Penangkapan Di Laut",
        "Penangkapan di perairan umum",
        "Budidaya laut (rumput laut)",
        "Budidaya Tambak (rumput laut)",
        "Budidaya Tambak (udang)",
        "Budidaya Tambak (ikan lainnya)",
        "Budidaya Kolam",
    ];

    // Method untuk menampilkan halaman Dashboard
    public function dashboard(Request $request)
    {
        // Konversi bulan dari bahasa Indonesia ke bahasa Inggris untuk konsistensi
        $bulanMap = [
            'Januari' => 'January',
            'Februari' => 'February',
            'Maret' => 'March',
            'April' => 'April',
            'Mei' => 'May',
            'Juni' => 'June',
            'Juli' => 'July',
            'Agustus' => 'August',
            'September' => 'September',
            'Oktober' => 'October',
            'November' => 'November',
            'Desember' => 'December'
        ];

        // Validasi request filter, jika tidak ada, gunakan tahun dan bulan saat ini
        $tahun = $request->input('tahun', date('Y'));
        $bulanInput = $request->input('bulan', 'Januari'); // Default ke Januari
        
        // Konversi ke bahasa Inggris untuk database jika diperlukan
        $bulanForDatabase = $bulanMap[$bulanInput] ?? $bulanInput;

        // Ambil data dari database berdasarkan filter
        $dataPerikanan = DataPerikanan::where('tahun', $tahun)
            ->where('bulan', $bulanForDatabase)
            ->get();

        return Inertia::render('DinasPerikanan/Dashboard', [
            'dataPerikanan' => $dataPerikanan,
            'filters' => ['tahun' => $tahun, 'bulan' => $bulanInput],
        ]);
    }

    // Method untuk menampilkan halaman Input
    public function input(Request $request)
{
    $bulanMap = [
        'Januari' => 'January',
        'Februari' => 'February',
        'Maret' => 'March',
        'April' => 'April',
        'Mei' => 'May',
        'Juni' => 'June',
        'Juli' => 'July',
        'Agustus' => 'August',
        'September' => 'September',
        'Oktober' => 'October',
        'November' => 'November',
        'Desember' => 'December'
    ];

    $tahun = $request->input('tahun', date('Y'));
    $bulanInput = $request->input('bulan', 'Januari');
    $bulanForDatabase = $bulanMap[$bulanInput] ?? $bulanInput;

    // Debug: log filter yang diterima
    \Log::info('Input filters received:', ['tahun' => $tahun, 'bulan' => $bulanInput, 'bulan_db' => $bulanForDatabase]);

    // Ambil data yang sudah ada untuk di-edit
    $existingData = DataPerikanan::where('tahun', $tahun)
        ->where('bulan', $bulanForDatabase)
        ->pluck('nilai', 'indikator');

    \Log::info('Existing data found:', $existingData->toArray());

    // Gabungkan data yang ada dengan daftar indikator
    $formData = collect($this->indikatorList)->mapWithKeys(function ($indikator) use ($existingData) {
        return [$indikator => $existingData->get($indikator, '')]; // Default ke empty string jika tidak ada
    });

    return Inertia::render('DinasPerikanan/Input', [
        'formData' => $formData,
        'filters' => ['tahun' => $tahun, 'bulan' => $bulanInput],
        'indikatorList' => $this->indikatorList,
        'success' => session('success')
    ]);
}

    // Method untuk menyimpan atau update data
    public function store(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'bulan' => 'required|string',
            'data' => 'required|array',
        ]);

        $bulanMap = [
            'Januari' => 'January',
            'Februari' => 'February',
            'Maret' => 'March',
            'April' => 'April',
            'Mei' => 'May',
            'Juni' => 'June',
            'Juli' => 'July',
            'Agustus' => 'August',
            'September' => 'September',
            'Oktober' => 'October',
            'November' => 'November',
            'Desember' => 'December'
        ];

        $bulanForDatabase = $bulanMap[$request->bulan] ?? $request->bulan;

        foreach ($request->data as $indikator => $nilai) {
            DataPerikanan::updateOrCreate(
                [
                    'tahun' => $request->tahun,
                    'bulan' => $bulanForDatabase,
                    'indikator' => $indikator,
                ],
                [
                    'nilai' => $nilai,
                ]
            );
        }

        return Redirect::route('dinas-perikanan.input', ['tahun' => $request->tahun, 'bulan' => $request->bulan])
            ->with('success', 'Data berhasil disimpan!');
    }
}
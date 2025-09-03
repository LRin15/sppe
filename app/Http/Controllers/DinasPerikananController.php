<?php

namespace App\Http\Controllers;

use App\Models\DataPerikanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class DinasPerikananController extends Controller
{
    private $indikatorList = [
        "Penangkapan Di Laut",
        "Penangkapan di perairan umum",
        "Budidaya laut (rumput laut)",
        "Budidaya Tambak (rumput laut)",
        "Budidaya Tambak (udang)",
        "Budidaya Tambak (ikan lainnya)",
        "Budidaya Kolam",
    ];

    // Dashboard
    public function dashboard(Request $request)
    {
        $tahun = $request->input('tahun', date('Y'));
        $bulan = $request->input('bulan', 'Januari');

        $dataPerikanan = DataPerikanan::where('tahun', $tahun)
            ->where('bulan', $bulan)
            ->get();

        return Inertia::render('DinasPerikanan/Dashboard', [
            'dataPerikanan' => $dataPerikanan,
            'filters' => ['tahun' => $tahun, 'bulan' => $bulan],
            'success' => session('success'),
        ]);
    }

    // Input Page
    public function input(Request $request)
    {
        $tahun = $request->input('tahun', date('Y'));
        $bulan = $request->input('bulan', 'Januari');

        $existingData = DataPerikanan::where('tahun', $tahun)
            ->where('bulan', $bulan)
            ->pluck('nilai', 'indikator');

        $formData = collect($this->indikatorList)->mapWithKeys(function ($indikator) use ($existingData) {
            return [$indikator => $existingData->get($indikator, '')];
        });

        return Inertia::render('DinasPerikanan/Input', [
            'formData' => $formData,
            'filters' => ['tahun' => $tahun, 'bulan' => $bulan],
            'indikatorList' => $this->indikatorList,
            'success' => session('success')
        ]);
    }

    // Edit Page
    public function edit(Request $request)
    {
        $tahun = $request->tahun;
        $bulan = $request->bulan;

        $dataPerikanan = DataPerikanan::where('tahun', $tahun)
            ->where('bulan', $bulan)
            ->get()
            ->keyBy('indikator')
            ->map(fn($item) => $item->nilai)
            ->toArray();

        return Inertia::render('DinasPerikanan/Edit', [
            'formData' => $dataPerikanan,
            'filters' => ['tahun' => $tahun, 'bulan' => $bulan],
            'indikatorList' => $this->indikatorList,
        ]);
    }

    // Store untuk Input → redirect ke Input Page (seperti sebelumnya)
    public function storeInput(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'bulan' => 'required|string',
            'data' => 'required|array',
        ]);

        foreach ($request->input('data', []) as $indikator => $nilai) {
            if ($nilai === null || $nilai === '') continue;

            DataPerikanan::updateOrCreate(
                [
                    'tahun' => $request->tahun,
                    'bulan' => $request->bulan,
                    'indikator' => $indikator,
                ],
                ['nilai' => $nilai]
            );
        }

        return Redirect::route('dinas-perikanan.input', [
            'tahun' => $request->tahun,
            'bulan' => $request->bulan,
        ])->with('success', 'Data berhasil disimpan!');
    }

    // Store untuk Edit → redirect ke Dashboard
    public function storeEdit(Request $request)
    {
        $request->validate([
            'tahun' => 'required|integer',
            'bulan' => 'required|string',
            'data' => 'required|array',
        ]);

        foreach ($request->input('data', []) as $indikator => $nilai) {
            if ($nilai === null || $nilai === '') continue;

            DataPerikanan::updateOrCreate(
                [
                    'tahun' => $request->tahun,
                    'bulan' => $request->bulan,
                    'indikator' => $indikator,
                ],
                ['nilai' => $nilai]
            );
        }

        return Redirect::route('dinas-perikanan.dashboard', [
            'tahun' => $request->tahun,
            'bulan' => $request->bulan,
        ])->with('success', 'Data berhasil disimpan!');
    }
}

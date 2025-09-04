<?php

namespace App\Http\Controllers;

use App\Models\DataPerikanan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;

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

    private $bulanOrder = [
        'Januari' => 1,
        'Februari' => 2,
        'Maret' => 3,
        'April' => 4,
        'Mei' => 5,
        'Juni' => 6,
        'Juli' => 7,
        'Agustus' => 8,
        'September' => 9,
        'Oktober' => 10,
        'November' => 11,
        'Desember' => 12
    ];

    // Dashboard
    public function dashboard(Request $request)
    {
        // Debug: Log incoming request
        \Log::info('Dashboard request:', $request->all());

        // Ambil semua tahun & indikator dari database
        $availableYears = DataPerikanan::selectRaw('DISTINCT tahun')
            ->orderBy('tahun', 'desc')
            ->pluck('tahun')
            ->toArray();

        $indikatorList = DataPerikanan::selectRaw('DISTINCT indikator')
            ->orderBy('indikator')
            ->pluck('indikator')
            ->toArray();

        // FIXED: Ambil filter dari request dengan validasi yang lebih ketat
        $selectedYears = $request->input('years', []);
        $selectedIndicator = $request->input('indicator', '');

        // Pastikan selectedYears adalah array
        if (!is_array($selectedYears)) {
            $selectedYears = [$selectedYears];
        }

        // Filter selectedYears yang valid (hapus nilai kosong)
        $selectedYears = array_filter(array_map('intval', $selectedYears));

        // Kalau tidak ada pilihan tahun → pakai default tahun terakhir
        if (empty($selectedYears) && !empty($availableYears)) {
            $selectedYears = [max($availableYears)];
        }

        // Kalau indikator kosong → pakai indikator pertama
        if (empty($selectedIndicator) && !empty($indikatorList)) {
            $selectedIndicator = $indikatorList[0];
        }

        // Debug: Log processed filters
        \Log::info('Processed filters:', [
            'selectedYears' => $selectedYears,
            'selectedIndicator' => $selectedIndicator
        ]);

        // Ambil data untuk dashboard
        $dashboardStats = $this->getDashboardStats($selectedYears, $selectedIndicator);
        $chartData = $this->getChartData($selectedYears, $selectedIndicator);
        $comparisonData = $this->getComparisonData($selectedYears);
        $recentUpdates = $this->getRecentUpdates();

        // Debug: Log chart data
        \Log::info('Chart data result:', ['count' => count($chartData), 'sample' => array_slice($chartData, 0, 2)]);

        return Inertia::render('DinasPerikanan/Dashboard', [
            'availableYears' => $availableYears,
            'selectedYears' => $selectedYears,
            'selectedIndicator' => $selectedIndicator,
            'indikatorList' => $indikatorList,
            'dashboardStats' => $dashboardStats,
            'chartData' => $chartData,
            'comparisonData' => $comparisonData,
            'recentUpdates' => $recentUpdates,
            'filters' => [
                'years' => $selectedYears,
                'indicator' => $selectedIndicator,
            ],
        ]);
    }

    private function getDashboardStats($selectedYears, $selectedIndicator)
    {
        if (empty($selectedYears) || empty($selectedIndicator)) {
            return [
                'totalRecords' => 0,
                'totalProduction' => 0,
                'averageProduction' => 0,
                'growthRate' => 0,
                'completionRate' => 0,
            ];
        }

        $query = DataPerikanan::whereIn('tahun', $selectedYears)
            ->where('indikator', $selectedIndicator);

        $totalRecords = $query->count();
        $totalProduction = $query->sum('nilai');
        $averageProduction = $query->avg('nilai');

        // Growth rate (misal tahun terakhir dibanding tahun sebelumnya)
        $growthRate = 0;
        if (count($selectedYears) >= 2) {
            $lastYear = max($selectedYears);
            $prevYear = $lastYear - 1;

            $lastTotal = DataPerikanan::where('tahun', $lastYear)
                ->where('indikator', $selectedIndicator)
                ->sum('nilai');

            $prevTotal = DataPerikanan::where('tahun', $prevYear)
                ->where('indikator', $selectedIndicator)
                ->sum('nilai');

            if ($prevTotal > 0) {
                $growthRate = (($lastTotal - $prevTotal) / $prevTotal) * 100;
            }
        }

        return [
            'totalRecords' => $totalRecords,
            'totalProduction' => $totalProduction,
            'averageProduction' => $averageProduction,
            'growthRate' => $growthRate,
            'completionRate' => 100, // misal selalu 100% (bisa disesuaikan)
        ];
    }

    // FIXED: Method getChartData dengan logging dan validasi yang lebih ketat
    private function getChartData($selectedYears, $selectedIndicator)
    {
        // Debug: Log input parameters
        \Log::info('getChartData called with:', [
            'selectedYears' => $selectedYears,
            'selectedIndicator' => $selectedIndicator
        ]);

        if (empty($selectedYears) || empty($selectedIndicator)) {
            \Log::warning('getChartData: Empty years or indicator');
            return [];
        }

        // FIXED: Query dengan logging untuk debugging
        $query = DataPerikanan::whereIn('tahun', $selectedYears)
            ->where('indikator', $selectedIndicator)
            ->select('tahun', 'bulan', 'nilai')
            ->orderBy('tahun')
            ->orderByRaw("FIELD(bulan, 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember')");

        // Debug: Log SQL query
        \Log::info('Chart data SQL:', ['sql' => $query->toSql(), 'bindings' => $query->getBindings()]);

        $rawData = $query->get();

        // Debug: Log raw data
        \Log::info('Raw data from database:', [
            'count' => $rawData->count(),
            'sample' => $rawData->take(5)->toArray()
        ]);

        if ($rawData->isEmpty()) {
            \Log::warning('No data found for the specified filters');
            return [];
        }

        // Group data by tahun dan bulan
        $groupedData = $rawData->groupBy('tahun');

        // Debug: Log grouped data structure
        \Log::info('Grouped data keys:', ['years' => $groupedData->keys()->toArray()]);

        // Buat array hasil dengan struktur yang sesuai untuk Recharts
        $chartData = [];

        // Buat array untuk setiap bulan
        foreach (array_keys($this->bulanOrder) as $bulan) {
            $monthData = ['month' => $bulan];

            // Untuk setiap tahun yang dipilih
            foreach ($selectedYears as $tahun) {
                $nilai = 0;
                if (isset($groupedData[$tahun])) {
                    $bulanData = $groupedData[$tahun]->where('bulan', $bulan)->first();
                    if ($bulanData) {
                        $nilai = floatval($bulanData->nilai);
                    }
                }
                $monthData[(string)$tahun] = $nilai;
            }

            $chartData[] = $monthData;
        }

        // Debug: Log final chart data
        \Log::info('Final chart data:', ['sample' => array_slice($chartData, 0, 3)]);

        return $chartData;
    }

    private function getComparisonData($selectedYears)
    {
        if (empty($selectedYears)) {
            return [];
        }

        $comparisonData = [];

        foreach ($this->indikatorList as $indikator) {
            $yearlyTotals = [];

            foreach ($selectedYears as $year) {
                $total = DataPerikanan::where('indikator', $indikator)
                    ->where('tahun', $year)
                    ->sum(DB::raw('CAST(nilai AS DECIMAL(15,2))'));

                $yearlyTotals[$year] = round($total, 2);
            }

            $comparisonData[] = [
                'indicator' => $indikator,
                'yearlyTotals' => $yearlyTotals,
                'total' => array_sum($yearlyTotals),
                'average' => count($yearlyTotals) > 0 ? array_sum($yearlyTotals) / count($yearlyTotals) : 0
            ];
        }

        // Sort by total descending
        usort($comparisonData, function ($a, $b) {
            return $b['total'] <=> $a['total'];
        });

        return $comparisonData;
    }

    private function getRecentUpdates()
    {
        return DataPerikanan::select('tahun', 'bulan', 'indikator', 'nilai', 'updated_at')
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'period' => $item->bulan . ' ' . $item->tahun,
                    'indicator' => $item->indikator,
                    'value' => $item->nilai,
                    'updated_at' => $item->updated_at->format('d M Y H:i')
                ];
            });
    }

    //tabel
    public function getTableData(Request $request)
    {
        $indicators = $request->input('indicators', []);
        $years = $request->input('years', []);
        $months = $request->input('months', []);

        $query = DataPerikanan::query();

        if (!empty($indicators)) {
            $query->whereIn('indikator', $indicators);
        }
        if (!empty($years)) {
            $query->whereIn('tahun', $years);
        }
        if (!empty($months)) {
            $query->whereIn('bulan', $months);
        }

        $raw = $query->get();

        // Reshape data
        $grouped = [];
        foreach ($raw as $row) {
            $key = $row->indikator . '-' . $row->tahun;

            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'indikator' => $row->indikator,
                    'tahun' => $row->tahun,
                ];
            }
            $grouped[$key][$row->bulan] = $row->nilai;
        }

        return response()->json(array_values($grouped));
    }


    // Data
    public function data(Request $request)
    {
        $tahun = $request->input('tahun', date('Y'));
        $bulan = $request->input('bulan', 'Januari');

        $dataPerikanan = DataPerikanan::where('tahun', $tahun)
            ->where('bulan', $bulan)
            ->get();

        return Inertia::render('DinasPerikanan/Data', [
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

    // Store untuk Input → redirect ke Input Page
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

        return Redirect::route('dinas-perikanan.data')
            ->with('success', 'Data berhasil diperbarui!');
    }
}

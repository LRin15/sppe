<?php

namespace App\Http\Controllers;

use App\Models\ExportDataPerikanan;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DinasPerikananExportController extends Controller
{
    public function export(Request $request)
    {
        $tahun = $request->get('tahun');
        $bulan = $request->get('bulan');
        $format = $request->get('format', 'csv'); // default csv

        // Ambil data sesuai filter
        $data = ExportDataPerikanan::where('tahun', $tahun)
            ->where('bulan', $bulan)
            ->get(['indikator', 'nilai']);

        if ($data->isEmpty()) {
            return back()->with('error', 'Data tidak tersedia untuk periode yang dipilih.');
        }

        // === EXPORT CSV ===
        if ($format === 'csv') {
            $filename = "data_perikanan_{$bulan}_{$tahun}.csv";

            $headers = [
                "Content-type"        => "text/csv",
                "Content-Disposition" => "attachment; filename=$filename",
                "Pragma"              => "no-cache",
                "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
                "Expires"             => "0"
            ];

            $columns = ['Indikator', 'Jumlah (Ton)'];

            $callback = function () use ($data, $columns) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $columns);

                foreach ($data as $row) {
                    fputcsv($file, [
                        $row->indikator,
                        $row->nilai,
                    ]);
                }

                fclose($file);
            };

            return new StreamedResponse($callback, 200, $headers);
        }

        // === EXPORT XLSX ===
        if ($format === 'xlsx') {
            $filename = "data_perikanan_{$bulan}_{$tahun}.xlsx";

            return Excel::download(new class($data) implements \Maatwebsite\Excel\Concerns\FromArray, \Maatwebsite\Excel\Concerns\WithHeadings {
                private $data;

                public function __construct($data)
                {
                    $this->data = $data;
                }

                public function array(): array
                {
                    return $this->data->map(function ($row) {
                        return [
                            'Indikator' => $row->indikator,
                            'Jumlah (Ton)' => $row->nilai,
                        ];
                    })->toArray();
                }

                public function headings(): array
                {
                    return ['Indikator', 'Jumlah (Ton)'];
                }
            }, $filename);
        }

        return back()->with('error', 'Format export tidak valid.');
    }
}

// resources/js/Pages/DinasPerikanan/Data.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, useEffect, useState } from 'react';
import {
    ChartBarIcon,
    CalendarIcon,
    DocumentTextIcon,
    EyeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

interface DataPerikananItem {
    id: number;
    tahun: number;
    bulan: string;
    indikator: string;
    nilai: string | number;
}

interface Filters {
    tahun: string;
    bulan: string;
    [key: string]: any;
}

interface DataPageProps extends PageProps {
    dataPerikanan: DataPerikananItem[];
    filters: Filters;
}

const FilterComponent = ({ filters, onFilterChange }: { filters: Filters; onFilterChange: (key: keyof Filters, value: string) => void }) => {
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onFilterChange(e.target.name as keyof Filters, e.target.value);
    };

    return (
        <div className="mb-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                    <CalendarIcon className="h-6 w-6 mr-3 text-gray-600" />
                    <h2 className="text-l font-semibold text-gray-900">Filter Periode Data</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                        <select
                            id="tahun"
                            name="tahun"
                            value={filters.tahun}
                            onChange={handleSelectChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                        <select
                            id="bulan"
                            name="bulan"
                            value={filters.bulan}
                            onChange={handleSelectChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                        >
                            {months.map((month) => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ActionButtons = ({ filters, data }: { filters: Filters; data: DataPerikananItem[] }) => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleExport = (format: string) => {
        const params = new URLSearchParams({ tahun: filters.tahun, bulan: filters.bulan, format });
        window.location.href = `/dinas-perikanan/export?${params.toString()}`;
        setShowExportMenu(false);
    };

    const handleEdit = () => {
        router.get('/dinas-perikanan/edit', 
            { tahun: filters.tahun, bulan: filters.bulan },
            {
                preserveState: true,
                replace: true,
                only: ['formData', 'filters', 'indikatorList']
            }
        );
    };

    return (
        <div className="mb-6 bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex justify-end gap-3 relative">
            {/* Tombol Edit Data */}
            <button
                onClick={handleEdit}
                disabled={data.length === 0}
                className="px-5 py-3 rounded-xl font-semibold text-sm text-white bg-yellow-600 hover:bg-yellow-700 shadow-md transition disabled:opacity-50"
            >
                Edit Data
            </button>

            {/* Tombol Export */}
            <div className="relative">
                <button
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={data.length === 0}
                    className="px-5 py-3 rounded-xl font-semibold text-sm text-white bg-green-600 hover:bg-green-700 shadow-md transition disabled:opacity-50"
                >
                    Export
                </button>

                {showExportMenu && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                        <button
                            onClick={() => handleExport('csv')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
                        >
                            Export CSV
                        </button>
                        <button
                            onClick={() => handleExport('xlsx')}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-xl"
                        >
                            Export XLSX
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Data({ auth, dataPerikanan, filters }: DataPageProps) {
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);

    const indikatorOrder = [
        'Penangkapan Di Laut',
        'Penangkapan di perairan umum',
        'Budidaya laut (rumput laut)',
        'Budidaya Tambak (rumput laut)',
        'Budidaya Tambak (udang)',
        'Budidaya Tambak (ikan lainnya)',
        'Budidaya Kolam',
    ];

    const getSortedData = (data: DataPerikananItem[]) =>
        data.sort((a, b) => {
            const indexA = indikatorOrder.indexOf(a.indikator);
            const indexB = indikatorOrder.indexOf(b.indikator);
            if (indexA === -1 && indexB === -1) return 0;
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setCurrentFilters((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => setCurrentFilters(filters), [filters]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (currentFilters.tahun !== filters.tahun || currentFilters.bulan !== filters.bulan) {
                router.get('/dinas-perikanan/data', currentFilters, {
                    preserveState: true,
                    replace: true,
                    only: ['dataPerikanan', 'filters'],
                });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [currentFilters]);

    const sortedData = getSortedData(dataPerikanan);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-lg leading-tight font-bold text-gray-800">Data Perikanan</h2>}
        >
            <Head title="Data Perikanan" />

            <div className="min-h-screen bg-white -m-6 p-6">
                <div className="mx-auto max-w-5xl">
                    <FilterComponent filters={currentFilters} onFilterChange={handleFilterChange} />
                    <ActionButtons filters={currentFilters} data={sortedData} />

                    <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="bg-gray-800 p-6">
                            <h3 className="text-lg font-bold text-white">Data Perikanan</h3>
                            <p className="text-gray-300 mt-2 text-sm">
                                Periode: <span className="font-semibold text-blue-300">{currentFilters.bulan} {currentFilters.tahun}</span>
                            </p>
                        </div>

                        <div className="overflow-hidden">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-700">
                                        <th className="w-2/3 px-8 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">
                                            Indikator
                                        </th>
                                        <th className="w-1/3 px-8 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">
                                            Jumlah (Ton)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {sortedData.length > 0 ? (
                                        sortedData.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                                <td className="px-8 py-4 text-sm font-medium text-gray-900">{item.indikator}</td>
                                                <td className="px-8 py-4 text-sm text-right text-gray-600 font-medium">{item.nilai}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className="px-8 py-6 text-center text-sm text-gray-500">
                                                Data tidak ditemukan untuk periode {filters.bulan} {filters.tahun}.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

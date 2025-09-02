// resources/js/Pages/DinasPerikanan/Dashboard.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types'; // Pastikan path ini benar
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, useEffect, useState } from 'react';

// Definisi Tipe Data
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

interface DashboardPageProps extends PageProps {
    dataPerikanan: DataPerikananItem[];
    filters: Filters;
}

// Komponen Filter (dengan typing)
const FilterComponent = ({ filters, onFilterChange }: { filters: Filters; onFilterChange: (key: keyof Filters, value: string) => void }) => {
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onFilterChange(e.target.name as keyof Filters, e.target.value);
    };

    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
                <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">
                    Tahun
                </label>
                <select
                    id="tahun"
                    name="tahun"
                    value={filters.tahun}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex-1">
                <label htmlFor="bulan" className="block text-sm font-medium text-gray-700">
                    Bulan
                </label>
                <select
                    id="bulan"
                    name="bulan"
                    value={filters.bulan}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pr-10 pl-3 text-base focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                >
                    {months.map((month) => (
                        <option key={month} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default function Dashboard({ auth, dataPerikanan, filters }: DashboardPageProps) {
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setCurrentFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    };

    useEffect(() => {
        // Update filters saat props berubah
        setCurrentFilters(filters);
    }, [filters]);

    useEffect(() => {
        // Delay untuk mencegah request berlebihan
        const timeoutId = setTimeout(() => {
            if (currentFilters.tahun !== filters.tahun || currentFilters.bulan !== filters.bulan) {
                router.get(
                    '/dinas-perikanan/dashboard',
                    {
                        tahun: currentFilters.tahun,
                        bulan: currentFilters.bulan,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        only: ['dataPerikanan', 'filters'],
                    },
                );
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [currentFilters]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Dashboard Dinas Perikanan</h2>}
        >
            <Head title="Dashboard Perikanan" />

            <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                <FilterComponent filters={currentFilters} onFilterChange={handleFilterChange} />

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                                    Indikator
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                                    Jumlah (Ton)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {dataPerikanan.length > 0 ? (
                                dataPerikanan.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{item.indikator}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">{item.nilai}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                                        Data tidak ditemukan untuk periode {filters.bulan} {filters.tahun}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

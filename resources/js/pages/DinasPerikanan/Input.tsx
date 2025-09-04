// resources/js/Pages/DinasPerikanan/Input.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
    ChartBarIcon,
    CalendarIcon,
    DocumentTextIcon,
    EyeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

// Definisi Tipe Data
interface Filters {
    tahun: string;
    bulan: string;
    [key: string]: any;
}

interface FormData {
    [key: string]: string | number;
}

interface InputPageProps extends PageProps {
    formData: FormData;
    filters: Filters;
    indikatorList: string[];
    success?: string;
}

const FilterComponent = ({ filters, onFilterChange }: { filters: Filters; onFilterChange: (key: keyof Filters, value: string) => void }) => {
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onFilterChange(e.target.name as keyof Filters, e.target.value);
    };

    return (
        <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                    <CalendarIcon className="h-6 w-6 mr-3 text-gray-600" />
                    <h2 className="text-l font-semibold text-gray-900">Filter Periode Data</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="group">
                        <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-2">
                            Tahun
                        </label>
                        <select
                            id="tahun"
                            name="tahun"
                            value={filters.tahun}
                            onChange={handleSelectChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-blue-300"
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="group">
                        <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-2">
                            Bulan
                        </label>
                        <select
                            id="bulan"
                            name="bulan"
                            value={filters.bulan}
                            onChange={handleSelectChange}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 hover:border-purple-300"
                        >
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Input({ auth, formData, filters, indikatorList, success }: InputPageProps) {
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        tahun: currentFilters.tahun,
        bulan: currentFilters.bulan,
        data: formData,
    });

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setCurrentFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Update form data ketika filter berubah
    useEffect(() => {
        if (currentFilters.tahun !== filters.tahun || currentFilters.bulan !== filters.bulan) {
            router.get('/dinas-perikanan/input', currentFilters, {
                preserveState: true,
                replace: true,
            });
        }
    }, [currentFilters]);

    // Update useForm data ketika currentFilters berubah
    useEffect(() => {
        setData({
            tahun: currentFilters.tahun,
            bulan: currentFilters.bulan,
            data: data.data
        });
    }, [currentFilters.tahun, currentFilters.bulan]);

    // Reset form setelah sukses
    useEffect(() => {
        if (recentlySuccessful) {
            const emptyData = Object.keys(data.data).reduce((acc, key) => {
                acc[key] = '';
                return acc;
            }, {} as { [key: string]: string });
            
            setData('data', emptyData);
        }
    }, [recentlySuccessful]);

    const handleInputChange = (indikator: string, value: string) => {
        setData('data', {
            ...data.data,
            [indikator]: value,
        });
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Buat payload yang jelas
        const payload = {
            tahun: currentFilters.tahun,
            bulan: currentFilters.bulan,
            data: data.data
        };
        
        console.log('=== FRONTEND SUBMIT ===');
        console.log('Current Filters:', currentFilters);
        console.log('Form Data:', data);
        console.log('Payload to send:', payload);
        
        // Update useForm data dan submit
        setData(payload);
        
        // Submit setelah data ter-update
        setTimeout(() => {
            post('/dinas-perikanan/store');
        }, 50);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center">
                    <h2 className="text-lg leading-tight font-bold text-gray-800">Input Data</h2>
                </div>
            }
        >
            <Head title="Input Data Perikanan" />

            <div className="min-h-screen bg-white -m-6 p-6">
                <div className="mx-auto max-w-5xl">
                    <FilterComponent filters={currentFilters} onFilterChange={handleFilterChange} />

                    {recentlySuccessful && success && (
                        <div className="mb-6 relative">
                            <div className="bg-white rounded-2xl border border-green-200 shadow-xl p-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-green-800 font-medium text-sm">{success}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="mt-8">
                        <div className="overflow-hidden rounded-2xl border-2 border-gray-100 shadow-lg">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800">
                                        <th className="w-1/2 px-8 py-6 text-left text-xs text-middle font-bold tracking-wider text-white uppercase">
                                            Indikator
                                        </th>
                                        <th className="w-1/2 text-middle px-8 py-6 text-left text-xs font-bold tracking-wider text-white uppercase">
                                            Jumlah (Ton)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {indikatorList.map((indikator) => (
                                        <tr
                                            key={indikator}
                                            className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-semibold text-gray-900">{indikator}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 hover:border-blue-300 text-right font-medium"
                                                        value={data.data[indikator] || ''}
                                                        onChange={(e) => handleInputChange(indikator, e.target.value)}
                                                        placeholder="0.00"
                                                    />
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                        <span className="text-gray-400 font-medium text-xs">Ton</span>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-2xl text-white font-bold shadow-xl hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 transform hover:scale-105 focus:ring-4 focus:ring-gray-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                        Simpan Data
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
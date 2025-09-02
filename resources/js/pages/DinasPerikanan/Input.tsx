// resources/js/Pages/DinasPerikanan/Input.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

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
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-lg border bg-gray-50 p-4 md:grid-cols-2">
            <div>
                <label htmlFor="tahun" className="block text-sm font-medium text-gray-700">
                    Tahun
                </label>
                <select
                    id="tahun"
                    name="tahun"
                    value={filters.tahun}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="bulan" className="block text-sm font-medium text-gray-700">
                    Bulan
                </label>
                <select
                    id="bulan"
                    name="bulan"
                    value={filters.bulan}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

export default function Input({ auth, formData, filters, indikatorList, success }: InputPageProps) {
    const [currentFilters, setCurrentFilters] = useState<Filters>(filters);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        tahun: filters.tahun,
        bulan: filters.bulan,
        data: formData,
    });

    const handleFilterChange = (key: keyof Filters, value: string) => {
        setCurrentFilters((prev) => ({ ...prev, [key]: value }));
    };

    // Update filter state ketika props berubah
    useEffect(() => {
        setCurrentFilters(filters);
        setData({
            tahun: filters.tahun,
            bulan: filters.bulan,
            data: formData,
        });
    }, [filters, formData]);

    // Handle filter change dengan debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (currentFilters.tahun !== filters.tahun || currentFilters.bulan !== filters.bulan) {
                router.get(
                    '/dinas-perikanan/input',
                    {
                        tahun: currentFilters.tahun,
                        bulan: currentFilters.bulan,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        only: ['formData', 'filters'], // Hanya reload data yang diperlukan
                    },
                );
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [currentFilters]);

    const handleInputChange = (indikator: string, value: string) => {
        setData('data', {
            ...data.data,
            [indikator]: value,
        });
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Update data dengan filter terbaru sebelum submit
        const updatedData = {
            tahun: currentFilters.tahun,
            bulan: currentFilters.bulan,
            data: data.data,
        };

        post('/dinas-perikanan/store', {
            data: updatedData,
            onSuccess: () => {
                // Reload data setelah berhasil menyimpan
                router.reload({ only: ['formData', 'success'] });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Input Data Dinas Perikanan</h2>}
        >
            <Head title="Input Data Perikanan" />

            <div className="mx-auto max-w-4xl">
                <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                    <FilterComponent filters={currentFilters} onFilterChange={handleFilterChange} />

                    {(recentlySuccessful || success) && (
                        <div className="mb-4 rounded-lg border border-green-400 bg-green-100 px-4 py-3 text-green-700" role="alert">
                            {success || 'Data berhasil disimpan!'}
                        </div>
                    )}

                    <div className="mb-4 text-sm text-gray-600">
                        Menampilkan data untuk:{' '}
                        <strong>
                            {currentFilters.bulan} {currentFilters.tahun}
                        </strong>
                    </div>

                    <form onSubmit={submit}>
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="min-w-full">
                                <thead className="bg-gray-800">
                                    <tr>
                                        <th className="w-1/2 px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                                            Indikator
                                        </th>
                                        <th className="w-1/2 px-6 py-3 text-left text-xs font-medium tracking-wider text-white uppercase">
                                            Jumlah (Ton)
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {indikatorList.map((indikator) => (
                                        <tr key={indikator} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{indikator}</td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    value={data.data[indikator] || ''}
                                                    onChange={(e) => handleInputChange(indikator, e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                {errors[`data.${indikator}`] && (
                                                    <p className="mt-1 text-sm text-red-600">{errors[`data.${indikator}`]}</p>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-gray-800 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                                disabled={processing}
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

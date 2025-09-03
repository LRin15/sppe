import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';

interface DataPerikananItem {
    id?: number;
    indikator: string;
    nilai: string | number;
}

interface Filters {
    tahun: string;
    bulan: string;
}

interface EditPageProps extends PageProps {
    formData: Record<string, string | number>;
    filters: Filters;
    indikatorList: string[];
    success?: string;
}

export default function Edit({ auth, formData, filters, indikatorList, success }: EditPageProps) {
    const [data, setData] = useState<DataPerikananItem[]>(
        indikatorList.map((indikator) => ({
            indikator,
            nilai: formData[indikator] ?? '',
        }))
    );

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const updated = [...data];
        updated[index].nilai = e.target.value;
        setData(updated);
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const payload = {
            tahun: filters.tahun,
            bulan: filters.bulan,
            data: data.reduce((acc, item) => {
                acc[item.indikator] = item.nilai;
                return acc;
            }, {} as Record<string, string | number>),
        };

        router.post('/dinas-perikanan/store-edit', payload);
        // Laravel sendiri akan redirect ke dashboard dengan filter yang sama + flash message
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-lg leading-tight font-bold text-gray-800">Edit Data Perikanan</h2>}
        >
            <Head title="Edit Data Perikanan" />

            <div className="min-h-screen bg-white -m-6 p-6">
                <div className="mx-auto max-w-5xl">
                    {success && (
                        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-xl">{success}</div>
                    )}

                    {/* Periode Data (Read-only) */}
                    <div className="mb-6 bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-4">Periode Data</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                                <input
                                    type="text"
                                    value={filters.tahun}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 shadow-sm text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                                <input
                                    type="text"
                                    value={filters.bulan}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 shadow-sm text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Edit Data */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4">Data Perikanan</h3>
                        <table className="min-w-full mb-4">
                            <thead>
                                <tr className="bg-gray-700">
                                    <th className="px-8 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">Indikator</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold tracking-wider text-white uppercase">Jumlah (Ton)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.map((item, index) => (
                                    <tr key={item.indikator}>
                                        <td className="px-8 py-4 text-sm font-medium text-gray-900">{item.indikator}</td>
                                        <td className="px-8 py-4 text-sm text-gray-600">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={item.nilai}
                                                onChange={(e) => handleInputChange(e, index)}
                                                className="w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end gap-3">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

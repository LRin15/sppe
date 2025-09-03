// resources/js/Pages/DinasPerikanan/Dashboard.tsx

import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {
    ChartBarIcon,
    CalendarIcon,
    DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface ChartDataPoint {
    month: string;
    [key: string]: string | number;
}

interface Props extends PageProps {
    availableYears: number[];
    selectedYears: number[];
    selectedIndicator: string;
    indikatorList: string[];
    chartData: ChartDataPoint[];
}

const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#F43F5E'
];

const months = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
];

export default function Dashboard({
    auth,
    availableYears,
    selectedYears,
    selectedIndicator,
    indikatorList,
    chartData,
}: Props) {
    const [localSelectedYears, setLocalSelectedYears] = useState<number[]>([]);
    const [localSelectedIndicator, setLocalSelectedIndicator] = useState<string>('');

    // tabel
    const [tableData, setTableData] = useState<any[]>([]);
    const [filterIndicators, setFilterIndicators] = useState<string[]>([]);
    const [filterYears, setFilterYears] = useState<number[]>([]);
    const [filterMonths, setFilterMonths] = useState<string[]>([]);

    useEffect(() => {
        setLocalSelectedYears(selectedYears || []);
        setLocalSelectedIndicator(selectedIndicator || '');
    }, []);

    useEffect(() => {
        if (!localSelectedIndicator || localSelectedYears.length === 0) return;

        const debounce = setTimeout(() => {
            router.get('/dinas-perikanan/dashboard', {
                years: localSelectedYears,
                indicator: localSelectedIndicator,
            }, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 500);

        return () => clearTimeout(debounce);
    }, [localSelectedYears, localSelectedIndicator]);

    // fetch tabel data setiap filter berubah
    useEffect(() => {
        axios.get('/dinas-perikanan/table-data', {
            params: {
                indicators: filterIndicators,
                years: filterYears,
                months: filterMonths,
            }
        }).then(res => setTableData(res.data));
    }, [filterIndicators, filterYears, filterMonths]);

    const formatNumber = (value: number) => new Intl.NumberFormat('id-ID').format(value);

    const hasChartData = () => {
        if (!chartData || chartData.length === 0) return false;
        return chartData.some(dataPoint =>
            selectedYears.some(year => {
                const value = dataPoint[year.toString()];
                return value !== undefined && value !== 0;
            })
        );
    };

    // Custom styles untuk react-select
    const selectStyles = {
        control: (provided: any) => ({
            ...provided,
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            minHeight: '44px',
            '&:hover': {
                border: '2px solid #d1d5db'
            },
            '&:focus-within': {
                border: '2px solid #3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
            }
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#dbeafe',
            borderRadius: '6px'
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: '#1e40af',
            fontSize: '13px'
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: '#1e40af',
            ':hover': {
                backgroundColor: '#bfdbfe',
                color: '#1e3a8a'
            }
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: '#9ca3af'
        })
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard - Dinas Perikanan" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 -m-6 p-6">
                <div className="space-y-6">

                    {/* Container Filter + Grafik */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center mb-6">
                            <CalendarIcon className="h-6 w-6 mr-3 text-gray-600" />
                            <h2 className="text-l font-semibold text-gray-900">Grafik Indikator</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Tahun */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                                <select
                                    value={localSelectedYears[0] ?? ""}
                                    onChange={(e) => {
                                        const yearNum = parseInt(e.target.value);
                                        setLocalSelectedYears(yearNum ? [yearNum] : []);
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                >
                                    <option value="">-- Pilih Tahun --</option>
                                    {availableYears.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Indikator */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Indikator</label>
                                <select
                                    value={localSelectedIndicator}
                                    onChange={(e) => setLocalSelectedIndicator(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                >
                                    <option value="">-- Pilih Indikator --</option>
                                    {indikatorList.map((indicator) => (
                                        <option key={indicator} value={indicator}>{indicator}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Grafik */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            {!selectedIndicator ? (
                                <div className="h-96 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <ChartBarIcon className="h-20 w-20 mx-auto mb-4 text-gray-300" />
                                        <div className="text-xl font-medium">Pilih Indikator</div>
                                        <div className="text-base text-gray-400">Pilih indikator di atas untuk melihat grafik trend</div>
                                    </div>
                                </div>
                            ) : hasChartData() ? (
                                <div className="h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis 
                                                dataKey="month" 
                                                tick={{ fontSize: 12 }} 
                                                stroke="#666" 
                                                angle={-45} 
                                                textAnchor="end" 
                                                height={80} 
                                            />
                                            <YAxis 
                                                tick={{ fontSize: 12 }} 
                                                stroke="#666" 
                                                tickFormatter={(value) => formatNumber(value)} 
                                            />
                                            <Tooltip formatter={(value: any, name: string) => [formatNumber(Number(value)), `Tahun ${name}`]} />
                                            <Legend />
                                            {selectedYears.map((year, index) => (
                                                <Line 
                                                    key={year} 
                                                    type="monotone" 
                                                    dataKey={year.toString()} 
                                                    stroke={colors[index % colors.length]} 
                                                    strokeWidth={3} 
                                                />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-96 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <DocumentTextIcon className="h-20 w-20 mx-auto mb-4 text-gray-300" />
                                        <div className="text-xl font-medium">Tidak ada data</div>
                                        <div className="text-base text-gray-400">Data untuk "{selectedIndicator}" di tahun {selectedYears.join(', ')} tidak tersedia</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filter + Tabel Data */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center mb-6">
                            <DocumentTextIcon className="h-6 w-6 mr-3 text-gray-600" />
                            <h2 className="text-l font-semibold text-gray-900">Tabel Indikator</h2>
                        </div>

                        {/* Filter Tabel */}
                        <div className="mb-6">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                {/* Indikator */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Indikator</label>
                                    <Select
                                        isMulti
                                        placeholder="Pilih indikator..."
                                        options={indikatorList.map(ind => ({ value: ind, label: ind }))}
                                        value={filterIndicators.map(ind => ({ value: ind, label: ind }))}
                                        onChange={(selected) => setFilterIndicators(selected?.map(s => s.value) || [])}
                                        styles={selectStyles}
                                        className="text-sm"
                                        maxMenuHeight={200}
                                    />
                                </div>
                                
                                {/* Tahun */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                                    <Select
                                        isMulti
                                        placeholder="Pilih tahun..."
                                        options={availableYears.map(y => ({ value: y, label: y.toString() }))}
                                        value={filterYears.map(y => ({ value: y, label: y.toString() }))}
                                        onChange={(selected) => setFilterYears(selected?.map(s => Number(s.value)) || [])}
                                        styles={selectStyles}
                                        className="text-sm"
                                        maxMenuHeight={200}
                                    />
                                </div>
                                
                                {/* Bulan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
                                    <Select
                                        isMulti
                                        placeholder="Pilih bulan..."
                                        options={months.map(m => ({ value: m, label: m }))}
                                        value={filterMonths.map(m => ({ value: m, label: m }))}
                                        onChange={(selected) => setFilterMonths(selected?.map(s => s.value) || [])}
                                        styles={selectStyles}
                                        className="text-sm"
                                        maxMenuHeight={200}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tabel Data */}
                        <div className="max-w-full overflow-x-auto border rounded-lg">
                        <table className="table-auto min-w-[1000px] border-collapse text-sm">
                            <thead className="bg-slate-800">
                            <tr>
                                <th className="border px-3 py-2 text-center text-white">Indikator</th>
                                <th className="border px-3 py-2 text-center text-white">Tahun</th>
                                {months.map((bulan) => (
                                <th key={bulan} className="border px-3 py-2 text-center text-white">{bulan}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.length > 0 ? (
                                tableData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2">{row.indikator}</td>
                                    <td className="border px-3 py-2 text-center">{row.tahun}</td>
                                    {months.map((bulan) => (
                                    <td key={bulan} className="border px-3 py-2 text-right">
                                        {row[bulan] ? formatNumber(row[bulan]) : '-'}
                                    </td>
                                    ))}
                                </tr>
                                ))
                            ) : (
                                <tr>
                                <td colSpan={14} className="text-center text-gray-500 py-4">
                                    Tidak ada data
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

import { Head, Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

// Definisikan tipe data untuk props, agar kode lebih aman dan mudah dibaca
interface User {
    id: number;
    name: string;
    email: string;
    dinas: string; // Tambahkan properti dinas
}

interface Auth {
    user: User;
}

interface DashboardProps {
    auth: Auth;
}

export default function Dashboard({ auth }: DashboardProps) {
    // Kapitalisasi huruf pertama dari nama dinas untuk tampilan
    const dinasName = auth.user.dinas.charAt(0).toUpperCase() + auth.user.dinas.slice(1);

    return (
        <div className="min-h-screen bg-slate-100">
            <Head title="Dashboard" />

            {/* Header */}
            <header className="bg-slate-800 text-white shadow-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">SPPE</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="hidden text-sm text-slate-300 sm:block">{auth.user.email}</span>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center justify-center rounded-full p-2 transition-colors hover:bg-slate-700"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5 text-slate-300" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 md:p-8">
                                <h2 className="mb-2 text-2xl font-bold text-slate-800">Selamat Datang, {auth.user.name}!</h2>
                                <p className="text-slate-600">
                                    Anda telah berhasil login sebagai pengguna dari Dinas <span className="font-semibold">{dinasName}</span>.
                                </p>
                                <div className="mt-6 rounded-r-lg border-l-4 border-yellow-400 bg-yellow-50 p-4 text-yellow-800">
                                    <h3 className="font-bold">Dalam Pengembangan</h3>
                                    <p>Halaman dashboard spesifik untuk dinas Anda saat ini sedang dalam tahap pengembangan.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

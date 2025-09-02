// resources/js/Layouts/AuthenticatedLayout.tsx

import { User } from '@/types'; // Pastikan Anda memiliki file types/index.d.ts
import { ArrowLeftOnRectangleIcon, Bars3Icon, HomeIcon, PencilSquareIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

// Komponen untuk link di sidebar
const NavLink = ({ href, active, children }: { href: string; active: boolean; children: ReactNode }) => (
    <Link
        href={href}
        className={`flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
            active ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`}
    >
        {children}
    </Link>
);

export default function Authenticated({ user, header, children }: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`absolute inset-y-0 left-0 w-64 transform space-y-6 bg-gray-800 px-2 py-7 text-white ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } z-30 transition duration-200 ease-in-out md:relative md:translate-x-0`}
            >
                {/* Logo atau Judul Aplikasi */}
                <Link href="/dinas-perikanan/dashboard" className="flex items-center justify-center space-x-2 px-4 text-white">
                    <span className="text-2xl font-extrabold">SPPE Dashboard</span>
                </Link>

                {/* Navigasi */}
                <nav className="px-4">
                    <NavLink href="/dinas-perikanan/dashboard" active={window.location.pathname === '/dinas-perikanan/dashboard'}>
                        <HomeIcon className="mr-3 h-5 w-5" />
                        Dashboard Perikanan
                    </NavLink>
                    <NavLink href="/dinas-perikanan/input" active={window.location.pathname === '/dinas-perikanan/input'}>
                        <PencilSquareIcon className="mr-3 h-5 w-5" />
                        Input Data Perikanan
                    </NavLink>
                    {/* Tambahkan link dinas lain di sini */}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Top Bar */}
                <header className="flex h-16 items-center justify-between bg-white px-4 shadow-sm sm:px-6 md:justify-end lg:px-8">
                    {/* Tombol Hamburger (Mobile) */}
                    <button
                        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 focus:outline-none md:hidden"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>

                    {/* User Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                            className="flex items-center space-x-2 text-sm font-medium text-gray-500 transition hover:text-gray-700 focus:outline-none"
                        >
                            <UserCircleIcon className="h-8 w-8 text-gray-400" />
                            <div className="hidden md:block">{user.name}</div>
                        </button>

                        {/* Dropdown Menu */}
                        <div
                            className={`ring-opacity-5 absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black transition-all duration-200 ${
                                showingNavigationDropdown ? 'visible opacity-100' : 'invisible opacity-0'
                            }`}
                        >
                            <div className="py-1">
                                <Link href="/profile" className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100">
                                    Profile
                                </Link>
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="block w-full px-4 py-2 text-left text-sm leading-5 text-gray-700 hover:bg-gray-100"
                                >
                                    <ArrowLeftOnRectangleIcon className="mr-2 inline-block h-5 w-5" />
                                    Log Out
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Header */}
                {header && (
                    <div className="border-b bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">{header}</div>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}

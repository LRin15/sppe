import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

interface LoginProps {
    status?: string
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <div className="h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col overflow-hidden">
            <Head title="Log in" />
            
            {/* Header - Fixed height 64px */}
            <div className="bg-slate-800 text-white h-16 flex items-center px-4 flex-shrink-0">
                <h1 className="text-xl md:text-2xl font-bold">SPPE</h1>
            </div>

            {/* Main Content - Takes remaining space */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Left Column - Information */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-hidden order-2 md:order-1">
                    <div className="max-w-lg text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4 md:mb-6 leading-tight">
                            APA ITU<br />SPPE?
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base hidden md:block">
                            Sistem Percepatan Pertumbuhan Ekonomi (SPPE) Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, in esse. 
                            deleniti tempore ea facilis quod, minima nostrum totam sit est tenetur, 
                            soluta ipsum quam rem temporibus? Vero, praesentium.
                        </p>
                        <p className="text-slate-600 leading-relaxed text-sm block md:hidden">
                            Sistem untuk menilai dan menentukan peringkat kredit entitas keuangan.
                        </p>
                    </div>
                </div>

                {/* Right Column - Login Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 overflow-hidden order-1 md:order-2">
                    <div className="bg-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-xs md:max-w-sm min-h-[350px] flex flex-col justify-center">
                        <h3 className="text-white text-base md:text-lg font-semibold mb-4 md:mb-5 text-center">
                            Login SPPE
                        </h3>

                        {status && (
                            <div className="mb-3 md:mb-4 text-center text-xs md:text-sm font-medium text-green-400">
                                {status}
                            </div>
                        )}

                        <Form 
                            {...AuthenticatedSessionController.store.form()} 
                            resetOnSuccess={['password']} 
                            className="space-y-3 md:space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-2 md:space-y-3">
                                        {/* Email Field */}
                                        <div>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="Email"
                                                className="w-full bg-white border-0 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-slate-800 placeholder-slate-400 text-xs md:text-sm"
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        {/* Password Field */}
                                        <div>
                                            <Input
                                                id="password"
                                                type="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="w-full bg-white border-0 rounded-lg px-3 md:px-4 py-2 md:py-2.5 text-slate-800 placeholder-slate-400 text-xs md:text-sm"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        {/* Forgot Password Link */}
                                        {canResetPassword && (
                                            <div className="text-center">
                                                <TextLink 
                                                    href={request()} 
                                                    className="text-slate-400 text-xs md:text-sm hover:text-white transition-colors" 
                                                    tabIndex={5}
                                                >
                                                    Lupa Password?
                                                </TextLink>
                                            </div>
                                        )}
                                    </div>

                                    {/* Remember Me Checkbox */}
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="remember" 
                                            name="remember" 
                                            tabIndex={3}
                                            className="border-slate-400 text-white" 
                                        />
                                        <Label htmlFor="remember" className="text-slate-300 text-xs">
                                            Remember me
                                        </Label>
                                    </div>

                                    {/* Login Button */}
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-white text-slate-800 hover:bg-slate-100 rounded-lg py-2 md:py-2.5 font-medium transition-colors text-xs md:text-sm" 
                                        tabIndex={4} 
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="h-3 w-3 md:h-4 md:w-4 animate-spin mr-2" />}
                                        Masuk
                                    </Button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>

            {/* Footer - Fixed height 64px (same as header) */}
            <div className="bg-slate-800 text-white h-16 flex items-center justify-center px-4 flex-shrink-0">
                <p className="text-xs md:text-sm text-slate-300 text-center">
                    © 2025 Sistem Percepatan Pertumbuhan Ekonomi (SPPE). All rights reserved.
                </p>
            </div>
        </div>
    );
}
import { useEffect, FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import '../../../css/global.css';

export default function Login({ status, canResetPassword }: { status?: string, canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <div className="flex flex-col lg:flex-row h-screen">
                {/* Image Container - Hidden on small screens */}
                <div className="hidden lg:flex w-full lg:w-3/4 items-center justify-center">
                    <img src="/images/login_image.png" alt="image" className="max-w-full h-auto" />
                </div>

                {/* Sidebar Container */}
                <div className="w-full lg:w-1/4 animated-gradient shadow-md p-8">
                    <div className='text-3xl font-bold my-12 text-gray-700'>NexaCore</div>
                    <div className='flex flex-col gap-2 mb-10'>
                        <h2 className='font-semibold text-gray-600'>Welcome to NexaCore! 👋</h2>
                        <p className='text-gray-500'>Please sign-in to your account and start the adventure</p>
                    </div>

                    {/* Login Form */}
                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
                    <form onSubmit={submit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password Input */}
                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* Remember Me and Submit Button */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <PrimaryButton className="ml-4 whitespace-nowrap" disabled={processing}>
                                Log in
                            </PrimaryButton>
                        </div>

                        {/* Reset Password Link */}
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="underline text-sm text-gray-600 hover:text-gray-900"
                            >
                                Forgot your password?
                            </Link>
                        )}
                    </form>
                </div>
            </div>
            </GuestLayout>
    );
}

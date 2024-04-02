import React, { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import '../../../css/global.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        token: '',
    });

    const [passwordStrength, setPasswordStrength] = useState({message: '', level: ''});
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token !== null) {
            setData('token', token);
        }
    }, []);

    useEffect(() => {
        validatePasswordStrength(data.password);
        setPasswordsMatch(data.password === data.password_confirmation);
    }, [data.password, data.password_confirmation]);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const validatePasswordStrength = (password : any) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const middlePasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (password) {
            if (strongPasswordRegex.test(password)) {
                setPasswordStrength({message: 'Strong', level: 'strong'});
            } else if (middlePasswordRegex.test(password)) {
                setPasswordStrength({message: 'Middle', level: 'middle'});
            } else {
                setPasswordStrength({message: 'Not strong enough', level: 'notStrong'});
            }
        } else {
            setPasswordStrength({message: '', level: ''}); // Clear message when password is empty
        }
    };

    const submit = (e : any) => {
        e.preventDefault();
        if (!passwordsMatch) {
            alert('Passwords do not match!');
            return;
        }
        post(route('register'));
    };

    // Define a function to get styles based on password strength
    const getPasswordStrengthStyle = () => {
        switch (passwordStrength.level) {
            case 'strong':
                return { color: '#fff', backgroundColor: '#4CAF50', padding: '4px 8px', borderRadius: '4px' };
            case 'middle':
                return { color: '#000000', backgroundColor: '#FFEB3B', padding: '4px 8px', borderRadius: '4px' };
            case 'notStrong':
                return { color: '#fff', backgroundColor: '#F44336', padding: '4px 8px', borderRadius: '4px' };
            default:
                return {};
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    
    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };
    


    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="flex flex-col lg:flex-row h-screen">
                <div className="hidden lg:flex w-full lg:w-3/4 items-center justify-center">
                    <img src="/images/register_image.png" alt="Register" className="max-w-full h-auto" />
                </div>

                <div className="w-full lg:w-1/4 animated-gradient shadow-md p-8">
                    <div className='text-3xl font-bold my-12 text-gray-700'>NexaCore</div>
                    <div className='flex flex-col gap-2 mb-10'>
                        <h2 className='font-semibold text-gray-600'>Join NexaCore! 🚀</h2>
                        <p className='text-gray-500'>Create an account and start your journey with us.</p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="mt-4 relative">
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 my-[45px] flex items-center text-gray-600">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <InputError message={errors.password} className="mt-2" />
                            {data.password && (
                                <div style={getPasswordStrengthStyle()}>
                                    Password is: {passwordStrength.message}
                                </div>
                            )}
                        </div>

                        {/* Password confirmation field */}
                        <div className="mt-4 relative">
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type={showPasswordConfirmation ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <button type="button" onClick={togglePasswordConfirmationVisibility} className="absolute inset-y-0 right-0 pr-3 my-[45px] flex items-center text-gray-600">
                                {showPasswordConfirmation ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                            {!passwordsMatch && (
                                <div className="text-red-500">Passwords do not match!</div>
                            )}
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            <Link
                                href={route('login')}
                                className="underline text-sm text-gray-600 hover:text-gray-900"
                            >
                                Already registered?
                            </Link>

                            <PrimaryButton className="ml-4" disabled={processing}>
                                Register
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}

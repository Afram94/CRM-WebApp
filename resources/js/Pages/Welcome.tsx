import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useEffect, useRef, useState } from 'react';
import '../../css/global.css';

export default function Welcome({ auth }: PageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [maxHeight, setMaxHeight] = useState<number | undefined>(0);
    const dropdownRef = useRef<HTMLDivElement>(null); // Explicitly declare the type of the ref


    const toggleMenu = () => {
        if (isMenuOpen) {
            setMaxHeight(0);
        } else if (dropdownRef.current) {
            setMaxHeight(dropdownRef.current.scrollHeight);
        }
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (isMenuOpen && dropdownRef.current) {
            setMaxHeight(dropdownRef.current.scrollHeight);
        } else {
            setMaxHeight(0);
        }
    }, [isMenuOpen]);

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-100 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
                <nav className="bg-white dark:bg-F6F0F8 opacity-60 border-2 border-slate-400 shadow mx-8 rounded-lg">
                    <div className="container mx-auto px-6 py-3">
                        <div className="flex justify-between items-center">

                            <div className='flex gap-3 items-center'>
                                <div className="xl:hidden lg:hidden">
                                    {/* Hamburger Menu Icon */}
                                    <button onClick={toggleMenu} className="text-gray-700 dark:text-gray-7 focus:outline-none ">
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                        </svg>
                                    </button>
                                </div>
                                {/* <div className="text-gray-700 dark:text-gray-800 text-xl font-semibold">NexaCore</div> */}
                                <img src="/images/logo.png" className='object-cover' alt="Logo" />

                            </div>

                            
                            <div className="hidden xl:flex lg:flex items-center">
                                {/* Main menu for large screens */}
                                {/* ... main menu links ... */}

                                <Link href="/" className="block px-5 rounded-md text-md font-medium dark:text-gray-700">Home</Link>
                                <Link href="/features" className="block px-5 rounded-md text-md font-medium dark:text-gray-700">Features</Link>
                                <Link href="/team" className="block px-5 rounded-md text-md font-medium dark:text-gray-700">Team</Link>
                                <Link href="/faq" className="block px-5 rounded-md text-md font-medium dark:text-gray-700">FAQ</Link>
                                <Link href="/contact" className="block px-5 rounded-md text-md font-medium dark:text-gray-700">Contact Us</Link>
                            </div>

                            

                            {auth.user ? (
                                <Link href={route('dashboard')} className="text-gray-700 dark:text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                            ) : (
                                <div className='flex flex-row gap-2'>
                                    <Link href={route('login')} className="text-gray-700 dark:text-white py-2 rounded-md text-sm font-medium bg-indigo-600 p-1 px-3">Log in</Link>
                                    <Link href={route('register')} className="text-gray-700 dark:text-white py-2 rounded-md text-sm font-medium bg-indigo-600 p-1 px-3">Register</Link>
                                </div>
                            )}
                        </div>

                        {isMenuOpen && (
                            <div ref={dropdownRef}
                            style={{ maxHeight: maxHeight ? `${maxHeight}px` : '0' }}
                            className="overflow-hidden transition-max-height duration-500 ease-in-out xl:hidden lg:hidden flex">
                            {/*  className="xl:hidden lg:hidden flex border-t border-gray-700 mt-2">  */}
                                {/* Dropdown menu for small screens */}
                                <Link href="/" className="block px-4 py-2 rounded-md text-lg font-medium text-gray-800 dark:text-gray-800">Home</Link>
                                <Link href="/features" className="block px-4 py-2 rounded-md text-lg font-medium text-gray-800 dark:text-gray-800">Features</Link>
                                <Link href="/team" className="block px-4 py-2 rounded-md text-lg font-medium text-gray-800 dark:text-gray-800">Team</Link>
                                <Link href="/faq" className="block px-4 py-2 rounded-md text-lg font-medium text-gray-800 dark:text-gray-800">FAQ</Link>
                                <Link href="/contact" className="block px-4 py-2 rounded-md text-lg font-medium text-gray-800 dark:text-gray-800">Contact Us</Link>
                            </div>
                        )}
                    </div>
                </nav>



                <header className="bg-cover bg-center py-32" style={{ backgroundImage: "url('header-background.jpg')" }}>
                    <div className="container mx-auto px-6 text-center ">
                        <h2 className="text-4xl flex text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-600 justify-center text-primary hero-title display-4 font-bold mb-4">Welcome toNexaCore System</h2>
                        <div className='font-extrabold text-transparent text-8xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                            <p className="text-4xl flex justify-center text-primary hero-title display-4 font-bold">One dashboard to manage</p>
                            <p className="text-4xl flex justify-center text-primary hero-title display-4 font-bold">all your businesses</p>
                        </div>
                    </div>

                    <div className='flex flex-row justify-center gap-2 mt-4'>
                        <p className="text-lg text-gray-700 text-center text-primary hero-title display-4">Production-ready & easy to use Admin Template <br/> for Reliability and Customizability.</p>
                        <div>

                        <PrimaryButton></PrimaryButton>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-6 pt-16">
                    {/* Add your main content here */}
                </main>

                <footer className="fixed bottom-0 w-full bg-white dark:bg-gray-800 border-t rounded-t-2xl h-72">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex flex-wrap justify-between items-center">

                    <div className="w-full md:w-auto mb-4 md:mb-0 flex flex-col gap-2">

                        <p className="text-gray-700 dark:text-white text-sm">
                            <strong className='text-xl font-bold'>NexaCore</strong>
                        </p>

                        <p className="text-gray-700 dark:text-white text-sm">
                            Most developer friendly & highly customisable Admin<br /> Dashboard Template.
                        </p>

                        <div className="w-full md:w-auto mb-4 mt-8 md:mb-0">
                            <p className="text-gray-700 dark:text-white text-sm mb-2">Subscribe to newsletter</p>
                            <form className="flex">
                                <TextInput type="email" className="px-4 py-2 border focus:outline-none" placeholder="Your email" />
                                <PrimaryButton className="px-4 py-2 bg-blue-500 text-white">Subscribe</PrimaryButton>
                            </form>
                        </div>
                    </div>
                        
                        <div className="w-full md:w-auto">
                            <p className="text-gray-700 dark:text-white text-sm">
                                Demos<br />
                                Vertical Layout<br />
                                Horizontal Layout<br />
                                Bordered Layout<br />
                                Semi Dark Layout<br />
                                Dark Layout<br />
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <p className="text-gray-700 dark:text-white text-sm">
                                Pages<br />
                                Pricing<br />
                                Payment NEW<br />
                                Checkout<br />
                                Help Center<br />
                                Login/Register<br />
                            </p>
                        </div>
                        
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
}

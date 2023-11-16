import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCode, AiOutlineSync, AiOutlineTool, AiOutlineApi, AiOutlineCustomerService, AiOutlineFileText } from 'react-icons/ai';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
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

    

    

    useEffect(() => {
        const image = document.querySelector('.hover-image') as HTMLElement;

        if (image) {
            const handleMouseMove = (e: MouseEvent) => {
                const target = e.target as HTMLElement;
                const { width, height, top, left } = target.getBoundingClientRect();
                const x = e.clientX - left;
                const y = e.clientY - top;
                const rotateY = 20 * ((x / width) - 0.5);
                const rotateX = -20 * ((y / height) - 0.5);

                target.style.transform = `perspective(1500px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.05)`;
            };

            const handleMouseLeave = () => {
                image.style.transform = 'perspective(1500px) rotateY(0deg) rotateX(0deg) scale(1)';
            };

            image.addEventListener('mousemove', handleMouseMove);
            image.addEventListener('mouseleave', handleMouseLeave);

            // Clean up the event listeners when the component unmounts
            return () => {
                image.removeEventListener('mousemove', handleMouseMove);
                image.removeEventListener('mouseleave', handleMouseLeave);
            };
        } else {
            console.error('Element with class .hover-image not found');
        }
    }, []); // Empty dependency array means this effect runs once on mount


    return (
        <>
            <Head title="Welcome" />
            <div className='flex flex-col gap-20'>
            <div className="min-h-[800px] text-transparent bg-clip-text text-primary hero-title display-4 font-bold mb-4 animated-gradient rounded-b-[100px]">
                <nav className="bg-white dark:bg-F6F0F8 opacity-60 shadow rounded-lg container mx-auto  px-6 py-3">
                    
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
                </nav>


                {/* Header */}
                <header className="relative bg-cover bg-center py-20 animated-gradient" style={{ backgroundImage: "url('header-background.jpg')" }}>
                <div className="container mx-auto px-6 text-center">
                    <h2 className="animated-gradient-text text-4xl flex justify-center text-primary hero-title display-4 font-extrabold mb-4">Welcome to NexaCore System</h2>
                    <div className='font-extrabold text-8xl'>
                        <p className="animated-gradient-text text-4xl flex justify-center text-primary hero-title display-4 font-bold">One dashboard to manage</p>
                        <p className="animated-gradient-text text-4xl flex justify-center text-primary hero-title display-4 font-bold">all your businesses</p>
                    </div>
                </div>

                <div className='flex flex-col justify-center gap-5 mt-4'>
                    <p className="text-md text-gray-600 text-center text-primary hero-title display-4 ">Production-ready & easy to use Admin Template <br/> for Reliability and Customizability.</p>
                    <div className='flex justify-center animated-gradient-text'>
                        <PrimaryButton>Get early access</PrimaryButton>
                    </div>
                </div>

                <div className="absolute left-1/2 transform -translate-x-1/2 sm:bottom-[-400px] xl:bottom-[-560px] bottom-[-200px]"> {/* Adjust bottom value as needed */}
                    <img src="/images/Hero_image.png" alt="Descriptive Alt Text" className="hover-image rounded-xl  shadow-xl" />
                </div>
                </header>

                </div>

                {/* Main and Footer in one div after the nav and the header */}
                <div className="wrapper mt-72">
                <main className='mb-24'>
                    <div className='text-center text-2xl font-bold mb-2 text-gray-500'>Everything you need to start your next project</div>
                    <p className='text-center text-md mb-12 text-gray-500'>Everything you need to start your next project</p>
                    <div className='container mx-auto px-6 grid md:grid-cols-3 gap-4'>
                        <div className='flex flex-col justify-center items-center text-center my-2'>
                            <AiOutlineCode className="text-4xl mb-2 h-20 w-20 text-indigo-500"/>
                            <h2 className="text-lg font-semibold text-gray-600 mb-3">Quality Code</h2>
                            <p className='px-8 text-gray-500'>Code structure that all developers will easily understand and fall in love with.</p>
                        </div>
                        <div className='flex flex-col justify-center items-center text-center my-2'>
                            <AiOutlineSync className="text-4xl mb-2 h-20 w-20 text-indigo-500"/>
                            <h2 className="text-lg font-semibold text-gray-600 mb-3">Continuous Updates</h2>
                            <p className='px-8 text-gray-500'>Code structure that all developers will easily understand and fall in love with.</p>
                        </div>
                        <div className='flex flex-col justify-center items-center text-center my-2'>
                            <AiOutlineTool className="text-4xl mb-2 h-20 w-20 text-indigo-500"/>
                            <h2 className="text-lg font-semibold text-gray-600 mb-3">Starter-Kit</h2>
                            <p className='px-8 text-gray-500'>Code structure that all developers will easily understand and fall in love with.</p>
                        </div>
                        <div className='flex flex-col justify-center items-center text-center my-2'>
                            <AiOutlineApi className="text-4xl mb-2 h-20 w-20 text-indigo-500"/>
                            <h2 className="text-lg font-semibold text-gray-600 mb-3">API Ready</h2>
                            <p className='px-8 text-gray-500'>Code structure that all developers will easily understand and fall in love with.</p>
                        </div>
                        <div className='flex flex-col justify-center items-center text-center my-2'>
                            <AiOutlineCustomerService className="text-4xl mb-2 h-20 w-20 text-indigo-500"/>
                            <h2 className="text-lg font-semibold text-gray-600 mb-3">Excellent Support</h2>
                            <p className='px-8 text-gray-500'>Code structure that all developers will easily understand and fall in love with.</p>
                        </div>
                        <div className='flex flex-col justify-center items-center text-center my-2'>
                            <AiOutlineFileText className="text-4xl mb-2 h-20 w-20 text-indigo-500"/>
                            <h2 className="text-lg font-semibold text-gray-600 mb-3">Well Documented</h2>
                            <p className='px-8 text-gray-500'>Code structure that all developers will easily understand and fall in love with.</p>
                        </div>
                    </div>
                </main>

                <footer className="relative w-full bg-white dark:bg-[#33334A] border-t rounded-t-2xl py-8 h-72">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-between items-center space-y-6 md:space-y-0">

                            <div className="w-full md:w-auto space-y-4">
                                <p className="text-gray-700 dark:text-white text-lg font-bold">
                                    NexaCore
                                </p>
                                <p className="text-gray-700 dark:text-white text-sm">
                                    Most developer friendly & highly customizable Admin<br /> Dashboard Template.
                                </p>
                                <div className="flex space-x-3">
                                    <TextInput type="email" className="px-4 py-2 border focus:outline-none" placeholder="Your email" />
                                    <PrimaryButton className="px-4 py-2 bg-blue-500 text-white">Subscribe</PrimaryButton>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-auto text-sm text-gray-700 dark:text-white space-y-4">
                                <p>Demos</p>
                                <p>Vertical Layout</p>
                                <p>Horizontal Layout</p>
                                <p>Bordered Layout</p>
                                <p>Semi Dark Layout</p>
                                <p>Dark Layout</p>
                            </div>

                            <div className="w-full md:w-auto text-sm text-gray-700 dark:text-white space-y-4">
                                <p>Pages</p>
                                <p>Pricing</p>
                                <p>Payment NEW</p>
                                <p>Checkout</p>
                                <p>Help Center</p>
                                <p>Login/Register</p>
                            </div>
                            
                            
                        </div>
                    </div>
                    <div className="text-sm  bg-[#292C3D] w-full h-12 flex items-center justify-between absolute bottom-0">
                        <div className='mr-52'>
                            
                        </div>
                        <p className=' text-slate-200 text-center'>
                            © 2023 NexaCore. All rights reserved.
                        </p>
                        <div className='flex space-x-4 mr-12'>
                            <a href="https://www.facebook.com/nexacore" target="_blank" rel="noopener noreferrer">
                                <FaFacebookF className="text-blue-600 text-xl hover:text-blue-800" />
                            </a>
                            <a href="https://www.twitter.com/nexacore" target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="text-blue-400 text-xl hover:text-blue-600" />
                            </a>
                            <a href="https://www.instagram.com/nexacore" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="text-pink-600 text-xl hover:text-pink-800" />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
            </div>
        </>
    );
}

import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center sm:pt-0"> {/* bg-gray-100 pt-6 */}
            {/* <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                </Link>
            </div> */}

            <div className="w-full animated-gradient shadow-md overflow-hidden sm:rounded-lg"> {/* bg-white px-6 py-4 mt-6 sm:max-w-md */}
                {children}
            </div>
        </div>
    );
}

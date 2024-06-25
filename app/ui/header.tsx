import React from 'react'
import Image from "next/image";
import Link from 'next/link';
import { open_sans } from './fonts';
import { Button } from '@/components/ui/button';
import { BookOpenTextIcon } from 'lucide-react';

function Header() {
  return (
    <header className='flex justify-between h-[80px] md:h-[100px] px-20 py-5 text-slate-300'>
        <div className='flex flex-row items-center gap-3 z-10'>
            <Image
                src={'/moon.png'}
                width={30}
                height={10}
                alt='logo'
            />
            <Link
                href="/"
                className='text-white font-semibold'
            >
                nyxify
            </Link>
        </div>
        <div className='flex flex-row items-center z-10'>
            <Link 
                href="/stories"
                >
                    <Button 
                        variant="outline"
                        className='text-white font-semibold m-3 bg-transparent'
                        >
                        <BookOpenTextIcon className='mr-2 h-5'/>
                        Stories
                    </Button>
            </Link>
        </div>
    </header>
  )
}

export default Header
import Link from 'next/link';
import { HomeModernIcon } from '@heroicons/react/24/outline';

export function HomeButton() {

  return (
    <div className="fixed bottom-1 left-1 z-50 flex  items-center justify-center rounded-full bg-zinc-800 opacity-80 p-3 font-mono text-white">
      <a href="/" className='w-6'>
        <HomeModernIcon />
      </a>
    </div>
  )
}

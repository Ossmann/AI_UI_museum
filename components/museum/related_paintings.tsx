'use client'

import { useActions, useUIState } from 'ai/rsc'

import Image from 'next/image'

import type { AI } from '@/lib/chat/actions'

interface Painting {
  src: string,
  artworkName: string,
  artist: string,
  explanation: string
}


export function RelatedPaintings({ props: paintings }: { props: Painting[] }) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <div>
      <div className="mb-4  pb-4 text-sm">
        {paintings.map((painting, index) => (
          <div key={painting.artworkName + index} className="pt-8 max-w-lg mx-auto text-sm">
          
          <div className='float-right z-[-10] overflow-hidden'> 
            <Image
              // src={`/_next/image?url=https://upload.wikimedia.org/wikipedia/commons/thumb/${painting.src}&w=256&q=75`}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg/1280px-Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg"
              alt="The Anatomy Lesson of Dr. Nicolaes Tulp"
              width={100}
              height={20}
              className="rounded-lg"
            />
          </div>

            <div className='text-lg'>
              {painting.artworkName}
            </div>
            <div className='font-bold pb-2'>
              {painting.artist}
            </div>
            <div className='p-2 bg-zinc-400 rounded-lg z-10 mt-6 text-sm'>
              {painting.explanation}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 text-center ">
        Want to learn more?
      </div>
    </div>
  );
}

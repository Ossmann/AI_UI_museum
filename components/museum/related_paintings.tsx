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

  const getArtworkSrc = (artworkName: string) => {
    if (artworkName === "The Anatomy Lesson of Dr. Nicolaes Tulp") {
      return "https://upload.wikimedia.org/wikipedia/commons/4/4d/Rembrandt_-_The_Anatomy_Lesson_of_Dr_Nicolaes_Tulp.jpg";
    } else if (artworkName === "The Storm on the Sea of Galilee") {
      return "https://upload.wikimedia.org/wikipedia/commons/f/f3/Rembrandt_Christ_in_the_Storm_on_the_Lake_of_Galilee.jpg";
    } else if (artworkName === "The Return of the Prodigal Son") {
      return "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg/800px-Rembrandt_Harmensz_van_Rijn_-_Return_of_the_Prodigal_Son_-_Google_Art_Project.jpg";
    }
    return ""; // fallback if no matching artwork
  };

  return (
    <div>
      <div className="mb-4  pb-4 text-sm">
        {paintings.map((painting, index) => (

          <div key={painting.artworkName + index} className="pt-8 max-w-lg mx-auto text-sm">
          
          <div className='float-right z-[-10] overflow-hidden'> 
            <Image
              src={getArtworkSrc(painting.artworkName)}
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
            <div className='p-4 bg-zinc-600 z-10 mt-6 text-sm'>
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

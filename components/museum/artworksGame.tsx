'use client'

import { useActions, useUIState } from 'ai/rsc'

import Image from 'next/image'

import type { AI } from '@/lib/chat/actions'

interface Artwork {
  artworkName: string,
  artist: string,
  paintingNumber: number,
  filePath: string
}


export function ArtworksGame({ props: artworks }: { props: Artwork[] }) {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <div>
      <div className="mb-4 flex flex-col overflow-y-scroll pb-4 text-sm sm:flex-row">
        {artworks.map((artwork) => (
          <div key={artwork.paintingNumber} className="pt-8 max-w-lg mx-auto text-sm">
            <div className="flex space-x-2 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-xl overflow-hidden hover:border-4 border-green-800">
                <button className=""
                   onClick={async () => {
                    const response = await submitUserMessage(`View ${artwork.paintingNumber}`)
                    setMessages(currentMessages => [...currentMessages, response])
                  }}        
                >
                  <Image
                    src={artwork.filePath}
                    alt={artwork.artworkName}
                    width={128} // Adjust according to your design
                    height={128} // Adjust according to your design
                    className="object-cover h-full w-full"
                  />
                </button>
                </div>
                <span className="mt-2">{artwork.artworkName}</span>
                <span className="mt-2">{artwork.paintingNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 text-center ">
        Which artwork was painted by Vermeer?
      </div>
    </div>
  );
}

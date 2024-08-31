'use client'

import { useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { formatNumber } from '@/lib/utils'
import { TicketIcon } from '@heroicons/react/24/solid'

import type { AI } from '@/lib/chat/actions'

interface Ticket {
  numberOfTickets: number
  totalPrice: number
}

export function Ticket({
  props: { numberOfTickets, totalPrice }
}: {
  props: Ticket
}) {
  const [purchasingUI, setPurchasingUI] = useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()
  const { confirmPurchase } = useActions()


  return (
    <div className='w-3/4'>
          <div className="grid grid-cols-5 items-center gap-4 p-4 border-2 border-gray-400 shadow-lg bg-gray-400/20 rounded-lg border-dashed">
            <div className=" w-3/4 rounded-full bg-white p-2">
              <img
                src="/quantas_logo.png"
                width={32}
                height={32}
                alt="Airline Logo"
                className="object-contain"
                style={{ aspectRatio: "32/32", objectFit: "cover" }}
              />
            </div>
            <div className="font-bold text-lg text-gray-800">Rijksmuseum</div>
            <div></div>
            <div className="w-14 row-span-2">
              <TicketIcon />
            </div>
            <div></div>
            <div className="col-span-2 -mt-8 text-gray-800">
              Number of Tickets: {numberOfTickets}
            </div>
            <div className="text-gray-800 overflow-hidden col-start-2">${totalPrice.toFixed(2)}</div>
            <div></div>
            </div>
    
    </div>
  )
}

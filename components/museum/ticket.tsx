'use client'

import { useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { formatNumber } from '@/lib/utils'
import { TicketIcon } from '@heroicons/react/24/solid'
import { DownloadIcon } from '@radix-ui/react-icons'

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
          <div className="grid grid-cols-3 items-center gap-4 p-4 border-2 border-gray-400 shadow-lg bg-gray-400/20 rounded-lg border-dashed">
            <div className="font-bold text-lg text-gray-800">Rijksmuseum</div>
            <div></div>
            <div className="w-14 row-span-2">
              <TicketIcon />
            </div>
            <div className="text-gray-800 col-span-2">
              Number of Tickets: {numberOfTickets}
            </div>
            <div className="text-gray-800 overflow-hidden">You paid: ${totalPrice.toFixed(2)}</div>
            <div className="text-center col-start-3">
              <DownloadIcon className="w-6 h-6"/></div>
            </div>
    
    </div>
  )
}

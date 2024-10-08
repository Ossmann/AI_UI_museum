'use client'

import { useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'
import { formatNumber } from '@/lib/utils'
import MyDatePicker from './datepicker'

import type { AI } from '@/lib/chat/actions'

interface Purchase {
  numberOfTickets?: number
  price: number
  status: 'requires_action' | 'completed' | 'expired'
}

export function TicketPurchase({
  props: { numberOfTickets, price, status = 'expired' }
}: {
  props: Purchase
}) {
  const [value, setValue] = useState(numberOfTickets || 2)
  const [purchasingUI, setPurchasingUI] = useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()
  const { confirmPurchase } = useActions()
  const { submitUserMessage } = useActions()



  // Unique identifier for this UI component.
  const id = useId()

  // Whenever the slider changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value)
    setValue(newValue)

    // Insert a hidden history info to the list.
    const message = {
      role: 'system' as const,
      content: `[User has changed to purchase ${newValue} tickets. Total cost: $${(
        newValue * price
      ).toFixed(2)}]`,

      // Identifier of this UI component, so we don't insert it many times.
      id
    }

    // If last history state is already this info, update it. This is to avoid
    // adding every slider change to the history.
    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message]
      })

      return
    }

    // If it doesn't exist, append it to history.
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

    //variable to display the 3 steps of selecting
    const [purchasingStep, setPurchasingStep] = useState(1);

    const handleOptionClick = () => {
      // Increase the purchasing step by 1
      setPurchasingStep(purchasingStep + 1);
    };
  
    const handleDateChange = (date: Date | null) => {
      // You can do other things with the date here if needed
      setPurchasingStep((prevStep) => prevStep + 1);
    };

  return (
      <div className="p-4 text-green-400 border rounded-xl bg-zinc-950">
        {purchasingStep > 1 && (
          <div className="inline-block float-right px-2 py-1 text-xs rounded-full bg-white/10">
            200 tickets available for your date ↑
          </div>
        )}
        <div className="text-lg text-zinc-300">Rijksmuseum</div>
        <div className="text-xl font-bold">Ticket Purchase</div>
        {purchasingUI ? (
          <div className="mt-4 text-zinc-200">{purchasingUI}</div>
        ) : status === 'requires_action' ? (
          <>
            {purchasingStep === 1 && (
              <div>
                <div className='text-white text-center'>
                  Choose your ticket type:
                  </div>
  
                <div className="flex justify-center items-center space-x-4 m-4">
                <button
                  className="w-32 h-32 text-zinc-800 font-bold rounded-lg shadow-lg bg-green-400 hover:bg-opacity-60 transition duration-300"
                  onClick={() => handleOptionClick()}
                >
                  <div className='opacity-100'> Entrance <br /> Adults</div>
                </button>
                <button
                  className="w-32 h-32 text-zinc-800 font-bold rounded-lg shadow-lg bg-green-400 hover:bg-opacity-60 transition duration-300"
                  onClick={() => handleOptionClick()}
                >
                  <div className='opacity-100'> Entrance <br /> Children u18</div>
                </button>
                <button
                  className="w-32 h-32 text-zinc-800 font-bold rounded-lg shadow-lg bg-green-400 hover:bg-opacity-60 transition duration-300"
                  onClick={() => handleOptionClick()}
                >
                  <div className='opacity-100'> Friends of the <br /> Museum</div>
                </button>
              </div>
            </div>
            )}
            {purchasingStep === 2 && (
              <div className='text-center'>
              <div className='text-white'>
                Pick a date:
                </div>
                <div className='py-10'>
                  <MyDatePicker 
                    onDateChange={handleDateChange}
                  />
                </div>
                
              </div>
            )}
            {purchasingStep === 3 && (
              <>
                <div className="relative pb-6 mt-6">
                  <p>Number of tickets</p>
                  <input
                    id="labels-range-input"
                    type="range"
                    value={value}
                    onChange={onSliderChange}
                    min="1"
                    max="20"
                    className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-zinc-600 accent-green-500 dark:bg-zinc-700"
                  />
                  <span className="absolute text-xs bottom-1 start-0 text-zinc-400">
                    1
                  </span>
                  <span className="absolute text-xs -translate-x-1/2 bottom-1 start-1/3 text-zinc-400 rtl:translate-x-1/2">
                    5
                  </span>
                  <span className="absolute text-xs -translate-x-1/2 bottom-1 start-2/3 text-zinc-400 rtl:translate-x-1/2">
                    10
                  </span>
                  <span className="absolute text-xs bottom-1 end-0 text-zinc-400">
                    20
                  </span>
                </div>
    
                <div className="mt-6">
                  <p>Total cost</p>
                  <div className="flex flex-wrap items-center text-xl font-bold sm:items-end sm:gap-2 sm:text-3xl">
                    <div className="flex flex-col basis-1/3 tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
                      {value}
                      <span className="mb-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
                        tickets
                      </span>
                    </div>
                    <div className="text-center basis-1/3 sm:basis-auto">×</div>
                    <span className="flex flex-col basis-1/3 tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
                      ${price}
                      <span className="mb-1 ml-1 text-sm font-normal text-zinc-600 sm:mb-0 dark:text-zinc-400">
                        per ticket
                      </span>
                    </span>
                    <div className="pt-2 mt-2 text-center border-t basis-full border-t-zinc-700 sm:mt-0 sm:basis-auto sm:border-0 sm:pt-0 sm:text-left">
                      = <span>{formatNumber(value * price)}</span>
                    </div>
                  </div>
                </div>
    
                <button
                  className="w-full px-4 py-2 mt-6 font-bold bg-green-400 rounded-lg text-zinc-900 hover:bg-green-500"
                  onClick={async () => {
                    const responseUI = await confirmPurchase(price, value)
                    setPurchasingUI(responseUI.purchasingUI)

                    //Send the message to the AI that the ticket is bought to make it call the tool that shows the ticket
                    const response = await submitUserMessage(`Show me the tickets I have purchased.`)
                    setMessages(currentMessages => [...currentMessages, response])


                    // // Insert a new system message to the UI.
                    // setMessages((currentMessages: any) => [
                    //   ...currentMessages,
                    //   response.newMessage
                    // ])
                  }}
                >
                  Purchase
                </button>
              </>
            )}
          </>
        ) : status === 'completed' ? (
          <p className="mb-2 text-white">
            You have successfully purchased {value} tickets. Total cost:{' '}
            {formatNumber(value * price)}
          </p>
        ) : status === 'expired' ? (
          <p className="mb-2 text-white">Your checkout session has expired!</p>
        ) : null}
      </div>
    );
  }

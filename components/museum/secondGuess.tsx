'use client'

import { useActions, useUIState } from 'ai/rsc'

import Image from 'next/image'

import type { AI } from '@/lib/chat/actions'




export function SecondGuess() {
  const [, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <div>
      <div>
          Which artwork was painted by Rembrandt?
        </div>
      <div className='text-sm'>
        Type or select.
        </div>
    </div>
  );
}

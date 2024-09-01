import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import {
  SparklesIcon,
} from '@heroicons/react/24/solid';
import LottiePlayer from './LottiePlayer';

export function EmptyScreen() {
  return (
    <div className="text-white mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-xl bg-zinc-400 backdrop-blur-sm bg-opacity-20 p-8 items-center">
        <h1 className="text-2xl font-semibold text-center text-white">
          Welcome to the UI AI Museum Planner
        </h1>
        <p className="leading-normal text-white text-muted-foreground">
          This is an UI AI chatbot app prototype built to help you plan your museum visit.
          It combines text with generative UI as output of an LLM. The UI state
          is synced through an SDK so the model is aware of your interactions
          as they happen.
        </p>
          
          <div className='w-[60%] flex justify-center -my-8 animate-pulse'>
            <LottiePlayer />
          </div>
          

        
      </div>
    </div>
  )
}

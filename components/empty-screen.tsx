import { UseChatHelpers } from 'ai/react'
import { useState } from 'react';
import { PromptForm } from '@/components/prompt-form'
import { PromptFormOrb } from './prompt-form-orb';
import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import {
  SparklesIcon,
} from '@heroicons/react/24/solid';
import LottiePlayer from './LottiePlayer';

export interface ChatPanelProps {
  setInput: (value: string) => void
}

export function EmptyScreen() {
  const [showPromptForm, setShowPromptForm] = useState(false);
  const [input, setInput] = useState('');

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

        </div>
          
        <div className='relative flex justify-center -my-8'>
          <div className='w-[66%] relative animate-pulse'>
            <button onClick={() => setShowPromptForm(!showPromptForm)}>
              {/* Toggle form visibility on button click */}
              <LottiePlayer />
            </button>
          </div>

          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-[80%] transition-opacity duration-500 ease-in-out ${
              showPromptForm ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {/* Centering the form, but keeping its own width */}
            <PromptFormOrb input={input} setInput={setInput} />
          </div>
        </div>

        
      
    </div>
  )
}

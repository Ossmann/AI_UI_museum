import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { openai } from '@ai-sdk/openai'

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock
} from '@/components/stocks'

import { Purchase } from '@/components/travel/flight-purchase'

import { StockPurchase } from '@/components/stocks/stock-purchase'

import { z } from 'zod';
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { StocksSkeleton } from '@/components/stocks/stocks-skeleton'
import { Stocks } from '@/components/stocks/stocks'
import { StockSkeleton } from '@/components/stocks/stock-skeleton'
import { FlightsSkeleton } from '@/components/travel/flights-skeleton'
import { Flights } from '@/components/travel/flights'
import FlightsSchemaSkeleton from '@/components/travel/flightSchemas-skeleton'
import { FlightSchema } from '@/components/travel/flightSchema'
import { TicketPurchase } from '@/components/museum/ticket-purchase'
import { Ticket } from '@/components/museum/ticket'
import ArtworksGameSkeleton from '@/components/museum/artworksGame_skeleton'
import { ArtworksGame } from '@/components/museum/artworksGame'
import { Exhibitions } from '@/components/museum/exhibitions'
import { RelatedPaintings } from '@/components/museum/related_paintings'

import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'

async function confirmPurchase(price: number, numberOfTickets: number) {
  'use server'

  const totalPrice = price * numberOfTickets
  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {numberOfTickets} for ${price}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
        Purchasing {numberOfTickets} for ${price}...
        working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased your tickets to visit the museum.
          <div className='flex'>
            <div>
              Total cost:
            </div>
            <div className='font-bold'>
              ${totalPrice.toFixed(2)}
            </div>
          </div>
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
          You have successfully AAAA purchased your tickets to the. Total cost:{' $'}{totalPrice.toFixed(2)}
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${numberOfTickets} tickets for a price  ${price} ]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),
    initial: <SpinnerMessage />,
    system: `\
    You are an assistant that helps people prepare for their visit to the Rijksmuseum in Amsterdam.
    You and the user can discuss any topic related to the museum and visiting the museum. The user can purchase their ticket, get infos on the current exhibitions on display, play a mini-game and learn about the museums master pieces. 

     Messages inside [] means that it's a UI element or a user event. For example:
    - "[Price of Ticket = 100]" means that an interface of the ticket price is shown to the user.
    - "[User has changed the amount of tickets to 10]" means that the user has changed the amount of tickets to 10 in the UI.

    If the user wants to purchase tickets, call \`show_purchase\`.

    If the user wants to see his final tickets, call \`show_ticket\`.

    If the user wants to start a mini game that is about assigning the correct artists to artworks, call \`show_artworks_game\`.

    If the user wants to find artworks related to a given example, call \`related_Paintings\`.

    If the user wants to see the current exhibitions, call \`get_Exhibitions\`.

    If the user wants you to perform an impossible task that is not covered by the tools respond that you are a demo and cannot do that.
    
    Besides that, you can also chat with users and do some calculations if needed.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    },
    tools: {
      showArtworksGame: {
        description: "Show three famous paintings to the user. Girl in a Blue Dress by Johannes Cornelisz Verspronck, The Milkmaid by Johannes Vermeer, The Jewish Bride by Rembrandt. Assign each Image a number and let the user guess the correct number.\n\n<artworks>\n  <artwork>\n    <artworkName>Girl in a Blue Dress</artworkName>\n    <artist>Johannes Cornelisz Verspronck</artist>\n    <paintingNumber>1</paintingNumber>\n    <filePath>/Girl_in_a_blue_dress_Verspronck.jpg</filePath>\n  </artwork>\n  \n  <artwork>\n    <artworkName>The Milkmaid</artworkName>\n    <artist>Johannes Vermeer</artist>\n    <paintingNumber>2</paintingNumber>\n    <filePath>/Milkmaid_Verspronck.jpg</filePath>\n  </artwork>\n  \n  <artwork>\n    <artworkName>The Jewish Bride</artworkName>\n    <artist>Rembrandt</artist>\n    <paintingNumber>3</paintingNumber>\n    <filePath>/Jewish_bride_Rembrandt.jpg</filePath>\n  </artwork>\n</artworks> The user needs to guess which painting was painted by Vermeer. Only number 2 is correct.",
        parameters: z.object({
          artworks: z.array(
            z.object({
              artworkName: z.string().describe('The name of an artwork. Girl in a Blue Dress, The Milkmaid or The Jewish Bride.'),
              artist: z.string().describe('The artist, who painted the artwork. Johannes Cornelisz Verspronck, Johannes Vermeer or Rembrandt'),
              paintingNumber: z.number().describe('Assign a number of 1-3 to the paintings, that the user will have to asssign correctly.'),
              filePath: z.string().describe('Path to the file of the paining. /Jewish_bride_Rembrandt.jpg, /Girl_in_a_blue_dress_Verspronck.jpeg, /Milkmaid_Verspronck.jpg.')
            })
          )
        }),
        generate: async function* ({ artworks }) {
          yield (
            <BotCard>
              <ArtworksGameSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'showArtworksGame',
                    toolCallId,
                    args: { artworks }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'showArtworksGame',
                    toolCallId,
                    result: artworks
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <ArtworksGame props={artworks} />
            </BotCard>
          )
        }
      },
      showPurchase: {
        description:
          'Show price and the UI to purchase a ticket for the museum visit. Use this if the user wants to purchase a ticket to visit the museum.',
        parameters: z.object({
          price: z.number().describe('The price of the ticket.'),
          numberOfTickets: z
            .number()
            .optional()
            .describe(
              'The **number of tickets** for a visit to the museum to purchase. Can be optional if the user did not specify it.'
            )
        }),
        generate: async function* ({ price, numberOfTickets = 2 }) {
          const toolCallId = nanoid()

          if (numberOfTickets <= 0 || numberOfTickets > 20) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showTicketPurchase',
                      toolCallId,
                      args: { price, numberOfTickets }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showTicketPurchase',
                      toolCallId,
                      result: {
                        price,
                        numberOfTickets,
                        status: 'expired'
                      }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'system',
                  content: `[User has selected an invalid amount]`
                }
              ]
            })

            return <BotMessage content={'Invalid amount'} />
          } else {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showTicketPurchase',
                      toolCallId,
                      args: { price, numberOfTickets }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showTicketPurchase',
                      toolCallId,
                      result: {
                        price,
                        numberOfTickets
                      }
                    }
                  ]
                }
              ]
            })

            return (
              <BotCard>
                <TicketPurchase
                  props={{
                    numberOfTickets,
                    price: +price,
                    status: 'requires_action'
                  }}
                />
              </BotCard>
            )
          }
        }
      },
      showTickets: {
        description:
          'Show the tickets that a user bought in the previous step. Tickets includes number of tickets and the total price.',
        parameters: z.object({
          totalPrice: z.number().describe('The total price of the purchased tickets.'),
          numberOfTickets: z
            .number()
            .optional()
            .describe(
              'The **number of tickets** for a visit to the museum to purchase. Can be optional if the user did not specify it.'
            )
        }),
        generate: async function* ({ totalPrice, numberOfTickets = 1 }) {
          const toolCallId = nanoid()

          if (numberOfTickets <= 0 || numberOfTickets > 20) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showTickets',
                      toolCallId,
                      args: { totalPrice, numberOfTickets }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showTickets',
                      toolCallId,
                      result: {
                        totalPrice,
                        numberOfTickets,
                        status: 'expired'
                      }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'system',
                  content: `[User has selected an invalid amount]`
                }
              ]
            })

            return <BotMessage content={'Invalid amount'} />
          } else {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showTickets',
                      toolCallId,
                      args: { totalPrice, numberOfTickets }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showTickets',
                      toolCallId,
                      result: {
                        totalPrice,
                        numberOfTickets
                      }
                    }
                  ]
                }
              ]
            })

            return (
              <BotCard>
                <Ticket
                  props={{
                    numberOfTickets: numberOfTickets,
                    totalPrice: totalPrice,
                  }}
                />
              </BotCard>
            )
          }
        }
      },
      relatedPaintings: {
        description:
          'List three paintings relatd to a given artwork. Explain briefly there could be a connection to the given painting.',
        parameters: z.object({
          relatedWorks: z.array(
            z.object({
              src: z.string().describe('Find a weblink of an image from wikimedia of the painting.'),
              artworkName: z.string().describe('The name of an artwork.'),
              artist: z.string().describe('The artist, who painted the artwork.'),
              explanation: z.string().describe('Explanation why the painting is related to the given example.'),
            })
          )
        }),
        generate: async function* ({ relatedWorks }) {
          // Log the src values here
          relatedWorks.forEach(work => {
            console.log("Console of the WebImage Link:", work.src); // Logs the src of each painting
          });

          yield (
            <BotCard>
              <EventsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'relatedPaintings',
                    toolCallId,
                    args: { relatedWorks }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'relatedPaintings',
                    toolCallId,
                    result: relatedWorks
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <RelatedPaintings props={relatedWorks} />
            </BotCard>
          )
        }
      },
      listFlights: {
        description: 'List three imaginary flights from the city that that the user is interested to a destination airport city around the world.',
        parameters: z.object({
          flights: z.array(
            z.object({
              flightId: z.number().describe('A unique id number for a flight'),
              airportCodeDeparture: z.string().describe('The airport where the flight departs, for example OOL'),
              airportCodeArrival: z.string().describe('The airport where the flight departs, for example OOL'),
              price: z.number().describe('The price of the flight'),
              flightNumber: z.string().describe('The flight number of the flight.'),
              airline: z.string().describe('The airline that operates the flight.'),
              ticketPrice: z.number().describe('Price of the flight ticket.')
            })
          )
        }),
        generate: async function* ({ flights }) {
          yield (
            <BotCard>
              <FlightsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'listFlights',
                    toolCallId,
                    args: { flights }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'listFlights',
                    toolCallId,
                    result: flights
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Flights props={flights} />
            </BotCard>
          )
        }
      },
      showFlightPurchase: {
        description:
          'Show price and the UI to purchase the ticket for the previously selected flight. Also show the purchase button. Use this if the user wants to purchase a flight ticket.',
        parameters: z.object({
          airline: z
            .string()
            .describe(
              'The name of the airline that was selected prior.'
            ),
          ticketPrice: z.number().describe('The price of the flight ticket as selected prior.'),
          flightNumber: z.string().describe('The flight number for the selected ticket.'),
          departureAirport: z.string().describe('The airport where the selcted flights departs.'),
          destinationAirport: z.string().describe('The airport where the selected flight lands.'),
          
        }),
        generate: async function* ({ airline, ticketPrice, flightNumber, departureAirport, destinationAirport }) {
          const toolCallId = nanoid()

            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showFlightPurchase',
                      toolCallId,
                      args: { airline, ticketPrice, flightNumber, departureAirport, destinationAirport }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showFlightPurchase',
                      toolCallId,
                      result: {
                        airline, ticketPrice, flightNumber, departureAirport, destinationAirport
                      }
                    }
                  ]
                }
              ]
            })

            return (
              <BotCard>
                <Purchase
                  props={{
                    airline,
                    ticketPrice,
                    flightNumber,
                    departureAirport,
                    destinationAirport,
                    status: 'requires_action'
                  }}
                />
              </BotCard>
            )
        }
      },
      listFlightSchemas: {
        description:
          'Make up details for 5 imaginary flightSchemas on 5 different dates for a flight number that the user provides you to get details. Make up these values for those variables defined in the flightSchemas object. Make one flight status Cancelled',
        parameters: z.object({
          flightSchema: z.array(
            z.object({
              date: z.string().describe('The made up date for the fictional flight number, for example Mo., 26. Aug.'),
              terminalFrom: z.string().describe('The airport terminal where the flight departs from, e.g., Terminal 1'),
              terminalTo: z.string().describe('The airport terminal where the flight arrives, e.g., Terminal 2'),
              flightNumber: z.string().describe('The flight number, e.g., QF 5401'),
              from: z.string().describe('The IATA code of the departure airport, e.g., OOL for Gold Coast Airport'),
              to: z.string().describe('The IATA code of the arrival airport, e.g., SYD for Sydney Airport'),
              departureTime: z.string().describe('The scheduled departure time of the flight, e.g., 6:00 AM'),
              arrivalTime: z.string().describe('The scheduled arrival time of the flight, e.g., 7:25 AM'),
              gate: z.string().describe('The gate number from which the flight departs, e.g., Gate 8'),
              progress: z.number().min(0).max(1).describe('The progress of the flight as a number between 0 and 1, where 0 means the flight has not started and 1 means the flight has completed'),
              duration: z.string().describe('The total duration of the flight, e.g., 1 Std., 25 Min.'),
              status: z.enum(['On time', 'Delayed', 'Cancelled']).describe('The current status of the flight, which can be "On time", "Delayed", or "Cancelled"'),
            })
          )
        }),
        generate: async function* ({ flightSchema }) {
          yield (
            <BotCard>
              <FlightsSchemaSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'listFlightSchemas',
                    toolCallId,
                    args: { flightSchema }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'listFlightSchemas',
                    toolCallId,
                    result: flightSchema
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <FlightSchema props={flightSchema} />
            </BotCard>
          )
        }
      },
      listStocks: {
        description: 'List three imaginary stocks that are trending.',
        parameters: z.object({
          stocks: z.array(
            z.object({
              symbol: z.string().describe('The symbol of the stock'),
              price: z.number().describe('The price of the stock'),
              delta: z.number().describe('The change in price of the stock')
            })
          )
        }),
        generate: async function* ({ stocks }) {
          yield (
            <BotCard>
              <StocksSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'listStocks',
                    toolCallId,
                    args: { stocks }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'listStocks',
                    toolCallId,
                    result: stocks
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Stocks props={stocks} />
            </BotCard>
          )
        }
      },
      showStockPrice: {
        description:
          'Get the current stock price of a given stock or currency. Use this to show the price to the user.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
            ),
          price: z.number().describe('The price of the stock.'),
          delta: z.number().describe('The change in price of the stock')
        }),
        generate: async function* ({ symbol, price, delta }) {
          yield (
            <BotCard>
              <StockSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'showStockPrice',
                    toolCallId,
                    args: { symbol, price, delta }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'showStockPrice',
                    toolCallId,
                    result: { symbol, price, delta }
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Stock props={{ symbol, price, delta }} />
            </BotCard>
          )
        }
      },
      showStockPurchase: {
        description:
          'Show price and the UI to purchase a stock or currency. Use this if the user wants to purchase a stock or currency.',
        parameters: z.object({
          symbol: z
            .string()
            .describe(
              'The name or symbol of the stock or currency. e.g. DOGE/AAPL/USD.'
            ),
          price: z.number().describe('The price of the stock.'),
          numberOfShares: z
            .number()
            .optional()
            .describe(
              'The **number of shares** for a stock or currency to purchase. Can be optional if the user did not specify it.'
            )
        }),
        generate: async function* ({ symbol, price, numberOfShares = 100 }) {
          const toolCallId = nanoid()

          if (numberOfShares <= 0 || numberOfShares > 1000) {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      args: { symbol, price, numberOfShares }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      result: {
                        symbol,
                        price,
                        numberOfShares,
                        status: 'expired'
                      }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'system',
                  content: `[User has selected an invalid amount]`
                }
              ]
            })

            return <BotMessage content={'Invalid amount'} />
          } else {
            aiState.done({
              ...aiState.get(),
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: 'assistant',
                  content: [
                    {
                      type: 'tool-call',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      args: { symbol, price, numberOfShares }
                    }
                  ]
                },
                {
                  id: nanoid(),
                  role: 'tool',
                  content: [
                    {
                      type: 'tool-result',
                      toolName: 'showStockPurchase',
                      toolCallId,
                      result: {
                        symbol,
                        price,
                        numberOfShares
                      }
                    }
                  ]
                }
              ]
            })

            return (
              <BotCard>
                <StockPurchase
                  props={{
                    numberOfShares,
                    symbol,
                    price: +price,
                    status: 'requires_action'
                  }}
                />
              </BotCard>
            )
          }
        }
      },
      getExhibitions: {
        description:
          'List three imaginary exhibitions between user highlighted dates that could be at display at Rijksmuseum.',
        parameters: z.object({
          exhibitions: z.array(
            z.object({
              date: z
                .string()
                .describe('The date of the exhibition, in ISO-8601 format'),
              headline: z.string().describe('The headline of the exhibition'),
              description: z.string().describe('The description of the exhibition')
            })
          )
        }),
        generate: async function* ({ exhibitions }) {
          yield (
            <BotCard>
              <EventsSkeleton />
            </BotCard>
          )

          await sleep(1000)

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getExhibitions',
                    toolCallId,
                    args: { exhibitions }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getExhibitions',
                    toolCallId,
                    result: exhibitions
                  }
                ]
              }
            ]
          })

          return (
            <BotCard>
              <Exhibitions props={exhibitions} />
            </BotCard>
          )
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const userId = session.user.id as string
      const path = `/chat/${chatId}`

      const firstMessageContent = messages[0].content as string
      const title = firstMessageContent.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map(tool => {
            return tool.toolName === 'listStocks' ? (
              <BotCard>
                {/* TODO: Infer types based on the tool result*/}
                {/* @ts-expect-error */}
                <Stocks props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPrice' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Stock props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'showStockPurchase' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Purchase props={tool.result} />
              </BotCard>
            ) : tool.toolName === 'getEvents' ? (
              <BotCard>
                {/* @ts-expect-error */}
                <Events props={tool.result} />
              </BotCard>
            ) : null
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null
    }))
}

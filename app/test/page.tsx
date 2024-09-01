'use client';

import { TestArtWorkGame } from "./test_component";

const artworks = [
  {
    artworkName: 'Girl in a Blue Dress',
    artist: 'Johannes Cornelisz Verspronck',
    paintingNumber: 1,
    filePath: '/Girl_in_a_Blue_Dress.jpg',
  },
  {
    artworkName: 'The Milkmaid',
    artist: 'Johannes Vermeer',
    paintingNumber: 2,
    filePath: '/The_Milkmaid_Vermeer.jpg',
  },
  {
    artworkName: 'The Jewish Bride',
    artist: 'Rembrandt',
    paintingNumber: 3,
    filePath: '/Jewish_Bride_Rembrandt.jpg',
  },
];

export default function TestPage() {
  return <TestArtWorkGame props={artworks} />;
}
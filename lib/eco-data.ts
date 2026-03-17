import type { ECOOpening } from './types';

// Curated subset of common chess openings with ECO codes
export const ecoOpenings: ECOOpening[] = [
  // A - Flank Openings
  { eco: "A00", name: "Uncommon Opening", moves: "1. g4" },
  { eco: "A00", name: "Anderssen's Opening", moves: "1. a3" },
  { eco: "A00", name: "Ware Opening", moves: "1. a4" },
  { eco: "A00", name: "Saragossa Opening", moves: "1. c3" },
  { eco: "A01", name: "Nimzowitsch-Larsen Attack", moves: "1. b3" },
  { eco: "A02", name: "Bird's Opening", moves: "1. f4" },
  { eco: "A04", name: "Reti Opening", moves: "1. Nf3" },
  { eco: "A05", name: "Reti Opening: King's Indian Attack", moves: "1. Nf3 Nf6" },
  { eco: "A06", name: "Reti Opening: Symmetrical", moves: "1. Nf3 d5" },
  { eco: "A07", name: "Reti Opening: King's Indian Attack", moves: "1. Nf3 d5 2. g3" },
  { eco: "A09", name: "Reti Opening: Advance Variation", moves: "1. Nf3 d5 2. c4" },
  { eco: "A10", name: "English Opening", moves: "1. c4" },
  { eco: "A13", name: "English Opening: Agincourt Defense", moves: "1. c4 e6" },
  { eco: "A15", name: "English Opening: Anglo-Indian Defense", moves: "1. c4 Nf6" },
  { eco: "A16", name: "English Opening: Anglo-Indian Defense", moves: "1. c4 Nf6 2. Nc3" },
  { eco: "A20", name: "English Opening: Reversed Sicilian", moves: "1. c4 e5" },
  { eco: "A22", name: "English Opening: Bremen System", moves: "1. c4 e5 2. Nc3 Nf6" },
  { eco: "A25", name: "English Opening: Closed System", moves: "1. c4 e5 2. Nc3 Nc6" },
  { eco: "A30", name: "English Opening: Symmetrical Variation", moves: "1. c4 c5" },
  { eco: "A40", name: "Queen's Pawn Game", moves: "1. d4" },
  { eco: "A41", name: "Queen's Pawn Game: Wade Defense", moves: "1. d4 d6" },
  { eco: "A43", name: "Old Benoni Defense", moves: "1. d4 c5" },
  { eco: "A45", name: "Indian Defense", moves: "1. d4 Nf6" },
  { eco: "A46", name: "Indian Defense: London System", moves: "1. d4 Nf6 2. Nf3" },
  { eco: "A48", name: "London System", moves: "1. d4 Nf6 2. Nf3 g6 3. Bf4" },
  { eco: "A49", name: "King's Indian Defense: Fianchetto Variation", moves: "1. d4 Nf6 2. Nf3 g6" },
  { eco: "A50", name: "Indian Defense: Normal Variation", moves: "1. d4 Nf6 2. c4" },
  { eco: "A51", name: "Budapest Gambit", moves: "1. d4 Nf6 2. c4 e5" },
  { eco: "A52", name: "Budapest Gambit: Accepted", moves: "1. d4 Nf6 2. c4 e5 3. dxe5" },
  { eco: "A53", name: "Old Indian Defense", moves: "1. d4 Nf6 2. c4 d6" },
  { eco: "A56", name: "Benoni Defense", moves: "1. d4 Nf6 2. c4 c5" },
  { eco: "A57", name: "Benko Gambit", moves: "1. d4 Nf6 2. c4 c5 3. d5 b5" },
  { eco: "A60", name: "Benoni Defense: Modern Variation", moves: "1. d4 Nf6 2. c4 c5 3. d5 e6" },
  { eco: "A70", name: "Benoni Defense: Classical Variation", moves: "1. d4 Nf6 2. c4 c5 3. d5 e6 4. Nc3 exd5 5. cxd5 d6 6. e4 g6 7. Nf3" },
  { eco: "A80", name: "Dutch Defense", moves: "1. d4 f5" },
  { eco: "A81", name: "Dutch Defense: Fianchetto Variation", moves: "1. d4 f5 2. g3" },
  { eco: "A83", name: "Dutch Defense: Staunton Gambit", moves: "1. d4 f5 2. e4" },
  { eco: "A85", name: "Dutch Defense: Queen's Knight Variation", moves: "1. d4 f5 2. c4 Nf6 3. Nc3" },
  { eco: "A90", name: "Dutch Defense: Classical Variation", moves: "1. d4 f5 2. c4 Nf6 3. g3 e6 4. Bg2" },

  // B - Semi-Open Games
  { eco: "B00", name: "Nimzowitsch Defense", moves: "1. e4 Nc6" },
  { eco: "B01", name: "Scandinavian Defense", moves: "1. e4 d5" },
  { eco: "B02", name: "Alekhine Defense", moves: "1. e4 Nf6" },
  { eco: "B03", name: "Alekhine Defense: Four Pawns Attack", moves: "1. e4 Nf6 2. e5 Nd5 3. d4 d6 4. c4 Nb6 5. f4" },
  { eco: "B06", name: "Modern Defense", moves: "1. e4 g6" },
  { eco: "B07", name: "Pirc Defense", moves: "1. e4 d6 2. d4 Nf6" },
  { eco: "B09", name: "Pirc Defense: Austrian Attack", moves: "1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. f4" },
  { eco: "B10", name: "Caro-Kann Defense", moves: "1. e4 c6" },
  { eco: "B12", name: "Caro-Kann Defense: Advance Variation", moves: "1. e4 c6 2. d4 d5 3. e5" },
  { eco: "B13", name: "Caro-Kann Defense: Exchange Variation", moves: "1. e4 c6 2. d4 d5 3. exd5 cxd5" },
  { eco: "B14", name: "Caro-Kann Defense: Panov-Botvinnik Attack", moves: "1. e4 c6 2. d4 d5 3. exd5 cxd5 4. c4" },
  { eco: "B15", name: "Caro-Kann Defense: Main Line", moves: "1. e4 c6 2. d4 d5 3. Nc3" },
  { eco: "B17", name: "Caro-Kann Defense: Steinitz Variation", moves: "1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Nd7" },
  { eco: "B18", name: "Caro-Kann Defense: Classical Variation", moves: "1. e4 c6 2. d4 d5 3. Nc3 dxe4 4. Nxe4 Bf5" },
  { eco: "B20", name: "Sicilian Defense", moves: "1. e4 c5" },
  { eco: "B21", name: "Sicilian Defense: Smith-Morra Gambit", moves: "1. e4 c5 2. d4 cxd4 3. c3" },
  { eco: "B22", name: "Sicilian Defense: Alapin Variation", moves: "1. e4 c5 2. c3" },
  { eco: "B23", name: "Sicilian Defense: Closed Variation", moves: "1. e4 c5 2. Nc3" },
  { eco: "B27", name: "Sicilian Defense: Hyper-Accelerated Dragon", moves: "1. e4 c5 2. Nf3 g6" },
  { eco: "B30", name: "Sicilian Defense: Old Sicilian", moves: "1. e4 c5 2. Nf3 Nc6" },
  { eco: "B32", name: "Sicilian Defense: Open Variation", moves: "1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4" },
  { eco: "B33", name: "Sicilian Defense: Sveshnikov Variation", moves: "1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e5" },
  { eco: "B35", name: "Sicilian Defense: Accelerated Dragon", moves: "1. e4 c5 2. Nf3 Nc6 3. d4 cxd4 4. Nxd4 g6 5. Nc3 Bg7" },
  { eco: "B40", name: "Sicilian Defense: Paulsen Variation", moves: "1. e4 c5 2. Nf3 e6" },
  { eco: "B41", name: "Sicilian Defense: Kan Variation", moves: "1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 a6" },
  { eco: "B44", name: "Sicilian Defense: Taimanov Variation", moves: "1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6" },
  { eco: "B50", name: "Sicilian Defense: Modern Variations", moves: "1. e4 c5 2. Nf3 d6" },
  { eco: "B52", name: "Sicilian Defense: Moscow Variation", moves: "1. e4 c5 2. Nf3 d6 3. Bb5+" },
  { eco: "B54", name: "Sicilian Defense: Dragon Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6" },
  { eco: "B60", name: "Sicilian Defense: Richter-Rauzer Attack", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 Nc6 6. Bg5" },
  { eco: "B70", name: "Sicilian Defense: Dragon Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6" },
  { eco: "B72", name: "Sicilian Defense: Dragon, Classical Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3" },
  { eco: "B76", name: "Sicilian Defense: Dragon, Yugoslav Attack", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 g6 6. Be3 Bg7 7. f3" },
  { eco: "B80", name: "Sicilian Defense: Scheveningen Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6" },
  { eco: "B85", name: "Sicilian Defense: Scheveningen, Classical Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 e6 6. Be2 a6" },
  { eco: "B90", name: "Sicilian Defense: Najdorf Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6" },
  { eco: "B92", name: "Sicilian Defense: Najdorf, Opocensky Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be2" },
  { eco: "B96", name: "Sicilian Defense: Najdorf, English Attack", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3" },
  { eco: "B97", name: "Sicilian Defense: Najdorf, Poisoned Pawn Variation", moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Bg5 e6 7. f4 Qb6" },

  // C - Open Games
  { eco: "C00", name: "French Defense", moves: "1. e4 e6" },
  { eco: "C01", name: "French Defense: Exchange Variation", moves: "1. e4 e6 2. d4 d5 3. exd5 exd5" },
  { eco: "C02", name: "French Defense: Advance Variation", moves: "1. e4 e6 2. d4 d5 3. e5" },
  { eco: "C03", name: "French Defense: Tarrasch Variation", moves: "1. e4 e6 2. d4 d5 3. Nd2" },
  { eco: "C06", name: "French Defense: Tarrasch, Closed Variation", moves: "1. e4 e6 2. d4 d5 3. Nd2 Nf6 4. e5 Nfd7 5. Bd3 c5 6. c3 Nc6 7. Ne2" },
  { eco: "C10", name: "French Defense: Rubinstein Variation", moves: "1. e4 e6 2. d4 d5 3. Nc3 dxe4 4. Nxe4" },
  { eco: "C11", name: "French Defense: Classical Variation", moves: "1. e4 e6 2. d4 d5 3. Nc3 Nf6" },
  { eco: "C15", name: "French Defense: Winawer Variation", moves: "1. e4 e6 2. d4 d5 3. Nc3 Bb4" },
  { eco: "C18", name: "French Defense: Winawer, Poisoned Pawn Variation", moves: "1. e4 e6 2. d4 d5 3. Nc3 Bb4 4. e5 c5 5. a3 Bxc3+ 6. bxc3 Ne7 7. Qg4" },
  { eco: "C20", name: "King's Pawn Game", moves: "1. e4 e5" },
  { eco: "C21", name: "Center Game", moves: "1. e4 e5 2. d4 exd4" },
  { eco: "C23", name: "Bishop's Opening", moves: "1. e4 e5 2. Bc4" },
  { eco: "C24", name: "Bishop's Opening: Berlin Defense", moves: "1. e4 e5 2. Bc4 Nf6" },
  { eco: "C25", name: "Vienna Game", moves: "1. e4 e5 2. Nc3" },
  { eco: "C26", name: "Vienna Game: Falkbeer Variation", moves: "1. e4 e5 2. Nc3 Nf6" },
  { eco: "C29", name: "Vienna Gambit", moves: "1. e4 e5 2. Nc3 Nf6 3. f4" },
  { eco: "C30", name: "King's Gambit", moves: "1. e4 e5 2. f4" },
  { eco: "C33", name: "King's Gambit Accepted", moves: "1. e4 e5 2. f4 exf4" },
  { eco: "C36", name: "King's Gambit Accepted: Modern Defense", moves: "1. e4 e5 2. f4 exf4 3. Nf3 d5" },
  { eco: "C40", name: "King's Knight Opening", moves: "1. e4 e5 2. Nf3" },
  { eco: "C41", name: "Philidor Defense", moves: "1. e4 e5 2. Nf3 d6" },
  { eco: "C42", name: "Petrov's Defense", moves: "1. e4 e5 2. Nf3 Nf6" },
  { eco: "C43", name: "Petrov's Defense: Classical Attack", moves: "1. e4 e5 2. Nf3 Nf6 3. d4" },
  { eco: "C44", name: "Scotch Game", moves: "1. e4 e5 2. Nf3 Nc6 3. d4" },
  { eco: "C45", name: "Scotch Game: Main Line", moves: "1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4" },
  { eco: "C46", name: "Three Knights Game", moves: "1. e4 e5 2. Nf3 Nc6 3. Nc3" },
  { eco: "C47", name: "Four Knights Game", moves: "1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6" },
  { eco: "C48", name: "Four Knights Game: Spanish Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Nc3 Nf6 4. Bb5" },
  { eco: "C50", name: "Italian Game", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4" },
  { eco: "C51", name: "Italian Game: Evans Gambit", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4" },
  { eco: "C53", name: "Italian Game: Classical Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5" },
  { eco: "C54", name: "Italian Game: Giuoco Piano", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3" },
  { eco: "C55", name: "Two Knights Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6" },
  { eco: "C57", name: "Two Knights Defense: Fried Liver Attack", moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 d5 5. exd5 Nxd5 6. Nxf7" },
  { eco: "C60", name: "Ruy Lopez", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5" },
  { eco: "C62", name: "Ruy Lopez: Steinitz Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 d6" },
  { eco: "C63", name: "Ruy Lopez: Schliemann Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 f5" },
  { eco: "C64", name: "Ruy Lopez: Classical Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 Bc5" },
  { eco: "C65", name: "Ruy Lopez: Berlin Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6" },
  { eco: "C67", name: "Ruy Lopez: Berlin Defense, Open Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Nxe4" },
  { eco: "C68", name: "Ruy Lopez: Exchange Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Bxc6" },
  { eco: "C70", name: "Ruy Lopez: Morphy Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6" },
  { eco: "C72", name: "Ruy Lopez: Modern Steinitz Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 d6" },
  { eco: "C77", name: "Ruy Lopez: Morphy Defense, Anderssen Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. d3" },
  { eco: "C78", name: "Ruy Lopez: Morphy Defense, Archangelsk Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O b5" },
  { eco: "C80", name: "Ruy Lopez: Open Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4" },
  { eco: "C82", name: "Ruy Lopez: Open, Dilworth Variation", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Nxe4 6. d4 b5 7. Bb3 d5 8. dxe5 Be6 9. c3 Bc5" },
  { eco: "C84", name: "Ruy Lopez: Closed Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7" },
  { eco: "C88", name: "Ruy Lopez: Closed, Anti-Marshall", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. a4" },
  { eco: "C89", name: "Ruy Lopez: Marshall Attack", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 O-O 8. c3 d5" },
  { eco: "C92", name: "Ruy Lopez: Closed, Flohr System", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3" },
  { eco: "C95", name: "Ruy Lopez: Closed, Breyer Defense", moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8" },

  // D - Closed and Semi-Closed Games
  { eco: "D00", name: "Queen's Pawn Game", moves: "1. d4 d5" },
  { eco: "D01", name: "Richter-Veresov Attack", moves: "1. d4 d5 2. Nc3 Nf6 3. Bg5" },
  { eco: "D02", name: "Queen's Pawn Game: London System", moves: "1. d4 d5 2. Nf3 Nf6 3. Bf4" },
  { eco: "D04", name: "Colle System", moves: "1. d4 d5 2. Nf3 Nf6 3. e3" },
  { eco: "D05", name: "Colle System: Slow Variation", moves: "1. d4 d5 2. Nf3 Nf6 3. e3 e6 4. Bd3 c5 5. c3" },
  { eco: "D06", name: "Queen's Gambit", moves: "1. d4 d5 2. c4" },
  { eco: "D07", name: "Queen's Gambit Declined: Chigorin Defense", moves: "1. d4 d5 2. c4 Nc6" },
  { eco: "D10", name: "Slav Defense", moves: "1. d4 d5 2. c4 c6" },
  { eco: "D11", name: "Slav Defense: Modern Line", moves: "1. d4 d5 2. c4 c6 3. Nf3" },
  { eco: "D12", name: "Slav Defense: Landau Variation", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. e3 Bf5" },
  { eco: "D13", name: "Slav Defense: Exchange Variation", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. cxd5 cxd5" },
  { eco: "D15", name: "Slav Defense: Main Line", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3" },
  { eco: "D17", name: "Slav Defense: Czech Variation", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 dxc4 5. a4 Bf5" },
  { eco: "D20", name: "Queen's Gambit Accepted", moves: "1. d4 d5 2. c4 dxc4" },
  { eco: "D22", name: "Queen's Gambit Accepted: Alekhine Defense", moves: "1. d4 d5 2. c4 dxc4 3. Nf3 a6" },
  { eco: "D24", name: "Queen's Gambit Accepted: Main Line", moves: "1. d4 d5 2. c4 dxc4 3. Nf3 Nf6 4. Nc3" },
  { eco: "D26", name: "Queen's Gambit Accepted: Classical Defense", moves: "1. d4 d5 2. c4 dxc4 3. Nf3 Nf6 4. e3 e6" },
  { eco: "D30", name: "Queen's Gambit Declined", moves: "1. d4 d5 2. c4 e6" },
  { eco: "D31", name: "Queen's Gambit Declined: Semi-Slav", moves: "1. d4 d5 2. c4 e6 3. Nc3 c6" },
  { eco: "D32", name: "Queen's Gambit Declined: Tarrasch Defense", moves: "1. d4 d5 2. c4 e6 3. Nc3 c5" },
  { eco: "D35", name: "Queen's Gambit Declined: Exchange Variation", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. cxd5 exd5" },
  { eco: "D37", name: "Queen's Gambit Declined: Three Knights Variation", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3" },
  { eco: "D38", name: "Queen's Gambit Declined: Ragozin Defense", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3 Bb4" },
  { eco: "D40", name: "Queen's Gambit Declined: Semi-Tarrasch Defense", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Nf3 c5" },
  { eco: "D43", name: "Semi-Slav Defense", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6" },
  { eco: "D45", name: "Semi-Slav Defense: Normal Variation", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3" },
  { eco: "D46", name: "Semi-Slav Defense: Meran Variation", moves: "1. d4 d5 2. c4 c6 3. Nf3 Nf6 4. Nc3 e6 5. e3 Nbd7 6. Bd3" },
  { eco: "D50", name: "Queen's Gambit Declined: Modern Variation", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5" },
  { eco: "D52", name: "Queen's Gambit Declined: Cambridge Springs Defense", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Nbd7 5. e3 c6 6. Nf3 Qa5" },
  { eco: "D53", name: "Queen's Gambit Declined: Orthodox Defense", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7" },
  { eco: "D58", name: "Queen's Gambit Declined: Tartakower Variation", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 h6 7. Bh4 b6" },
  { eco: "D60", name: "Queen's Gambit Declined: Orthodox Defense", moves: "1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7" },
  { eco: "D70", name: "Neo-Grunfeld Defense", moves: "1. d4 Nf6 2. c4 g6 3. f3 d5" },
  { eco: "D76", name: "Neo-Grunfeld Defense: Exchange Variation", moves: "1. d4 Nf6 2. c4 g6 3. g3 d5 4. cxd5 Nxd5 5. Bg2" },
  { eco: "D80", name: "Grunfeld Defense", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 d5" },
  { eco: "D85", name: "Grunfeld Defense: Exchange Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3" },
  { eco: "D90", name: "Grunfeld Defense: Three Knights Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. Nf3" },
  { eco: "D97", name: "Grunfeld Defense: Russian Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 d5 4. Nf3 Bg7 5. Qb3" },

  // E - Indian Defenses
  { eco: "E00", name: "Indian Defense", moves: "1. d4 Nf6 2. c4 e6" },
  { eco: "E01", name: "Catalan Opening", moves: "1. d4 Nf6 2. c4 e6 3. g3" },
  { eco: "E04", name: "Catalan Opening: Open Defense", moves: "1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 dxc4" },
  { eco: "E06", name: "Catalan Opening: Closed Defense", moves: "1. d4 Nf6 2. c4 e6 3. g3 d5 4. Bg2 Be7" },
  { eco: "E10", name: "Indian Defense: Anti-Nimzo-Indian", moves: "1. d4 Nf6 2. c4 e6 3. Nf3" },
  { eco: "E11", name: "Bogo-Indian Defense", moves: "1. d4 Nf6 2. c4 e6 3. Nf3 Bb4+" },
  { eco: "E12", name: "Queen's Indian Defense", moves: "1. d4 Nf6 2. c4 e6 3. Nf3 b6" },
  { eco: "E15", name: "Queen's Indian Defense: Classical Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3" },
  { eco: "E17", name: "Queen's Indian Defense: Fianchetto Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nf3 b6 4. g3 Bb7 5. Bg2 Be7" },
  { eco: "E20", name: "Nimzo-Indian Defense", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4" },
  { eco: "E21", name: "Nimzo-Indian Defense: Three Knights Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Nf3" },
  { eco: "E24", name: "Nimzo-Indian Defense: Samisch Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. a3 Bxc3+ 5. bxc3" },
  { eco: "E30", name: "Nimzo-Indian Defense: Leningrad Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Bg5" },
  { eco: "E32", name: "Nimzo-Indian Defense: Classical Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. Qc2" },
  { eco: "E40", name: "Nimzo-Indian Defense: Rubinstein Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3" },
  { eco: "E46", name: "Nimzo-Indian Defense: Reshevsky Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O" },
  { eco: "E48", name: "Nimzo-Indian Defense: Normal Variation", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5" },
  { eco: "E52", name: "Nimzo-Indian Defense: Main Line", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 b6" },
  { eco: "E54", name: "Nimzo-Indian Defense: Main Line", moves: "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. Nf3 c5" },
  { eco: "E60", name: "King's Indian Defense", moves: "1. d4 Nf6 2. c4 g6" },
  { eco: "E61", name: "King's Indian Defense: Fianchetto Variation", moves: "1. d4 Nf6 2. c4 g6 3. g3" },
  { eco: "E62", name: "King's Indian Defense: Fianchetto, Classical Variation", moves: "1. d4 Nf6 2. c4 g6 3. g3 Bg7 4. Bg2 O-O 5. Nc3 d6 6. Nf3" },
  { eco: "E70", name: "King's Indian Defense: Normal Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4" },
  { eco: "E73", name: "King's Indian Defense: Averbakh Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Be2 O-O 6. Bg5" },
  { eco: "E76", name: "King's Indian Defense: Four Pawns Attack", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f4" },
  { eco: "E80", name: "King's Indian Defense: Samisch Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3" },
  { eco: "E85", name: "King's Indian Defense: Samisch, Orthodox Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. f3 O-O 6. Be3 e5" },
  { eco: "E90", name: "King's Indian Defense: Classical Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3" },
  { eco: "E92", name: "King's Indian Defense: Classical Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2" },
  { eco: "E94", name: "King's Indian Defense: Orthodox Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5" },
  { eco: "E97", name: "King's Indian Defense: Main Line", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6" },
  { eco: "E99", name: "King's Indian Defense: Mar del Plata Variation", moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6 5. Nf3 O-O 6. Be2 e5 7. O-O Nc6 8. d5 Ne7 9. Ne1" },
];

// Group openings by ECO category
export function getOpeningsByEcoCategory(): Record<string, ECOOpening[]> {
  const categories: Record<string, ECOOpening[]> = {
    'A': [],
    'B': [],
    'C': [],
    'D': [],
    'E': [],
  };

  ecoOpenings.forEach(opening => {
    const category = opening.eco.charAt(0) as keyof typeof categories;
    if (categories[category]) {
      categories[category].push(opening);
    }
  });

  return categories;
}

// ECO category descriptions
export const ecoCategoryDescriptions: Record<string, string> = {
  'A': 'Flank Openings - English, Reti, Dutch, etc.',
  'B': 'Semi-Open Games - Sicilian, Caro-Kann, French, Pirc, etc.',
  'C': 'Open Games - Italian, Ruy Lopez, King\'s Gambit, etc.',
  'D': 'Closed Games - Queen\'s Gambit, Slav, Grunfeld, etc.',
  'E': 'Indian Defenses - Nimzo-Indian, King\'s Indian, Queen\'s Indian, etc.',
};

// Search openings
export function searchOpenings(query: string): ECOOpening[] {
  const lowerQuery = query.toLowerCase();
  return ecoOpenings.filter(
    opening =>
      opening.name.toLowerCase().includes(lowerQuery) ||
      opening.eco.toLowerCase().includes(lowerQuery) ||
      opening.moves.toLowerCase().includes(lowerQuery)
  );
}

// Get opening by ECO code
export function getOpeningByEco(eco: string): ECOOpening | undefined {
  return ecoOpenings.find(opening => opening.eco === eco);
}

// Get all openings for a specific ECO code (some codes have multiple lines)
export function getOpeningsByEco(eco: string): ECOOpening[] {
  return ecoOpenings.filter(opening => opening.eco === eco);
}

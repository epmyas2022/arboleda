export interface Character {
  scale: number
  points: {
    x: number
    y: number
    z: number
  }
}

export type CharacterType = 'fox' | 'deer' | 'elephant' | 'rabbit' | 'rhinoceros'

export type Positions = Record<CharacterType, Character>

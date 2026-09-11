import type { Room } from '../../types'

export type RoomFormValues = Pick<Room, 'name' | 'description'>
export type RoomUpdate = Partial<Omit<Room, 'id'>>

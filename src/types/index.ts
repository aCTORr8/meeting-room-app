export interface User {
  uid: string
  email: string
  displayName: string | null
}

export interface RoomRole {
  email: string
  role: 'Admin' | 'User'
}

export interface Room {
  id: string
  name: string
  description: string
  ownerId: string
  allowedUsers: RoomRole[]
}

export interface Booking {
  id: string
  roomId: string
  userId: string
  startTime: Date
  endTime: Date
  description: string
}

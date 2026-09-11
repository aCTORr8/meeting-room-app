import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import type { Room } from '../../types'

const roomsCollection = collection(db, 'rooms')

export async function createRoom(data: Omit<Room, 'id'>): Promise<Room> {
  const roomDocument = await addDoc(roomsCollection, data)

  return {
    id: roomDocument.id,
    ...data,
  }
}

export async function updateRoom(
  roomId: string,
  data: Partial<Room>,
): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomId), data)
}

export async function deleteRoom(roomId: string): Promise<void> {
  await deleteDoc(doc(db, 'rooms', roomId))
}

export async function getRooms(): Promise<Room[]> {
  const snapshot = await getDocs(roomsCollection)

  return snapshot.docs.map((roomDocument) => ({
    id: roomDocument.id,
    ...(roomDocument.data() as Omit<Room, 'id'>),
  }))
}

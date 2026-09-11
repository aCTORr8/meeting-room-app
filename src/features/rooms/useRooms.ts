import { useCallback, useEffect, useState } from 'react'
import type { Room, RoomRole } from '../../types'
import {
  createRoom,
  deleteRoom,
  getRooms,
  updateRoom,
} from './roomService'
import type { RoomFormValues } from './roomTypes'

export function useRooms(currentUserId?: string) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshRooms = useCallback(async () => {
    setError('')

    try {
      setRooms(await getRooms())
    } catch {
      setError('Unable to load meeting rooms.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshRooms()
  }, [refreshRooms])

  const saveRoom = async (
    values: RoomFormValues,
    roomToEdit: Room | null,
  ): Promise<boolean> => {
    if (!currentUserId) {
      setError('You must be signed in to manage rooms.')
      return false
    }

    setError('')

    try {
      if (roomToEdit) {
        await updateRoom(roomToEdit.id, values)
      } else {
        await createRoom({
          ...values,
          allowedUsers: [],
          ownerId: currentUserId,
        })
      }

      await refreshRooms()
      return true
    } catch {
      setError(
        roomToEdit
          ? 'Unable to update the meeting room.'
          : 'Unable to create the meeting room.',
      )
      return false
    }
  }

  const removeRoom = async (roomId: string) => {
    setError('')

    try {
      await deleteRoom(roomId)
      await refreshRooms()
    } catch {
      setError('Unable to delete the meeting room.')
    }
  }

  const updateRoomAccess = async (
    roomId: string,
    allowedUsers: RoomRole[],
  ) => {
    await updateRoom(roomId, { allowedUsers })
    setRooms((currentRooms) =>
      currentRooms.map((room) =>
        room.id === roomId ? { ...room, allowedUsers } : room,
      ),
    )
  }

  return {
    clearError: () => setError(''),
    error,
    isLoading,
    removeRoom,
    rooms,
    saveRoom,
    updateRoomAccess,
  }
}

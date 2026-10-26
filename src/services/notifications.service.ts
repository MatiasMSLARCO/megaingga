import type { AppNotification, NotificationType } from '@/types/notification.types'
import { delay } from './delay'
import { getNotifications, markAllNotificationsRead, markNotificationRead, pushNotification } from './portalStore'

export async function getNotificationsList(): Promise<AppNotification[]> {
  await delay()
  return [...getNotifications()].sort((a, b) => (a.ts < b.ts ? 1 : -1))
}

export async function readNotification(id: string): Promise<void> {
  await delay(100)
  markNotificationRead(id)
}

export async function readAllNotifications(): Promise<void> {
  await delay(100)
  markAllNotificationsRead()
}

export async function createNotification(type: NotificationType, title: string, text: string): Promise<AppNotification> {
  await delay(100)
  return pushNotification(type, title, text)
}

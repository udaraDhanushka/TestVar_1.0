import { ActionTypes, User } from "@prisma/client"
import { prisma } from "../prisma"

export type LogActivityProps = {
  actorId: number,
  action: string,
  actionType: ActionTypes,
}

export async function logActivity({ actorId, action, actionType }: LogActivityProps) {
  await prisma.activityLog.create({
    data: {
      actorId,
      action,
      actionType
    }
  })
}

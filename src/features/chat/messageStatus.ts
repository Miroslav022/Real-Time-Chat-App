export const MESSAGE_STATUS = {
  SENT: 1,
  DELIVERED: 2,
  SEEN: 3,
} as const;

export const MessageType = {
  Text: 1,
  Image: 2,
} as const;

type RawStatus = number | string | undefined | null;

export type MessageStatusEntry = {
  messageId?: number;
  userId: number;
  userName?: string;
  status: RawStatus;
  statusChangedAt?: string;
};

export type ChatMessage = {
  id: number;
  senderId?: number;
  senderUserName?: string;
  createdAt?: string;
  messageStatuses?: MessageStatusEntry[];
  [key: string]: unknown;
};

type MessageStatusPayload = {
  messageId?: number;
  conversationId?: number;
  userId?: number;
  status?: RawStatus;
  statusChangedAt?: string;
  timestamp?: string;
};

const STATUS_BY_NAME: Record<string, number> = {
  sent: MESSAGE_STATUS.SENT,
  delivered: MESSAGE_STATUS.DELIVERED,
  seen: MESSAGE_STATUS.SEEN,
};

export function normalizeStatus(status: RawStatus): number {
  if (typeof status === "number") {
    if (status >= MESSAGE_STATUS.SEEN) return MESSAGE_STATUS.SEEN;
    if (status >= MESSAGE_STATUS.DELIVERED) return MESSAGE_STATUS.DELIVERED;
    return MESSAGE_STATUS.SENT;
  }

  if (typeof status === "string") {
    return STATUS_BY_NAME[status.toLowerCase()] ?? MESSAGE_STATUS.SENT;
  }

  return MESSAGE_STATUS.SENT;
}

export function mergeMessageStatuses(
  existing: MessageStatusEntry[] = [],
  incoming: MessageStatusEntry[] = [],
): MessageStatusEntry[] {
  const merged = new Map<number, MessageStatusEntry>();

  existing.forEach((item) => {
    if (!item || item.userId == null) return;
    merged.set(item.userId, {
      ...item,
      status: normalizeStatus(item.status),
    });
  });

  incoming.forEach((item) => {
    if (!item || item.userId == null) return;

    const nextEntry: MessageStatusEntry = {
      ...item,
      status: normalizeStatus(item.status),
    };

    const currentEntry = merged.get(item.userId);
    if (!currentEntry) {
      merged.set(item.userId, nextEntry);
      return;
    }

    const nextDate = new Date(nextEntry.statusChangedAt ?? 0).getTime();
    const currentDate = new Date(currentEntry.statusChangedAt ?? 0).getTime();

    if (
      nextDate >= currentDate ||
      Number(nextEntry.status) >= Number(currentEntry.status)
    ) {
      merged.set(item.userId, {
        ...currentEntry,
        ...nextEntry,
      });
    }
  });

  return Array.from(merged.values());
}

export function applyMessageStatusUpdate(
  messages: ChatMessage[],
  payload: MessageStatusPayload,
): ChatMessage[] {
  if (
    !Array.isArray(messages) ||
    !payload?.messageId ||
    payload.userId == null
  ) {
    return messages;
  }

  return messages.map((message) => {
    if (Number(message.id) !== Number(payload.messageId)) return message;

    const statuses = Array.isArray(message.messageStatuses)
      ? message.messageStatuses
      : [];

    const nextStatus: MessageStatusEntry = {
      messageId: Number(payload.messageId),
      userId: Number(payload.userId),
      status: normalizeStatus(payload.status),
      statusChangedAt: payload.statusChangedAt,
    };

    return {
      ...message,
      messageStatuses: mergeMessageStatuses(statuses, [nextStatus]),
    };
  });
}

export function applyConversationStatusUpdate(
  messages: ChatMessage[],
  payload: MessageStatusPayload,
  currentUserId?: number | string,
): ChatMessage[] {
  if (!Array.isArray(messages) || payload?.userId == null) return messages;

  return messages.map((message) => {
    if (Number(message.senderId) !== Number(currentUserId)) return message;

    const statuses = Array.isArray(message.messageStatuses)
      ? message.messageStatuses
      : [];

    const nextStatus: MessageStatusEntry = {
      messageId: Number(message.id),
      userId: Number(payload.userId),
      status: normalizeStatus(payload.status),
      statusChangedAt: payload.statusChangedAt ?? payload.timestamp,
    };

    return {
      ...message,
      messageStatuses: mergeMessageStatuses(statuses, [nextStatus]),
    };
  });
}

export function upsertMessage(
  messages: ChatMessage[],
  incomingMessage: ChatMessage,
): ChatMessage[] {
  if (!incomingMessage?.id) return messages;

  const existingMessages = Array.isArray(messages) ? messages : [];
  const targetIndex = existingMessages.findIndex(
    (message) => Number(message.id) === Number(incomingMessage.id),
  );

  if (targetIndex === -1) {
    const nextList = [...existingMessages, incomingMessage];
    return nextList.sort(
      (a, b) =>
        new Date(String(a.createdAt ?? 0)).getTime() -
        new Date(String(b.createdAt ?? 0)).getTime(),
    );
  }

  return existingMessages.map((message, index) => {
    if (index !== targetIndex) return message;

    return {
      ...message,
      ...incomingMessage,
      messageStatuses: mergeMessageStatuses(
        message.messageStatuses,
        incomingMessage.messageStatuses,
      ),
    };
  });
}

export function getOutboundStatusInfo(
  message: ChatMessage,
  currentUserId?: number | string,
  recipientsCount = 1,
): {
  icon: string;
  className: string;
  label: string;
  seenCount: number;
  totalRecipients: number;
} | null {
  if (Number(message?.senderId) !== Number(currentUserId)) return null;

  const statuses = Array.isArray(message?.messageStatuses)
    ? message.messageStatuses
    : [];

  const recipientsStatuses = statuses.filter(
    (status) => Number(status.userId) !== Number(currentUserId),
  );

  const knownRecipients = new Set(
    recipientsStatuses.map((status) => status.userId),
  ).size;
  const totalRecipients = Math.max(recipientsCount || 0, knownRecipients, 1);

  const deliveredCount = recipientsStatuses.filter(
    (status) => normalizeStatus(status.status) >= MESSAGE_STATUS.DELIVERED,
  ).length;

  const seenCount = recipientsStatuses.filter(
    (status) => normalizeStatus(status.status) >= MESSAGE_STATUS.SEEN,
  ).length;

  const isSeen = totalRecipients > 0 && seenCount >= totalRecipients;
  const isDelivered = deliveredCount > 0;

  if (isSeen) {
    return {
      icon: "✓✓",
      className: "text-myBlue",
      label: "Seen",
      seenCount,
      totalRecipients,
    };
  }

  if (isDelivered) {
    return {
      icon: "✓✓",
      className: "text-myBgDark/85",
      label: "Delivered",
      seenCount,
      totalRecipients,
    };
  }

  return {
    icon: "✓",
    className: "text-myBgDark/70",
    label: "Sent",
    seenCount,
    totalRecipients,
  };
}

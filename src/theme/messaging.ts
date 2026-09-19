import { appColors } from './clientApp';

/** Shared client-tab palette plus the tokens only the messaging flow needs. */
export const messagingColors = {
  ...appColors,
  /** Conversation rows sit on a translucent wash over the surface. */
  row: 'rgba(216, 199, 173, 0.2)',
  online: '#09C26F',
  bubbleIncoming: '#FAF4EC',
  bubbleOutgoing: '#0F6743',
  bubbleIncomingText: '#4A3A2C',
  bubbleIncomingTime: '#8B6B4D',
  bubbleOutgoingText: '#FAF6F2',
  bubbleOutgoingTime: 'rgba(250, 244, 236, 0.75)',
  composer: '#D8C7AD',
  composerDivider: '#F5F5F5',
  sendButton: '#F5EDE2',
  receipt: '#09C26F',
} as const;

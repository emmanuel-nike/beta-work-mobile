import type { ImageSourcePropType } from 'react-native';

/** Delivery state for messages the client sent; drives the receipt ticks. */
export type MessageStatus = 'sent' | 'delivered' | 'read';

export type ChatMessage = Readonly<{
  id: string;
  body: string;
  time: string;
  /** True when the signed-in client sent it (green, right aligned). */
  outgoing: boolean;
  status?: MessageStatus;
}>;

export type Conversation = Readonly<{
  id: string;
  name: string;
  trade: string;
  avatar: ImageSourcePropType;
  preview: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  /** Shows a receipt tick beside the preview when the last message was ours. */
  previewFromMe: boolean;
  previewStatus?: MessageStatus;
  messages: readonly ChatMessage[];
}>;

const PLUMBER = require('../../assets/images/dashboard/image0_1174_145674.png');
const STYLIST = require('../../assets/images/dashboard/image1_1174_145674.png');
const NAIL_TECH = require('../../assets/images/dashboard/image2_1174_145674.png');

const PLUMBER_THREAD: readonly ChatMessage[] = [
  {
    id: 'm1',
    body: 'Hello, are you available?',
    time: '4:56 pm',
    outgoing: false,
  },
  {
    id: 'm2',
    body: 'Hi, yes please',
    time: '4:56 pm',
    outgoing: true,
    status: 'read',
  },
  {
    id: 'm3',
    body: 'Are you still coming around?',
    time: '4:56 pm',
    outgoing: true,
    status: 'read',
  },
  {
    id: 'm4',
    body: 'Yes, I will give you a call soon',
    time: '4:56 pm',
    outgoing: false,
  },
  {
    id: 'm5',
    body: 'Alright, sounds good!',
    time: '4:56 pm',
    outgoing: true,
    status: 'read',
  },
  {
    id: 'm6',
    body: 'I will be expecting you',
    time: '4:56 pm',
    outgoing: true,
    status: 'read',
  },
  {
    id: 'm7',
    body: "Please I'm around.",
    time: '4:56 pm',
    outgoing: false,
  },
  {
    id: 'm8',
    body: "Okay, I'm coming",
    time: '4:56 pm',
    outgoing: true,
    status: 'read',
  },
  {
    id: 'm9',
    body: "Okay, I'm waiting",
    time: '4:56 pm',
    outgoing: false,
  },
];

const STYLIST_THREAD: readonly ChatMessage[] = [
  {
    id: 's1',
    body: 'Good morning! Are we still on for Saturday?',
    time: '4:28 pm',
    outgoing: true,
    status: 'delivered',
  },
  {
    id: 's2',
    body: 'Good morning. Yes, 11am works for me.',
    time: '4:29 pm',
    outgoing: false,
  },
  {
    id: 's3',
    body: 'Are you available this evening?',
    time: '4:30 pm',
    outgoing: false,
  },
];

const NAIL_THREAD: readonly ChatMessage[] = [
  {
    id: 'n1',
    body: 'Hi, I would like to book a refill.',
    time: '11:02 am',
    outgoing: true,
    status: 'read',
  },
  {
    id: 'n2',
    body: 'Sure, send me a picture of the design.',
    time: '11:10 am',
    outgoing: false,
  },
  {
    id: 'n3',
    body: 'Are you available this evening?',
    time: '11:15 am',
    outgoing: true,
    status: 'read',
  },
];

export const CONVERSATIONS: readonly Conversation[] = [
  {
    id: 'cv-1',
    name: 'Tunde Ehinde',
    trade: 'Plumber',
    avatar: PLUMBER,
    preview: 'Are you available this evening?...',
    timestamp: '6:30 PM',
    unreadCount: 0,
    isOnline: true,
    previewFromMe: false,
    messages: PLUMBER_THREAD,
  },
  {
    id: 'cv-2',
    name: 'Mariam Suleiman',
    trade: 'Makeup artist',
    avatar: STYLIST,
    preview: 'Are you available this evening?...',
    timestamp: '4:30 PM',
    unreadCount: 1,
    isOnline: false,
    previewFromMe: false,
    messages: STYLIST_THREAD,
  },
  {
    id: 'cv-3',
    name: 'Favour Sang',
    trade: 'Nail technician',
    avatar: NAIL_TECH,
    preview: 'Are you available this evening?...',
    timestamp: '12/10/25',
    unreadCount: 0,
    isOnline: true,
    previewFromMe: true,
    previewStatus: 'read',
    messages: NAIL_THREAD,
  },
];

export function findConversation(id: string): Conversation | undefined {
  return CONVERSATIONS.find(conversation => conversation.id === id);
}

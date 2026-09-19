import { StyleSheet, Text, View } from 'react-native';

import type { ChatMessage } from '../../data/messages';
import { messagingColors } from '../../theme/messaging';
import { DoubleCheckIcon } from '../icons';

type MessageBubbleProps = Readonly<{
  message: ChatMessage;
}>;

export function MessageBubble({ message }: MessageBubbleProps) {
  const { outgoing } = message;

  return (
    <View style={[styles.wrapper, outgoing ? styles.alignEnd : styles.alignStart]}>
      <View style={[styles.bubble, outgoing ? styles.outgoing : styles.incoming]}>
        <Text style={outgoing ? styles.outgoingText : styles.incomingText}>
          {message.body}
        </Text>
        <View style={styles.footer}>
          <Text style={outgoing ? styles.outgoingTime : styles.incomingTime}>
            {message.time}
          </Text>
          {outgoing ? (
            <DoubleCheckIcon
              color={
                message.status === 'read'
                  ? messagingColors.receipt
                  : messagingColors.bubbleOutgoingTime
              }
              size={13}
            />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  alignStart: {
    justifyContent: 'flex-start',
  },
  alignEnd: {
    justifyContent: 'flex-end',
  },
  bubble: {
    borderRadius: 12,
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  incoming: {
    backgroundColor: messagingColors.bubbleIncoming,
  },
  outgoing: {
    backgroundColor: messagingColors.bubbleOutgoing,
  },
  incomingText: {
    color: messagingColors.bubbleIncomingText,
    fontSize: 13,
    lineHeight: 18,
  },
  outgoingText: {
    color: messagingColors.bubbleOutgoingText,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  incomingTime: {
    color: messagingColors.bubbleIncomingTime,
    fontSize: 9,
    lineHeight: 13,
  },
  outgoingTime: {
    color: messagingColors.bubbleOutgoingTime,
    fontSize: 9,
    lineHeight: 13,
  },
});

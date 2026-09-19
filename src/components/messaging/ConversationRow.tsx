import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Conversation } from '../../data/messages';
import { messagingColors } from '../../theme/messaging';
import { DoubleCheckIcon } from '../icons';

const AVATAR_SIZE = 48;

type ConversationRowProps = Readonly<{
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
}>;

export function ConversationRow({
  conversation,
  onPress,
}: ConversationRowProps) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(conversation)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View>
        <Image source={conversation.avatar} style={styles.avatar} />
        {conversation.isOnline ? <View style={styles.onlineDot} /> : null}
      </View>

      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.name}>
          {conversation.name}
        </Text>
        <View style={styles.previewRow}>
          {conversation.previewFromMe ? (
            <DoubleCheckIcon
              color={
                conversation.previewStatus === 'read'
                  ? messagingColors.receipt
                  : messagingColors.textFaint
              }
            />
          ) : null}
          <Text numberOfLines={1} style={styles.preview}>
            {conversation.preview}
          </Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.timestamp}>{conversation.timestamp}</Text>
        {hasUnread ? (
          <View style={styles.unread}>
            <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: messagingColors.row,
    flexDirection: 'row',
    gap: 12,
    height: 72,
    paddingHorizontal: 24,
  },
  pressed: {
    opacity: 0.7,
  },
  avatar: {
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
  },
  onlineDot: {
    backgroundColor: messagingColors.online,
    borderColor: messagingColors.white,
    borderRadius: 6,
    borderWidth: 1.5,
    bottom: 2,
    height: 12,
    position: 'absolute',
    right: 2,
    width: 12,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: messagingColors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  previewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  preview: {
    color: messagingColors.textLabel,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 6,
    minHeight: 46,
  },
  timestamp: {
    color: messagingColors.textLabel,
    fontSize: 11,
    lineHeight: 15,
  },
  unread: {
    alignItems: 'center',
    backgroundColor: messagingColors.primary,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 5,
  },
  unreadCount: {
    color: messagingColors.white,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
});

import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { messagingColors } from '../../theme/messaging';
import {
  EmojiIcon,
  MicIcon,
  PlusCircleIcon,
  SendIcon,
  StickerIcon,
} from '../icons';

const ATTACHMENTS = [PlusCircleIcon, MicIcon, EmojiIcon, StickerIcon];

type ChatComposerProps = Readonly<{
  onSend: (body: string) => void;
}>;

export function ChatComposer({ onSend }: ChatComposerProps) {
  const [draft, setDraft] = useState('');

  const handleSend = () => {
    const body = draft.trim();
    if (body.length === 0) {
      return;
    }

    onSend(body);
    setDraft('');
  };

  return (
    <View style={styles.composer}>
      <TextInput
        multiline
        onChangeText={setDraft}
        onSubmitEditing={handleSend}
        placeholder="Type your message..."
        placeholderTextColor={messagingColors.primary}
        style={styles.input}
        value={draft}
      />

      <View style={styles.divider} />

      <View style={styles.actions}>
        <View style={styles.attachments}>
          {ATTACHMENTS.map((Icon, index) => (
            <Pressable
              key={index}
              accessibilityRole="button"
              hitSlop={8}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              <Icon />
            </Pressable>
          ))}
        </View>

        <Pressable
          accessibilityLabel="Send message"
          accessibilityRole="button"
          onPress={handleSend}
          style={({ pressed }) => [styles.send, pressed && styles.pressed]}
        >
          <SendIcon />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    backgroundColor: messagingColors.composer,
  },
  input: {
    color: messagingColors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    maxHeight: 96,
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
  divider: {
    backgroundColor: messagingColors.composerDivider,
    height: 1,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  attachments: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  send: {
    alignItems: 'center',
    backgroundColor: messagingColors.sendButton,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  pressed: {
    opacity: 0.7,
  },
});

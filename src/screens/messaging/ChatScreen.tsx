import { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatComposer } from '../../components/messaging/ChatComposer';
import { MessageBubble } from '../../components/messaging/MessageBubble';
import { ArrowLeftIcon } from '../../components/icons';
import { findConversation, type ChatMessage } from '../../data/messages';
import { messagingColors } from '../../theme/messaging';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/types';

export function ChatScreen({
  navigation,
  route,
}: NativeStackScreenProps<AuthStackParamList, 'Chat'>) {
  const insets = useSafeAreaInsets();
  const conversation = findConversation(route.params.conversationId);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const [messages, setMessages] = useState<readonly ChatMessage[]>(
    conversation?.messages ?? [],
  );

  const handleSend = useCallback((body: string) => {
    setMessages(current => [
      ...current,
      {
        id: `local-${Date.now()}`,
        body,
        time: new Date().toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        }),
        outgoing: true,
        status: 'sent',
      },
    ]);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.root}
    >
      <StatusBar
        backgroundColor={messagingColors.header}
        barStyle="light-content"
      />

      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={navigation.goBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <ArrowLeftIcon />
        </Pressable>

        <View style={styles.headerIdentity}>
          {conversation ? (
            <Image source={conversation.avatar} style={styles.headerAvatar} />
          ) : null}
          <View style={styles.headerCopy}>
            <Text numberOfLines={1} style={styles.headerName}>
              {conversation?.name ?? 'Conversation'}
            </Text>
            {conversation ? (
              <Text numberOfLines={1} style={styles.headerTrade}>
                {conversation.trade}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.messages}
        data={messages}
        keyExtractor={message => message.id}
        onContentSizeChange={() =>
          listRef.current?.scrollToEnd({ animated: false })
        }
        ref={listRef}
        renderItem={({ item }) => <MessageBubble message={item} />}
        showsVerticalScrollIndicator={false}
      />

      <View style={{ paddingBottom: insets.bottom }}>
        <ChatComposer onSend={handleSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: messagingColors.surface,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: messagingColors.header,
    flexDirection: 'row',
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: messagingColors.headerButton,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerIdentity: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    marginLeft: 20,
  },
  headerAvatar: {
    borderRadius: 17,
    height: 34,
    width: 34,
  },
  headerCopy: {
    flex: 1,
  },
  headerName: {
    color: messagingColors.white,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  headerTrade: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    lineHeight: 16,
  },
  messages: {
    gap: 9,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  pressed: {
    opacity: 0.7,
  },
});

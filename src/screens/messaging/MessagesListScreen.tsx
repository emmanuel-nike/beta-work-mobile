import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MessagesEmptyArtwork from '../../../assets/images/messages-empty.svg';
import { BookingButton } from '../../components/bookings/BookingButton';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { ConversationRow } from '../../components/messaging/ConversationRow';
import { CONVERSATIONS, type Conversation } from '../../data/messages';
import {
  useAuthNavigation,
  useClientTabNavigation,
} from '../../navigation/types';
import { messagingColors } from '../../theme/messaging';

export function MessagesListScreen() {
  const insets = useSafeAreaInsets();
  const authNavigation = useAuthNavigation();
  const tabNavigation = useClientTabNavigation();

  const openChat = (conversation: Conversation) =>
    authNavigation.navigate('Chat', { conversationId: conversation.id });

  return (
    <View style={styles.root}>
      <BookingsHeader title="Messages" />

      {CONVERSATIONS.length === 0 ? (
        <EmptyState onReviewRequests={() => tabNavigation.navigate('bookings')} />
      ) : (
        <FlatList
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          data={CONVERSATIONS}
          keyExtractor={conversation => conversation.id}
          renderItem={({ item }) => (
            <ConversationRow conversation={item} onPress={openChat} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function EmptyState({
  onReviewRequests,
}: Readonly<{ onReviewRequests: () => void }>) {
  return (
    <View style={styles.empty}>
      <MessagesEmptyArtwork height={280} width={280} />
      <Text style={styles.emptyTitle}>No conversations yet.</Text>
      <Text style={styles.emptyBody}>
        Accept a job request to start chatting with your client
      </Text>
      <BookingButton onPress={onReviewRequests} style={styles.emptyButton}>
        Review job requests
      </BookingButton>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: messagingColors.surface,
    flex: 1,
  },
  listContent: {
    gap: 8,
    paddingTop: 16,
  },
  empty: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 42,
  },
  emptyTitle: {
    color: messagingColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginTop: 20,
  },
  emptyBody: {
    color: messagingColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 28,
  },
});

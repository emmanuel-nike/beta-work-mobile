import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingButton } from '../../components/bookings/BookingButton';
import { StatusTimeline } from '../../components/bookings/StatusTimeline';
import { SuccessModal } from '../../components/bookings/SuccessModal';
import {
  ArrowLeftIcon,
  CalendarIcon,
  InfoIcon,
  MapPinIcon,
  StarIcon,
} from '../../components/icons';
import {
  findBooking,
  type Booking,
  type BookingStatus,
  type TimelineState,
  type TimelineStep,
} from '../../data/bookings';
import { CONVERSATIONS } from '../../data/messages';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  completeMyBooking,
  selectBookingById,
} from '../../store/slices/bookingsSlice';
import { bookingColors } from '../../theme/bookings';
import type { AuthStackScreenProps } from '../../navigation/types';

const PAGE = '#F7F1E6';
const CARD = '#FCF7EC';
const LINE = '#DDD0BC';
const HEADING = '#1F1611';
const BODY = '#3D2E22';
const MUTED = '#736051';
const ACCENT = '#0F6743';

const SOFT_BADGE: Record<BookingStatus, { background: string; text: string }> =
  {
    pending: { background: '#F8E7C4', text: '#8C6A22' },
    accepted: { background: '#E5F6EC', text: '#0F6743' },
    ongoing: { background: '#E3F0FB', text: '#3B6EA5' },
    completed: { background: '#E5F6EC', text: '#0F6743' },
    cancelled: { background: '#F3E4D4', text: '#8A5E3B' },
  };

export function BookingDetailsScreen({
  navigation,
  route,
}: AuthStackScreenProps<'BookingDetails'>) {
  const insets = useSafeAreaInsets();
  // Prefer the API-backed booking from the store; fall back to local data.
  const storedBooking = useAppSelector(state =>
    selectBookingById(state, route.params.bookingId),
  );
  const booking = storedBooking ?? findBooking(route.params.bookingId);
  const dispatch = useAppDispatch();
  const [cancelled, setCancelled] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);

  if (!booking) {
    return (
      <View style={styles.root}>
        <DetailHeader onBack={navigation.goBack} />
        <View style={styles.missing}>
          <Text style={styles.missingText}>
            This booking is no longer available.
          </Text>
        </View>
      </View>
    );
  }

  const canEdit = booking.status === 'pending';
  const canMessage = booking.status !== 'pending';

  function openBookingForm(editing: boolean) {
    if (booking?.artisanId) {
      navigation.navigate('BookService', {
        artisanId: booking.artisanId,
        // Editing reopens this booking prefilled; "book again" starts fresh.
        ...(editing ? { bookingId: booking.id } : {}),
      });
      return;
    }
    navigation.navigate('AllArtisans', { query: booking?.trade });
  }

  function openChat() {
    const conversation = CONVERSATIONS.find(
      item => item.name === booking?.artisanName,
    );
    if (conversation) {
      navigation.navigate('Chat', { conversationId: conversation.id });
    }
  }

  async function markCompleted() {
    if (!booking || completing) {
      return;
    }
    setCompleting(true);
    setCompleteError(null);
    const result = await dispatch(completeMyBooking(booking.id));
    setCompleting(false);
    if (completeMyBooking.rejected.match(result)) {
      setCompleteError(
        result.payload ?? 'Unable to mark this booking as completed.',
      );
      return;
    }
    setCompleted(true);
  }

  return (
    <View style={styles.root}>
      <DetailHeader onBack={navigation.goBack} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ArtisanCard
          booking={booking}
          canEdit={canEdit}
          canMessage={canMessage}
          onEdit={() => openBookingForm(true)}
          onMessage={openChat}
        />

        <View style={styles.dividerLine} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking details</Text>
          <View style={styles.detailList}>
            <DetailRow label="Service" value={booking.service} />
            <DetailRow label="Job description" value={booking.jobDescription} />
            <DetailRow label="Date & Time" value={booking.dateTime} />
            <DetailRow label="Service location" value={booking.address} />
            <DetailRow label="Budget" value={booking.budget} />
            <DetailRow
              label="Message to artisan"
              value={booking.messageToArtisan}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status timeline</Text>
          <StatusTimeline steps={presentTimeline(booking)} />
        </View>

        {booking.status === 'pending' ? (
          <View style={styles.notice}>
            <InfoIcon />
            <Text style={styles.noticeText}>
              You'll be notified once the artisan accepts your request.
            </Text>
          </View>
        ) : null}

        {booking.cancellation ? (
          <View style={styles.noticeDanger}>
            <InfoIcon color={bookingColors.danger} />
            <View style={styles.noticeBody}>
              <Text style={styles.noticeDangerTitle}>
                Job cancelled by {booking.cancellation.cancelledBy}
              </Text>
              <Text style={styles.noticeDangerText}>
                Reason: {booking.cancellation.reason}
              </Text>
              <Text style={styles.noticeDangerText}>
                Date cancelled: {booking.cancellation.cancelledAt}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        {completeError ? (
          <Text style={styles.footerError}>{completeError}</Text>
        ) : null}
        <BookingActions
          booking={booking}
          completing={completing}
          onBookAgain={() => openBookingForm(false)}
          onCancel={() => setCancelled(true)}
          onComplete={markCompleted}
          onDispute={() =>
            navigation.navigate('RaiseDispute', { bookingId: booking.id })
          }
          onReview={() =>
            navigation.navigate('LeaveFeedback', { bookingId: booking.id })
          }
        />
      </View>

      <SuccessModal
        message="The artisan has been notified that you cancelled this request."
        onClose={() => {
          setCancelled(false);
          navigation.goBack();
        }}
        title="Booking cancelled"
        visible={cancelled}
      />

      <SuccessModal
        message="Thanks for confirming. This job is now marked as completed."
        onClose={() => setCompleted(false)}
        title="Job completed"
        visible={completed}
      />
    </View>
  );
}

type BookingActionsProps = Readonly<{
  booking: Booking;
  completing: boolean;
  onBookAgain: () => void;
  onCancel: () => void;
  onComplete: () => void;
  onDispute: () => void;
  onReview: () => void;
}>;

function BookingActions({
  booking,
  completing,
  onBookAgain,
  onCancel,
  onComplete,
  onDispute,
  onReview,
}: BookingActionsProps) {
  // Edit lives on the artisan card and only while the request is still pending.
  // A dispute is available once the artisan has accepted, until the job ends.
  // A review is available only after the job is completed.
  const canDispute =
    booking.status === 'accepted' || booking.status === 'ongoing';
  const canReview = booking.status === 'completed';

  return (
    <>
      {booking.status === 'pending' ? (
        <BookingButton
          onPress={onCancel}
          style={styles.footerButton}
          variant="outlined"
        >
          Cancel booking
        </BookingButton>
      ) : null}

      {booking.status === 'accepted' || booking.status === 'ongoing' ? (
        <BookingButton
          disabled={
            completing ||
            (booking.status === 'ongoing' && !booking.awaitingConfirmation)
          }
          onPress={onComplete}
          style={styles.footerButton}
        >
          {completing ? 'Marking as completed…' : 'Mark as completed'}
        </BookingButton>
      ) : null}

      {canDispute ? (
        <BookingButton
          onPress={onDispute}
          style={styles.footerButton}
          variant="warning"
        >
          Raise a dispute
        </BookingButton>
      ) : null}

      {booking.status === 'completed' ? (
        <BookingButton onPress={onBookAgain} style={styles.footerButton}>
          Book again
        </BookingButton>
      ) : null}

      {canReview ? (
        <BookingButton
          onPress={onReview}
          style={styles.footerButton}
          variant="outlined"
        >
          Leave a review
        </BookingButton>
      ) : null}

      {booking.status === 'cancelled' ? (
        <BookingButton
          onPress={onBookAgain}
          style={styles.footerButton}
          variant="outlined"
        >
          Book again
        </BookingButton>
      ) : null}
    </>
  );
}

function ArtisanCard({
  booking,
  canEdit,
  canMessage,
  onEdit,
  onMessage,
}: Readonly<{
  booking: Booking;
  canEdit: boolean;
  canMessage: boolean;
  onEdit: () => void;
  onMessage: () => void;
}>) {
  const badge = SOFT_BADGE[booking.status];

  return (
    <View style={styles.artisanBlock}>
      <View style={styles.card}>
        <View style={styles.artisanTop}>
          <Image source={booking.avatar} style={styles.avatar} />
          <View style={styles.artisanIdentity}>
            <View style={styles.artisanNameRow}>
              <Text numberOfLines={1} style={styles.artisanName}>
                {booking.artisanName}
              </Text>
              <View
                style={[styles.badge, { backgroundColor: badge.background }]}
              >
                <Text style={[styles.badgeLabel, { color: badge.text }]}>
                  {statusLabel(booking.status)}
                </Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <Text style={styles.artisanTrade}>{booking.trade}</Text>
              <StarIcon size={13} />
              <Text style={styles.rating}>
                {booking.rating} ({booking.reviewCount})
              </Text>
            </View>
            <Text style={styles.serviceLine}>{booking.service}</Text>
            <View style={styles.metaList}>
              <View style={styles.metaRow}>
                <CalendarIcon color={MUTED} size={14} />
                <Text style={styles.metaText}>{booking.dateTime}</Text>
              </View>
              <View style={styles.metaRow}>
                <MapPinIcon color={ACCENT} size={14} />
                <Text style={styles.metaText}>{booking.location}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {canEdit ? (
        <View style={styles.actionRow}>
          <BookingButton
            compact
            disabled
            onPress={() => {}}
            style={styles.halfButton}
            variant="outlined"
          >
            Message artisan
          </BookingButton>
          <BookingButton compact onPress={onEdit} style={styles.halfButton}>
            Edit request
          </BookingButton>
        </View>
      ) : (
        <BookingButton
          compact
          disabled={!canMessage}
          onPress={onMessage}
          variant="outlined"
        >
          Message artisan
        </BookingButton>
      )}
    </View>
  );
}

function DetailHeader({ onBack }: Readonly<{ onBack: () => void }>) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
      <StatusBar backgroundColor={PAGE} barStyle="dark-content" />
      <Pressable
        accessibilityLabel="Go back"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onBack}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <ArrowLeftIcon color={BODY} />
      </Pressable>
      <Text style={styles.headerTitle}>Booking details</Text>
      <View style={styles.headerSpacer} />
    </View>
  );
}

function DetailRow({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value || '—'}</Text>
    </View>
  );
}

function statusLabel(status: BookingStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'accepted':
      return 'Accepted';
    case 'ongoing':
      return 'Ongoing';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
  }
}

function presentTimeline(booking: Booking): readonly TimelineStep[] {
  const firstName = booking.artisanName.split(' ')[0] || 'the artisan';
  const accepted = booking.timeline.find(step => step.id === 'job-accepted');
  const scheduledState = scheduledStepState(accepted);

  return booking.timeline.flatMap(step => {
    const described = {
      ...step,
      label: step.state === 'cancelled' ? 'Job cancelled' : step.label,
      detail: stepDetail(step, firstName, booking.dateTime),
    };
    if (step.id !== 'job-accepted') {
      return [described];
    }
    const stamped = scheduledState === 'done';
    const scheduled: TimelineStep = {
      id: 'job-scheduled',
      label: 'Job scheduled',
      state: scheduledState,
      detail: `Scheduled for ${booking.dateTime || 'the chosen time'}`,
      date: stamped ? accepted?.date : undefined,
      time: stamped ? accepted?.time : undefined,
    };
    return [described, scheduled];
  });
}

function scheduledStepState(accepted: TimelineStep | undefined): TimelineState {
  // Scheduling completes once the artisan accepts; before that it's not reached.
  return accepted?.state === 'done' ? 'done' : 'inactive';
}

function stepDetail(
  step: TimelineStep,
  firstName: string,
  dateTime: string,
): string | undefined {
  if (step.detail) {
    return step.detail;
  }
  switch (step.id) {
    case 'request-sent':
      return `Your booking request has been sent to ${firstName}.`;
    case 'artisan-reviewing':
      return `${firstName} is reviewing your request.`;
    case 'job-accepted':
      return step.state === 'cancelled'
        ? `${firstName} cancelled this booking.`
        : `${firstName} will confirm the booking.`;
    case 'job-scheduled':
      return `Scheduled for ${dateTime}`;
    case 'job-ongoing':
      return 'Work is in progress.';
    case 'job-completed':
      return 'The job will be marked as completed.';
    default:
      return undefined;
  }
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: PAGE,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: PAGE,
    borderBottomColor: LINE,
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 24,
  },
  back: {
    alignItems: 'center',
    backgroundColor: '#EDE4D5',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerSpacer: {
    height: 40,
    width: 40,
  },
  headerTitle: {
    color: HEADING,
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'center',
  },
  content: {
    gap: 24,
    padding: 24,
  },
  missing: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  missingText: {
    color: MUTED,
    fontSize: 14,
  },
  card: {
    backgroundColor: CARD,
    borderColor: LINE,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  artisanBlock: {
    gap: 12,
  },
  artisanTop: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    borderRadius: 8,
    height: 72,
    width: 72,
  },
  artisanIdentity: {
    flex: 1,
    gap: 4,
  },
  artisanNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  artisanName: {
    color: HEADING,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  artisanTrade: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
  rating: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },
  serviceLine: {
    /*color: HEADING,*/
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    color: '#5C3D27',
  },
  metaList: {
    gap: 4,
    marginTop: 2,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  metaText: {
    color: MUTED,
    flexShrink: 1,
    fontSize: 11,
    lineHeight: 15,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfButton: {
    flex: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: HEADING,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  detailList: {
    gap: 16,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    color: HEADING,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  detailValue: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 19,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: LINE,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  noticeText: {
    color: ACCENT,
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  noticeDanger: {
    backgroundColor: '#FFFFFF',
    borderColor: LINE,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  noticeBody: {
    flex: 1,
    gap: 2,
  },
  noticeDangerTitle: {
    color: bookingColors.danger,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  noticeDangerText: {
    color: bookingColors.danger,
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    backgroundColor: PAGE,
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  footerButton: {
    height: 48,
  },
  footerError: {
    color: bookingColors.danger,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  dividerLine: {
    height: 1,
    backgroundColor: LINE,
    marginTop: 6,
  },
});

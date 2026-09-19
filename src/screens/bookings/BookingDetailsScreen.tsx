import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingButton } from '../../components/bookings/BookingButton';
import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import { StatusBadge } from '../../components/bookings/StatusBadge';
import { StatusTimeline } from '../../components/bookings/StatusTimeline';
import { SuccessModal } from '../../components/bookings/SuccessModal';
import { InfoIcon, StarIcon } from '../../components/icons';
import { findBooking, type Booking } from '../../data/bookings';
import { bookingColors } from '../../theme/bookings';
import type { AuthStackScreenProps } from '../../navigation/types';

export function BookingDetailsScreen({
  navigation,
  route,
}: AuthStackScreenProps<'BookingDetails'>) {
  const insets = useSafeAreaInsets();
  const booking = findBooking(route.params.bookingId);
  const [cancelled, setCancelled] = useState(false);

  if (!booking) {
    return (
      <View style={styles.root}>
        <BookingsHeader
          onBack={navigation.goBack}
          title="Booking details"
          variant="detail"
        />
        <View style={styles.missing}>
          <Text style={styles.missingText}>This booking is no longer available.</Text>
        </View>
      </View>
    );
  }

  const isPending = booking.status === 'pending';

  return (
    <View style={styles.root}>
      <BookingsHeader
        onBack={navigation.goBack}
        onMenu={() => {}}
        title="Booking details"
        variant="detail"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ArtisanCard booking={booking} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your booking details</Text>
          <View style={styles.card}>
            <DetailRow label="Services:" value={booking.service} />
            <DetailRow label="Job description" value={booking.jobDescription} />
            <DetailRow label="Date and time" value={booking.dateTime} />
            <DetailRow label="Location" value={booking.address} />
            <DetailRow label="Budget" value={booking.budget} />
            <DetailRow
              label="Message to Artisan"
              last
              value={booking.messageToArtisan}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status info</Text>
          <StatusTimeline steps={booking.timeline} />
        </View>

        {isPending ? (
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
        <BookingActions
          booking={booking}
          onCancel={() => setCancelled(true)}
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
    </View>
  );
}

type BookingActionsProps = Readonly<{
  booking: Booking;
  onCancel: () => void;
  onDispute: () => void;
  onReview: () => void;
}>;

/** Each status exposes a different pair of actions in the design. */
function BookingActions({
  booking,
  onCancel,
  onDispute,
  onReview,
}: BookingActionsProps) {
  switch (booking.status) {
    case 'pending':
    case 'accepted':
      return (
        <>
          <BookingButton onPress={() => {}}>Edit request</BookingButton>
          <BookingButton onPress={onCancel} variant="outlined">
            Cancel booking
          </BookingButton>
        </>
      );
    case 'ongoing':
      return (
        <>
          <BookingButton
            disabled={!booking.awaitingConfirmation}
            onPress={() => {}}
          >
            Mark as completed
          </BookingButton>
          <BookingButton onPress={onDispute} variant="warning">
            Raise a dispute
          </BookingButton>
        </>
      );
    case 'completed':
      return (
        <>
          <BookingButton onPress={() => {}}>Rebook service</BookingButton>
          <BookingButton onPress={onReview} variant="outlined">
            Leave a review
          </BookingButton>
        </>
      );
    case 'cancelled':
      return (
        <>
          <BookingButton onPress={() => {}}>Rebook service</BookingButton>
          <BookingButton onPress={() => {}} variant="outlined">
            Find another artisan
          </BookingButton>
        </>
      );
  }
}

function ArtisanCard({ booking }: Readonly<{ booking: Booking }>) {
  return (
    <View style={styles.card}>
      <View style={styles.artisanTop}>
        <Image source={booking.avatar} style={styles.avatar} />
        <View style={styles.artisanIdentity}>
          <View style={styles.artisanNameRow}>
            <Text numberOfLines={1} style={styles.artisanName}>
              {booking.artisanName}
            </Text>
            <StatusBadge status={booking.status} />
          </View>
          <Text style={styles.artisanTrade}>{booking.tradeFull}</Text>
          <View style={styles.ratingRow}>
            <StarIcon size={13} />
            <Text style={styles.rating}>
              {booking.rating} ({booking.reviewCount} reviews)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metaList}>
        <MetaRow label="Location:" value={booking.address} />
        <MetaRow label="Distance:" value={booking.distance} />
        <MetaRow label="Language:" value={booking.languages} />
      </View>

      <BookingButton
        compact
        disabled={booking.status === 'pending'}
        onPress={() => {}}
      >
        Send message
      </BookingButton>
    </View>
  );
}

function MetaRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <Text style={styles.metaValue}>
      <Text style={styles.metaLabel}>{label} </Text>
      {value}
    </Text>
  );
}

function DetailRow({
  label,
  value,
  last = false,
}: Readonly<{ label: string; value: string; last?: boolean }>) {
  return (
    <View style={[styles.detailRow, !last && styles.detailRowDivided]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: bookingColors.surface,
    flex: 1,
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
    color: bookingColors.textLabel,
    fontSize: 14,
  },
  card: {
    backgroundColor: bookingColors.card,
    borderColor: bookingColors.cardBorder,
    borderRadius: 8,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  artisanTop: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    borderRadius: 4,
    height: 76,
    width: 76,
  },
  artisanIdentity: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  artisanNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  artisanName: {
    color: bookingColors.textPrimary,
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  artisanTrade: {
    color: bookingColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  rating: {
    color: bookingColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
  },
  metaList: {
    gap: 6,
  },
  metaLabel: {
    fontWeight: '700',
  },
  metaValue: {
    color: bookingColors.textLabel,
    fontSize: 11,
    lineHeight: 15,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: bookingColors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  detailRow: {
    gap: 6,
    paddingVertical: 12,
  },
  detailRowDivided: {
    borderBottomColor: bookingColors.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailLabel: {
    color: bookingColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  detailValue: {
    color: bookingColors.textLabel,
    fontSize: 13,
    lineHeight: 19,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: bookingColors.notice,
    borderRadius: 4,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  noticeText: {
    color: bookingColors.textLabel,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  noticeDanger: {
    backgroundColor: bookingColors.noticeDanger,
    borderRadius: 4,
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
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  noticeDangerText: {
    color: bookingColors.danger,
    fontSize: 11,
    lineHeight: 16,
  },
  footer: {
    backgroundColor: bookingColors.surface,
    gap: 16,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});

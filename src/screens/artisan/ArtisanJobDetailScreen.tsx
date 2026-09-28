import { useState, type ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingsHeader } from '../../components/bookings/BookingsHeader';
import {
  ActionSheet,
  type ActionSheetOption,
} from '../../components/common/ActionSheet';
import {
  BuildingIcon,
  CheckCircleIcon,
  CloseIcon,
  InfoIcon,
  MapPinIcon,
  MessageChatIcon,
  PhoneCallIcon,
  ProfileIcon,
} from '../../components/icons';
import {
  JOB_STATUS_CHIP_COLORS,
  JOB_STATUS_COLORS,
  JOB_STATUS_LABELS,
  JOB_STATUS_TEXT_COLORS,
  findJob,
  type ArtisanJobStatus,
} from '../../data/artisanJobs';
import { dashboardColors } from '../../theme/dashboard';
import type { AuthStackScreenProps } from '../../navigation/types';

const CARD = '#F5EDE2';
const DIVIDER = '#F3E2CE';
const LABEL_MUTED = '#9C7E61';
const ACCENT = '#0F6743';
const CONTACT_ICON = '#4A3A2C';
const CONTACT_ICON_WASH = 'rgba(229, 125, 31, 0.1)';

export function ArtisanJobDetailScreen({
  navigation,
  route,
}: AuthStackScreenProps<'ArtisanJobDetail'>) {
  const insets = useSafeAreaInsets();
  const job = findJob(route.params.jobId);
  // The detail flips to the accepted view when the artisan accepts.
  const [status, setStatus] = useState<ArtisanJobStatus | undefined>(
    job?.status,
  );
  const [isMenuOpen, setMenuOpen] = useState(false);

  const acceptBooking = () => {
    setMenuOpen(false);
    setStatus('accepted');
  };
  const declineBooking = () => {
    setMenuOpen(false);
    navigation.goBack();
  };
  const messageClient = () => {
    setMenuOpen(false);
  };

  const menuOptions: readonly ActionSheetOption[] =
    status === 'pending'
      ? [
          {
            id: 'accept',
            label: 'Accept booking',
            Icon: CheckCircleIcon,
            onPress: acceptBooking,
          },
          {
            id: 'decline',
            label: 'Decline booking',
            Icon: CloseIcon,
            destructive: true,
            onPress: declineBooking,
          },
        ]
      : [
          {
            id: 'message',
            label: 'Message Client',
            Icon: MessageChatIcon,
            onPress: messageClient,
          },
        ];

  if (!job || !status) {
    return (
      <View style={styles.root}>
        <BookingsHeader
          onBack={navigation.goBack}
          title="Job details"
          variant="detail"
        />
        <View style={styles.missing}>
          <Text style={styles.missingText}>
            This job is no longer available.
          </Text>
        </View>
      </View>
    );
  }

  const isPending = status === 'pending';

  return (
    <View style={styles.root}>
      <BookingsHeader
        onBack={navigation.goBack}
        onMenu={() => setMenuOpen(true)}
        title="Job details"
        variant="detail"
      />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <Image source={job.avatar} style={styles.avatar} />
            <View style={styles.summaryIdentity}>
              <Text style={styles.trade}>{job.trade}</Text>
              <Text style={styles.clientName}>{job.clientName}</Text>
              <Text style={styles.distance}>{job.distance}</Text>
            </View>
            <StatusBadge status={status} />
          </View>
          <View style={styles.summaryDetails}>
            <SummaryLine label="Date & Time:" value={job.dateTime} />
            <SummaryLine label="Location:" value={job.location} />
            <SummaryLine label="Service:" value={job.service} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Clients details</Text>
          <ContactRow
            icon={<ProfileIcon color={CONTACT_ICON} size={16} />}
            label="Client"
            value={job.client.name}
          />
          <ContactRow
            icon={<MapPinIcon color={CONTACT_ICON} size={16} />}
            label="Address"
            value={job.client.address}
          />
          <ContactRow
            icon={<PhoneCallIcon color={CONTACT_ICON} size={16} />}
            label="Phone"
            value={job.client.phone}
          />
          <ContactRow
            icon={<BuildingIcon color={CONTACT_ICON} size={16} />}
            label="Landmark"
            value={job.client.landmark}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Request details</Text>
          <RequestRow label="Services:" value={job.service} />
          <RequestRow label="Job description" value={job.jobDescription} />
          <RequestRow label="Date and time" value={job.dateTime} />
          <RequestRow label="Location" value={job.location} />
          <RequestRow label="Budget" value={job.budget} />
          <View style={styles.requestRow}>
            <Text style={styles.requestLabel}>Status:</Text>
            <StatusChip status={status} />
          </View>
          <RequestRow
            label="Message to Artisan"
            last
            value={job.messageToArtisan}
          />
        </View>

        <View style={styles.tip}>
          <InfoIcon color={ACCENT} size={16} />
          <Text style={styles.tipText}>
            Tip: Review all job details carefully before accepting. Make sure
            the location and time work for your schedule.
          </Text>
        </View>

        <View style={styles.actions}>
          {isPending ? (
            <>
              <PrimaryButton label="Accept booking" onPress={acceptBooking} />
              <OutlinedButton
                label="Decline booking"
                onPress={declineBooking}
              />
            </>
          ) : (
            <PrimaryButton
              icon={<MessageChatIcon size={18} />}
              label="Message Client"
              onPress={messageClient}
            />
          )}
        </View>
      </ScrollView>

      <ActionSheet
        onClose={() => setMenuOpen(false)}
        options={menuOptions}
        title="Job actions"
        visible={isMenuOpen}
      />
    </View>
  );
}

function StatusBadge({ status }: Readonly<{ status: ArtisanJobStatus }>) {
  return (
    <View
      style={[styles.badge, { backgroundColor: JOB_STATUS_COLORS[status] }]}
    >
      <Text style={styles.badgeLabel}>{JOB_STATUS_LABELS[status]}</Text>
    </View>
  );
}

function StatusChip({ status }: Readonly<{ status: ArtisanJobStatus }>) {
  return (
    <View
      style={[
        styles.statusChip,
        { backgroundColor: JOB_STATUS_CHIP_COLORS[status] },
      ]}
    >
      <Text
        style={[
          styles.statusChipLabel,
          { color: JOB_STATUS_TEXT_COLORS[status] },
        ]}
      >
        {JOB_STATUS_LABELS[status]}
      </Text>
    </View>
  );
}

function SummaryLine({
  label,
  value,
}: Readonly<{ label: string; value: string }>) {
  return (
    <Text numberOfLines={1} style={styles.summaryValue}>
      <Text style={styles.summaryLabel}>{label} </Text>
      {value}
    </Text>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: Readonly<{ icon: ReactNode; label: string; value: string }>) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>{icon}</View>
      <View style={styles.contactCopy}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
    </View>
  );
}

function RequestRow({
  label,
  value,
  last = false,
}: Readonly<{ label: string; value: string; last?: boolean }>) {
  return (
    <View style={[styles.requestRow, !last && styles.requestRowDivided]}>
      <Text style={styles.requestLabel}>{label}</Text>
      <Text style={styles.requestValue}>{value}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  icon,
}: Readonly<{ label: string; onPress: () => void; icon?: ReactNode }>) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
    >
      {icon}
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

function OutlinedButton({
  label,
  onPress,
}: Readonly<{ label: string; onPress: () => void }>) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.outlinedButton,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.outlinedLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: dashboardColors.artisanSurface,
    flex: 1,
  },
  missing: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  missingText: {
    color: dashboardColors.textLabel,
    fontSize: 14,
  },
  content: {
    gap: 16,
    padding: 24,
  },
  summaryCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    gap: 16,
    padding: 16,
  },
  summaryTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 13,
  },
  avatar: {
    borderRadius: 4,
    height: 60,
    width: 60,
  },
  summaryIdentity: {
    flex: 1,
    gap: 4,
  },
  trade: {
    color: dashboardColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  clientName: {
    color: dashboardColors.textLabel,
    fontSize: 13,
    lineHeight: 18,
  },
  distance: {
    color: dashboardColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 10.5,
    height: 21,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  badgeLabel: {
    color: dashboardColors.white,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
  },
  summaryDetails: {
    gap: 8,
  },
  summaryLabel: {
    color: dashboardColors.textLabel,
    fontWeight: '700',
  },
  summaryValue: {
    color: dashboardColors.textLabel,
    fontSize: 12,
    lineHeight: 16,
  },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: {
    color: dashboardColors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  contactRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 13,
    paddingVertical: 10,
  },
  contactIcon: {
    alignItems: 'center',
    backgroundColor: CONTACT_ICON_WASH,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  contactCopy: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
    minHeight: 32,
  },
  contactLabel: {
    color: LABEL_MUTED,
    fontSize: 12,
    lineHeight: 16,
  },
  contactValue: {
    color: dashboardColors.textPrimary,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 19,
  },
  requestRow: {
    gap: 6,
    paddingVertical: 12,
  },
  requestRowDivided: {
    borderBottomColor: DIVIDER,
    borderBottomWidth: 1,
  },
  requestLabel: {
    color: dashboardColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  requestValue: {
    color: dashboardColors.textLabel,
    fontSize: 13,
    lineHeight: 19,
  },
  statusChip: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 11,
    height: 22,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  statusChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  tip: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(238, 247, 243, 0.4)',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  tipText: {
    color: dashboardColors.textLabel,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  actions: {
    gap: 16,
    paddingTop: 8,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: ACCENT,
    borderRadius: 6,
    flexDirection: 'row',
    gap: 8,
    height: 56,
    justifyContent: 'center',
  },
  primaryLabel: {
    color: dashboardColors.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  outlinedButton: {
    alignItems: 'center',
    borderColor: ACCENT,
    borderRadius: 6,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
  },
  outlinedLabel: {
    color: ACCENT,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  pressed: {
    opacity: 0.8,
  },
});

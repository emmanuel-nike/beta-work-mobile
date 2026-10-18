import { useState, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { appColors } from '../../theme/clientApp';

const FIELD_BG = appColors.field;
const FIELD_BORDER = '#C5B294';

/** Centered step title + helper copy used at the top of every wizard step. */
export function StepIntro({
  title,
  subtitle,
}: Readonly<{ title: string; subtitle: string }>) {
  return (
    <View style={styles.intro}>
      <Text style={styles.introTitle}>{title}</Text>
      <Text style={styles.introSubtitle}>{subtitle}</Text>
    </View>
  );
}

/** Section label sitting above a field or group of fields. */
export function FieldLabel({ children }: Readonly<{ children: ReactNode }>) {
  return <Text style={styles.label}>{children}</Text>;
}

/** Small muted helper line shown under a field. */
export function FieldHint({ children }: Readonly<{ children: ReactNode }>) {
  return <Text style={styles.hint}>{children}</Text>;
}

type PortfolioFieldProps = {
  label?: string;
  hint?: string;
  multiline?: boolean;
  /** Strip non-digits and show a number pad. */
  numeric?: boolean;
} & Pick<
  TextInputProps,
  | 'value'
  | 'onChangeText'
  | 'placeholder'
  | 'keyboardType'
  | 'autoCapitalize'
  | 'maxLength'
>;

/** Labeled single- or multi-line text field styled after the portfolio design. */
export function PortfolioField({
  label,
  hint,
  multiline = false,
  numeric = false,
  keyboardType,
  onChangeText,
  ...inputProps
}: PortfolioFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <View
        style={[
          styles.inputFrame,
          multiline && styles.inputFrameMultiline,
          focused && styles.inputFocused,
        ]}
      >
        <TextInput
          {...inputProps}
          keyboardType={numeric ? 'number-pad' : keyboardType}
          multiline={multiline}
          onBlur={() => setFocused(false)}
          onChangeText={value =>
            onChangeText?.(numeric ? value.replace(/[^\d]/g, '') : value)
          }
          onFocus={() => setFocused(true)}
          placeholderTextColor={appColors.placeholder}
          style={[styles.input, multiline && styles.inputMultiline]}
          textAlignVertical={multiline ? 'top' : 'center'}
          underlineColorAndroid="transparent"
        />
      </View>
      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  intro: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 8,
  },
  introTitle: {
    color: appColors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  introSubtitle: {
    color: appColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  field: {
    gap: 8,
  },
  label: {
    color: appColors.textLabel,
    fontSize: 14,
    lineHeight: 20,
  },
  hint: {
    color: appColors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  inputFrame: {
    alignItems: 'center',
    backgroundColor: FIELD_BG,
    borderColor: FIELD_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: 16,
  },
  inputFrameMultiline: {
    alignItems: 'flex-start',
    minHeight: 110,
    paddingVertical: 16,
  },
  input: {
    color: appColors.textPrimary,
    flex: 1,
    fontSize: 14,
    includeFontPadding: false,
    padding: 0,
    paddingVertical: 0,
  },
  inputMultiline: {
    lineHeight: 20,
    minHeight: 78,
  },
  inputFocused: {
    backgroundColor: appColors.white,
    borderColor: appColors.primary,
  },
});

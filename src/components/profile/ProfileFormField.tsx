import { useState, type ComponentType } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import type { SvgProps } from 'react-native-svg';

import EyeSlashIcon from '../../../assets/images/eye-slash.svg';
import { appColors } from '../../theme/clientApp';

const FIELD_BG = '#F5EDE2';
const FIELD_BORDER = '#C5B294';
const LABEL = '#5C3D27';
const TEXT = '#3A281A';

type ProfileFormFieldProps = {
  icon: ComponentType<SvgProps>;
  label: string;
  error?: string;
  isPassword?: boolean;
} & Pick<
  TextInputProps,
  | 'autoCapitalize'
  | 'autoComplete'
  | 'keyboardType'
  | 'onChangeText'
  | 'placeholder'
  | 'textContentType'
  | 'value'
>;

export function ProfileFormField({
  icon: Icon,
  label,
  error,
  isPassword = false,
  autoCapitalize,
  autoComplete,
  textContentType,
  value,
  onChangeText,
  ...inputProps
}: ProfileFormFieldProps) {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const secureTextEntry = isPassword && !passwordVisible;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputFrame,
          focused && styles.inputFrameFocused,
          error ? styles.inputFrameError : null,
        ]}
      >
        <Icon height={20} width={20} />
        <TextInput
          {...inputProps}
          autoCapitalize={autoCapitalize ?? (isPassword ? 'none' : 'sentences')}
          autoComplete={isPassword ? 'off' : autoComplete}
          autoCorrect={!isPassword}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          placeholderTextColor={appColors.placeholder}
          secureTextEntry={secureTextEntry}
          spellCheck={!isPassword}
          style={styles.input}
          textContentType={isPassword ? 'none' : textContentType}
          underlineColorAndroid="transparent"
          value={value}
        />
        {isPassword ? (
          <Pressable
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setPasswordVisible(current => !current)}
          >
            <View style={passwordVisible ? styles.eyeVisible : undefined}>
              <EyeSlashIcon height={18} width={18} />
            </View>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: LABEL,
    fontSize: 14,
    lineHeight: 20,
  },
  inputFrame: {
    alignItems: 'center',
    backgroundColor: FIELD_BG,
    borderColor: FIELD_BORDER,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 16,
  },
  inputFrameFocused: {
    backgroundColor: appColors.white,
    borderColor: appColors.primary,
  },
  inputFrameError: {
    borderColor: appColors.danger,
  },
  input: {
    color: TEXT,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  eyeVisible: {
    opacity: 0.5,
  },
  error: {
    color: appColors.danger,
    fontSize: 12,
    lineHeight: 16,
  },
});

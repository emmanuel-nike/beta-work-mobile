import { useEffect, useState, type ComponentType } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import type { SvgProps } from 'react-native-svg';

import EyeSlashIcon from '../../assets/images/eye-slash.svg';
import { colors } from '../theme/colors';

type FormFieldProps = {
  icon: ComponentType<SvgProps>;
  label: string;
  error?: string;
  helper?: string;
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

export function FormField({
  icon: Icon,
  label,
  error,
  helper,
  isPassword = false,
  autoCapitalize,
  autoComplete,
  textContentType,
  value = '',
  onChangeText,
  ...inputProps
}: FormFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const secureTextEntry = isPassword && !passwordVisible;

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  const handleChangeText = (nextValue: string) => {
    setDraftValue(nextValue);
    onChangeText?.(nextValue);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputFrame, error && styles.inputError]}>
        <Icon height={20} width={20} />
        <TextInput
          {...inputProps}
          autoCapitalize={autoCapitalize ?? (isPassword ? 'none' : 'sentences')}
          autoComplete={isPassword ? 'off' : autoComplete}
          autoCorrect={!isPassword}
          importantForAutofill={isPassword ? 'no' : 'auto'}
          onChangeText={handleChangeText}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry}
          spellCheck={!isPassword}
          style={styles.input}
          textContentType={isPassword ? 'none' : textContentType}
          underlineColorAndroid="transparent"
          value={draftValue}
        />
        {isPassword ? (
          <Pressable
            accessibilityLabel={
              passwordVisible ? 'Hide password' : 'Show password'
            }
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setPasswordVisible(current => !current)}
            style={styles.visibilityToggle}
          >
            <View style={passwordVisible ? styles.eyeVisible : undefined}>
              <EyeSlashIcon height={18} width={18} />
            </View>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && helper ? <Text style={styles.helper}>{helper}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    color: colors.formLabel,
    fontSize: 14,
    lineHeight: 21,
  },
  inputFrame: {
    alignItems: 'center',
    borderColor: colors.formBorder,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    padding: 0,
  },
  visibilityToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  eyeVisible: {
    opacity: 0.45,
  },
  helper: {
    color: colors.helperText,
    fontSize: 12,
    lineHeight: 18,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 15,
  },
});

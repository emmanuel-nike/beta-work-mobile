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
  ...inputProps
}: FormFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputFrame, error && styles.inputError]}>
        <Icon height={20} width={20} />
        <TextInput
          placeholderTextColor={colors.placeholder}
          secureTextEntry={isPassword && !passwordVisible}
          style={styles.input}
          {...inputProps}
        />
        {isPassword ? (
          <Pressable
            accessibilityLabel={
              passwordVisible ? 'Hide password' : 'Show password'
            }
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setPasswordVisible(current => !current)}>
            <EyeSlashIcon height={18} width={18} />
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
    height: 50,
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    height: 50,
    padding: 0,
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

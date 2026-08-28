import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { ErrorMessage } from './ErrorMessage';

type CustomInputProps = TextInputProps & {
  label: string;
  error?: string;
  labelColor?: string;
  inputBackgroundColor?: string;
  inputTextColor?: string;
  inputBorderColor?: string;
  placeholderColor?: string;
};

export function CustomInput({
  label,
  error,
  style,
  labelColor = '#232323',
  inputBackgroundColor = '#ffffff',
  inputTextColor = '#171717',
  inputBorderColor = '#c8cad0',
  placeholderColor = '#858585',
  ...inputProps
}: CustomInputProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: labelColor }]}>{label}</Text>

      <TextInput
        {...inputProps}
        style={[
          styles.input,
          {
            backgroundColor: inputBackgroundColor,
            color: inputTextColor,
            borderColor: inputBorderColor,
          },
          error ? styles.inputError : undefined,
          style,
        ]}
        placeholderTextColor={placeholderColor}
      />

      <ErrorMessage message={error} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: '#b42318',
  },
});

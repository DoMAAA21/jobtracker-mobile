import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useLogin } from '@/hooks/auth/use-login';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/api-error';

export function LoginForm() {
  const theme = useTheme();
  const loginMutation = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  const errorMessage = loginMutation.error ? getErrorMessage(loginMutation.error) : null;
  const canSubmit = email.trim().length > 0 && password.length >= 8 && !loginMutation.isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}>
      <View style={styles.form}>
        <ThemedText type="subtitle" style={styles.heading}>
          Sign in
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subheading}>
          Use your Jobtracker account
        </ThemedText>

        <ThemedText type="smallBold" style={styles.label}>
          Email
        </ThemedText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />

        <ThemedText type="smallBold" style={styles.label}>
          Password
        </ThemedText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholder="8–32 characters"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />

        {errorMessage ? (
          <ThemedView type="backgroundSelected" style={styles.errorBox}>
            <ThemedText type="small" style={styles.errorText}>
              {errorMessage}
            </ThemedText>
          </ThemedView>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.text, opacity: !canSubmit ? 0.5 : pressed ? 0.85 : 1 },
          ]}>
          {loginMutation.isPending ? (
            <ActivityIndicator color={theme.background} />
          ) : (
            <ThemedText type="smallBold" style={[styles.buttonText, { color: theme.background }]}>
              Sign in
            </ThemedText>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignSelf: 'stretch',
  },
  form: {
    gap: Spacing.two,
    alignSelf: 'stretch',
  },
  heading: {
    textAlign: 'center',
  },
  subheading: {
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  label: {
    marginTop: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  errorBox: {
    padding: Spacing.two,
    borderRadius: Spacing.two,
    marginTop: Spacing.one,
  },
  errorText: {
    color: '#e5484d',
  },
  button: {
    marginTop: Spacing.three,
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
});

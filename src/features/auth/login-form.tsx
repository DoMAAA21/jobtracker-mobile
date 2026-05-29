import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { Button, buttonFullWidth } from '@/components/ui/button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { authQueryKeys } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/api-error';
import { login } from '@/api/auth';

export function LoginForm() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me, user);
      router.replace('/(app)');
    },
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    loginMutation.mutate({
      email: email.trim(),
      password,
    });
  };

  const errorMessage = loginMutation.error ? getErrorMessage(loginMutation.error) : null;
  const canSubmit = email.trim().length > 0 && password.length >= 8;

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

        <Button
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={loginMutation.isPending}
          style={[buttonFullWidth, styles.submit]}>
          Sign in
        </Button>
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
  submit: {
    marginTop: Spacing.three,
  },
});

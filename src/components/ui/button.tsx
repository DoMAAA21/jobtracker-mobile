import { forwardRef, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type ThemeTokens = ReturnType<typeof useTheme>;

type VariantStyle = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  foreground: string;
};

const DESTRUCTIVE = '#ef4444';
const DESTRUCTIVE_FOREGROUND = '#ffffff';
const PRIMARY_ACCENT = '#3c87f7';

function getVariantStyle(variant: ButtonVariant, theme: ThemeTokens): VariantStyle {
  switch (variant) {
    case 'destructive':
      return {
        backgroundColor: DESTRUCTIVE,
        borderColor: 'transparent',
        borderWidth: 0,
        foreground: DESTRUCTIVE_FOREGROUND,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderColor: theme.backgroundSelected,
        borderWidth: 1,
        foreground: theme.text,
      };
    case 'secondary':
      return {
        backgroundColor: theme.backgroundElement,
        borderColor: 'transparent',
        borderWidth: 0,
        foreground: theme.text,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        foreground: theme.text,
      };
    case 'link':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        foreground: PRIMARY_ACCENT,
      };
    case 'default':
    default:
      return {
        backgroundColor: theme.text,
        borderColor: 'transparent',
        borderWidth: 0,
        foreground: theme.background,
      };
  }
}

const sizeStyles = StyleSheet.create({
  sm: {
    height: 32,
    paddingHorizontal: 12,
    gap: 6,
  },
  default: {
    height: 36,
    paddingHorizontal: 16,
    gap: 8,
  },
  lg: {
    height: 40,
    paddingHorizontal: 20,
    gap: 8,
  },
  icon: {
    height: 36,
    width: 36,
    paddingHorizontal: 0,
    gap: 0,
  },
});

const textSizeStyles = StyleSheet.create({
  sm: {
    fontSize: 13,
    lineHeight: 18,
  },
  default: {
    fontSize: 14,
    lineHeight: 20,
  },
  lg: {
    fontSize: 16,
    lineHeight: 22,
  },
  icon: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    variant = 'default',
    size = 'default',
    loading = false,
    disabled,
    children,
    style,
    textStyle,
    ...pressableProps
  },
  ref,
) {
  const theme = useTheme();
  const variantStyle = getVariantStyle(variant, theme);
  const isDisabled = disabled || loading;
  const isLink = variant === 'link';

  const label =
    typeof children === 'string' || typeof children === 'number' ? (
      <Text
        style={[
          styles.label,
          textSizeStyles[size],
          { color: variantStyle.foreground },
          isLink && styles.linkLabel,
          textStyle,
        ]}
        numberOfLines={1}>
        {children}
      </Text>
    ) : (
      children
    );

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          borderWidth: variantStyle.borderWidth,
        },
        isLink && styles.link,
        pressed && !isDisabled && variant === 'ghost' && { backgroundColor: theme.backgroundElement },
        pressed && !isDisabled && !isLink && variant !== 'ghost' && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}>
      {loading ? (
        <ActivityIndicator size="small" color={variantStyle.foreground} />
      ) : (
        label
      )}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    alignSelf: 'flex-start',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  label: {
    fontWeight: '500',
    textAlign: 'center',
  },
  link: {
    height: 'auto',
    minHeight: 36,
    paddingHorizontal: 0,
    borderRadius: 0,
  },
  linkLabel: {
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.5,
  },
});

/** Full-width button (common for forms, like shadcn `className="w-full"`). */
export const buttonFullWidth: ViewStyle = {
  alignSelf: 'stretch',
};

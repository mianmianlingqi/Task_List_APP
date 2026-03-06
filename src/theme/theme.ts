/**
 * MUI 主题配置
 * @description 消费 design-tokens，支持明暗双主题切换
 */
import { createTheme } from '@mui/material/styles';
import type { ThemeMode } from '@/types/config';
import { colors, borderRadius, typography } from '../../design-tokens/tokens';

/**
 * 根据主题模式生成 MUI Theme 对象
 * @param mode - 'dark' | 'light'
 * @returns MUI Theme 实例
 */
export function buildTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';
  const bgTokens = isDark ? colors.background.dark : colors.background.light;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.primary.main,
        light: colors.primary.light,
        dark: colors.primary.dark,
        contrastText: colors.primary.contrastText,
      },
      secondary: {
        main: colors.secondary.main,
        light: colors.secondary.light,
        dark: colors.secondary.dark,
        contrastText: colors.secondary.contrastText,
      },
      success: {
        main: colors.success.main,
        light: colors.success.light,
        dark: colors.success.dark,
      },
      warning: {
        main: colors.warning.main,
        light: colors.warning.light,
        dark: colors.warning.dark,
      },
      error: {
        main: colors.error.main,
        light: colors.error.light,
        dark: colors.error.dark,
      },
      background: {
        default: bgTokens.default,
        paper: bgTokens.paper,
      },
    },
    typography: {
      fontFamily: typography.fontFamily,
    },
    shape: {
      borderRadius: borderRadius.md,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: borderRadius.md,
            backgroundImage: 'none',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: borderRadius.lg,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: borderRadius.sm,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
    },
  });
}

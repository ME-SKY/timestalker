// src/types/locale.d.ts
import { Locale } from '@types/locale';

declare global {
  // Augmenting the global namespace with Locale
  type Locale = Locale;
}

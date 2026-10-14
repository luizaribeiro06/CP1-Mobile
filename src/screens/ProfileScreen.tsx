import { SettingsScreen } from './SettingsScreen';
import type { User } from '../types/user';

type ProfileScreenProps = {
  user?: User;
  isDark?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  onBack?: () => void;
  onSaveUser?: (updatedUser: User) => Promise<void>;
};

// Mantém compatibilidade integral com a assinatura e importação do CP1
export default function ProfileScreen(_props?: ProfileScreenProps) {
  return <SettingsScreen />;
}

export { SettingsScreen };

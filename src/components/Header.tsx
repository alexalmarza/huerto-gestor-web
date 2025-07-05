
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Sprout, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';

const Header = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    await signOut();
    toast.success('¡Hasta luego!');
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('appTitle')}</h1>
              <p className="text-sm text-gray-600">{t('appSubtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {t('welcome')}, {user?.user_metadata?.full_name || user?.email}
            </span>
            <LanguageSelector />
            <Button variant="outline" onClick={handleSignOut} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>{t('signOut')}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

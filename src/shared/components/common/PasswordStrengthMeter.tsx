import { useTranslation } from 'next-i18next';
import { PasswordStrength, getPasswordStrengthColor } from '@/shared/utils/password';

interface PasswordStrengthMeterProps {
  strength: PasswordStrength;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ strength }) => {
  const { t } = useTranslation('common');

  return (
    <div className="mt-2 space-y-2">
      <div className="flex space-x-1 h-1">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={`flex-1 rounded-full transition-colors duration-200 ${
              segment <= strength.score
                ? getPasswordStrengthColor(strength.score)
                : 'bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      {strength.feedback.length > 0 && (
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          {strength.feedback.map((feedback, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-1">•</span>
              {t(feedback)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;

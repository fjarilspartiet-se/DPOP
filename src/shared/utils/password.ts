export interface PasswordStrength {
  score: number;  // 0-4
  isStrong: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  feedback: string[];
}

export const validatePassword = (password: string): PasswordStrength => {
  const minLength = 8;
  const result: PasswordStrength = {
    score: 0,
    isStrong: false,
    hasMinLength: password.length >= minLength,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    feedback: [],
  };

  // Calculate score based on criteria
  let score = 0;
  if (result.hasMinLength) score++;
  if (result.hasUppercase) score++;
  if (result.hasLowercase) score++;
  if (result.hasNumber) score++;
  if (result.hasSpecialChar) score++;

  result.score = Math.min(4, score);
  result.isStrong = score >= 4;

  // Generate feedback
  if (!result.hasMinLength) {
    result.feedback.push('validation.password.tooShort');
  }
  if (!result.hasUppercase) {
    result.feedback.push('validation.password.needsUpper');
  }
  if (!result.hasLowercase) {
    result.feedback.push('validation.password.needsLower');
  }
  if (!result.hasNumber) {
    result.feedback.push('validation.password.needsNumber');
  }
  if (!result.hasSpecialChar) {
    result.feedback.push('validation.password.needsSpecial');
  }

  return result;
};

export const getPasswordStrengthColor = (score: number): string => {
  switch (score) {
    case 0:
    case 1:
      return 'bg-red-500';
    case 2:
      return 'bg-orange-500';
    case 3:
      return 'bg-yellow-500';
    case 4:
      return 'bg-green-500';
    default:
      return 'bg-gray-300';
  }
};

export const calculatePasswordStrength = (pw) => {
  let score = 0;
  if (!pw) return { score, label: 'Kekuatan: -', color: 'bg-red-500', labelColor: 'text-slate-500', width: '0%' };

  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  // Simple dictionary check
  const weakWords = ['password', '123456', 'admin', 'qwerty'];
  if (weakWords.some(word => pw.toLowerCase().includes(word))) {
    score = Math.max(1, score - 2); // Penalize common weak words
  }

  let strengthWidth = '0%';
  let strengthColor = 'bg-red-500';
  let strengthLabel = 'Kekuatan: Lemah';
  let strengthLabelColor = 'text-red-500';

  if (score <= 1) {
    strengthWidth = '33%';
  } else if (score <= 3) {
    strengthWidth = '66%';
    strengthColor = 'bg-yellow-500';
    strengthLabel = 'Kekuatan: Sedang';
    strengthLabelColor = 'text-yellow-600';
  } else {
    strengthWidth = '100%';
    strengthColor = 'bg-emerald-500';
    strengthLabel = 'Kekuatan: Kuat';
    strengthLabelColor = 'text-emerald-500';
  }

  return {
    score,
    width: strengthWidth,
    color: strengthColor,
    label: strengthLabel,
    labelColor: strengthLabelColor
  };
};

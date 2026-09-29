export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Salasanassa oltava vähintään 8 merkkiä, iso ja pieni kirjain sekä numero';

export const isStrongPassword = (password: string): boolean => {
  return password.length >= PASSWORD_MIN_LENGTH && PASSWORD_PATTERN.test(password);
};

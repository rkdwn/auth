import crypto from "crypto";

const validPassword = (password: string) => {
  let hasNumber = false;
  let hasChar = false;
  let hasSpecialChar = false;

  if (password.length < 8) return false;
  password.split("").forEach(e => {
    const isNumber = /[0-9]/;
    if (isNumber.test(e)) hasNumber = true;

    const isChar = /[a-zA-Z]/;
    if (isChar.test(e)) hasChar = true;

    const isSpecialChar = /[~!?@\-+#$%^&*()_]/;
    if (isSpecialChar.test(e)) hasSpecialChar = true;
  });

  return hasNumber && hasChar && hasSpecialChar;
};

const pbkdf2Sync = (password: string) => {
  const salt = crypto.randomBytes(64).toString("hex");
  const key = crypto
    .pbkdf2Sync(password, salt, 1026, 64, "sha512")
    .toString("hex");

  return [salt, key];
};

const compare = (
  inputPassword: string,
  savePassword: string,
  saveSalt: string,
) => {
  const key = crypto
    .pbkdf2Sync(inputPassword, saveSalt, 1026, 64, "sha512")
    .toString("hex");

  return key === savePassword;
};

export { validPassword, pbkdf2Sync, compare };

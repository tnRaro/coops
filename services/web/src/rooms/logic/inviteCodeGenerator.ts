import crypto from "crypto";

export const genInviteCode = () => {
  const table = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let inviteCode = "";
  for (let i = 0; i < 6; i++) {
    const randomValue = crypto.randomInt(32);
    const char = table[randomValue];
    inviteCode += char;
  }
  return inviteCode;
};

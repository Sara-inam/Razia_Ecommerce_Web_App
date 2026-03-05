export const ROLE = {
  ADMIN: "admin",
  USER: "user",
};

export const checkRole = (user, role) => {
  return user?.role === role;
};
const DB_NAME = 'webworldcluster';

const UserRolesEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
};
const AvailableUserRoles = Object.values(UserRolesEnum);

const UserLoginType = {
  EMAIL_PASSWORD: 'EMAIL_PASSWORD',
  GOOGLE: 'GOOGLE',
};

const AvailableSocialLogins = Object.values(UserLoginType);

module.exports = {
  DB_NAME,
  AvailableUserRoles,
  UserRolesEnum,
  UserLoginType,
  AvailableSocialLogins,
};

const local = 'http://192.168.1.100:3000';
const localOffice = 'http://172.16.1.232:3000';
const live = '127.0.0.1:3000';

const api = localOffice;

export const allUsersAPI = `${api}/drivers`;
export const signinAPI = `${api}/drivers/signin`;
export const saveUserAPI = `${api}/drivers/saveUser`;
export const sigupAPI = `${api}/drivers/signup`;
export const sendEmailAPI = `${api}/drivers/sendEmail`;
export const updateProfileAPI = `${api}/drivers/updateUser`;
export const updateProfileImageAPI = `${api}/drivers/updateImage`;
export const logoutAPI = `${api}/drivers/logout`;

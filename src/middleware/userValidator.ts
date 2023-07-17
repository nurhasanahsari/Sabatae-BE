const { body, check } = require('express-validator');
import UserModel from '../models/User';

export default class UserValidator {
  public static createUser = () => {
    return [
      body('role').isIn(['01', '02', '03']).withMessage('Data tidak valid'),

      body('email').isEmail().withMessage('Format email tidak valid'),
      check('email').custom(async (value: String) => {
        return UserModel.getUserInfo({ email: value }).then((result) => {
          if (result.data?.rows[0]?.id) {
            return Promise.reject('Email telah digunakan. Mohon gunakan email lain');
          }
        });
      }),

      body('full_name').isLength({ min: 2 }).withMessage('Nama lengkap minimal 2 karakter'),
    ];
  };

  public static updateUser = () => {
    return [
      check('id').custom(async (value: String) => {
        return UserModel.getTableUsers({ id: value }).then((result) => {
          if (!result?.data?.rowCount) {
            return Promise.reject('ID pengguna tidak ada dalam database');
          }
        });
      }),
      body('role').optional().isIn(['01', '02', '03']).withMessage('Data tidak valid'),
    ];
  };
  public static deleteUser = () => {
    return [
      check('id').custom(async (value: String) => {
        return UserModel.getTableUsers({ id: value }).then((result) => {
          if (!result?.data?.rowCount) {
            return Promise.reject('ID pengguna tidak ada dalam database');
          }
          if (result.data?.rows[0]?.role === '04') {
            return Promise.reject('Anda tidak dapat menghapus pengguna dari SIAKAD. Namun Anda dapat menonaktifkannya.');
          }
        });
      }),
    ];
  };
}

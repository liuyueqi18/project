/**
 * 验证用户名
 * @export
 * @param {string} username
 * @return {*}
 */
export function CheckUserName(username: string) {
  const str = username;
  if (!str || str.length > 10 || str.length < 2) {
    return false;
  }
  const reg = new RegExp(/[\u4e00-\u9fa5]/gm);
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}

/**
 * 验证密码
 * @export
 * @param {string} password
 * @return {*}
 */
export function CheckPassWord(password: string) {
  const str = password;
  if (!str) {
    return false;
  } else {
    return true;
  }
}

/**
 * 验证邮箱
 * @export
 * @param {string} email
 * @return {*}
 */
export function CheckEmail(email: string) {
  const str = email;
  if (str === "") {
    return false;
  }
  const reg = new RegExp(
    "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
  );
  if (reg.test(str)) {
    return true;
  } else {
    return false;
  }
}

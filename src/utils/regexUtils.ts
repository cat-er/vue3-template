// regexUtils.js

// 定义正则表达式

// 美国手机号
const usPhoneRegex = /^\+?1?\s?(\(?[2-9][0-9]{2}\)?[\s.-]?)?([2-9][0-9]{2})[\s.-]?([0-9]{4})$/;

// 电子邮箱
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export { usPhoneRegex, emailRegex };

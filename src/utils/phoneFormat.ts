const phoneFormat = (phoneNumber: string): string => {
  phoneNumber = String(phoneNumber);
  // 清除所有非数字和非星号的字符
  const cleanedPhoneNumber = phoneNumber.replace(/[^\d*]/g, "");

  // 检查号码是否为11位并且第一位是1
  if (cleanedPhoneNumber.length === 11 && cleanedPhoneNumber[0] === "1") {
    const remainingPhoneNumber = cleanedPhoneNumber.slice(1);

    const areaCode = remainingPhoneNumber.slice(0, 3);
    const firstThreeDigits = remainingPhoneNumber.slice(3, 6);
    const lastFourDigits = remainingPhoneNumber.slice(6); // 可以包含星号

    return `+1 (${areaCode}) ${firstThreeDigits}-${lastFourDigits}`;
  }
  // 如果号码是10位
  else if (cleanedPhoneNumber.length === 10) {
    const areaCode = cleanedPhoneNumber.slice(0, 3);
    const firstThreeDigits = cleanedPhoneNumber.slice(3, 6);
    const lastFourDigits = cleanedPhoneNumber.slice(6); // 可以包含星号

    return `+1 (${areaCode}) ${firstThreeDigits}-${lastFourDigits}`;
  } else {
    // 对于其他情况，返回原始号码
    return phoneNumber;
  }
};

export default phoneFormat;

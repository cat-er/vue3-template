/**
 * 判断文件mime是否属于图片
 */

export const isPhoto = (mime: string): boolean => {
  // 检查 MIME 类型是否以 'image/' 开头
  return mime.startsWith("image/");
};

/**
 * 全局枚举
 */

/**
 * 语言key
 */
export enum LocaleKey {
  Cn = "zh-CN",
  En = "en-US"
}

/**
 * 语言label
 */
export enum LocaleLabel {
  Cn = "中文",
  En = "English"
}

/**
 * 文件类型
 */
export enum FileTypeEnum {
  TEXT = ".txt,.md,.json,.xml,.csv,.log", // 文本文件和数据文件
  DOCUMENT = ".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx", // 文档文件
  PROGRAMMING = ".js,.ts,.java,.py,.cpp,.c,.rb,.php,.html,.css,.json", // 编程语言文件
  CONFIG = ".ini,.conf,.yaml,.yml,.json,.xml", // 配置文件
  PHOTO = ".jpeg,.jpg,.png,.gif,.bmp,.svg", // 图片文件
  AUDIO = ".mp3,.wav,.flac,.aac,.ogg,.m4a", // 音频文件
  VIDEO = ".mp4,.avi,.mkv,.mov,.wmv,.flv,.webm", // 视频文件
  COMPRESSED = ".zip,.rar,.tar,.gz,.7z,.bz2" // 压缩文件
}


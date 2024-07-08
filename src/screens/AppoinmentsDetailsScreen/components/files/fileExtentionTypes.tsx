const extensions = {
  // Image extensions
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  tif: "image",
  tiff: "image",
  webp: "image",

  // Video extensions
  mp4: "video",
  avi: "video",
  mkv: "video",
  mov: "video",
  wmv: "video",
  flv: "video",
  webm: "video",
  mpeg: "video",
  mpg: "video",
  m4v: "video",
  avchd: "video",
  mxf: "video",
  vob: "video",
  swf: "video",
  ogv: "video",
  ts: "video",
  f4v: "video",
  asf: "video",
  rm: "video",
  rmvb: "video",

  // Document extensions
  pdf: "document",
  doc: "document",
  docx: "document",
  xls: "document",
  xlsx: "document",
  ppt: "document",
  pptx: "document",
  txt: "document",
  rtf: "document",
  odt: "document",
  ods: "document",
  odp: "document",
  html: "document",
  htm: "document",
  md: "document",
};
export type ExtentionTypes =
  | "jpg"
  | "jpeg"
  | "png"
  | "gif"
  | "tif"
  | "tiff"
  | "webp"
  | "mp4"
  | "avi"
  | "mkv"
  | "mov"
  | "wmv"
  | "flv"
  | "webm"
  | "mpeg"
  | "mpg"
  | "m4v"
  | "avchd"
  | "mxf"
  | "vob"
  | "swf"
  | "ogv"
  | "ts"
  | "f4v"
  | "asf"
  | "rm"
  | "rmvb"
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "txt"
  | "rtf"
  | "odt"
  | "ods"
  | "odp"
  | "html"
  | "htm"
  | "md";
export const allFileTypes = {
    image:"image",
    video:"video",
    doc:"document"
}
export default extensions;

import { createWorker, OEM, PSM } from "tesseract.js"

export const work = async (imagePath, logger) => {
  const worker = createWorker({
    workerPath: "https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js",
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
    corePath:
      "https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js",

    logger,
  })

  console.log("start")
  await worker.load()
  console.log(1)
  await worker.loadLanguage("jpn")
  console.log(2)
  await worker.initialize("jpn")
  console.log(3)
  await worker.setParameters({
    // tessedit_char_whitelist: "こんにちは",
    // tessedit_ocr_engine_mode: OEM.TESSERACT_ONLY,
    // tessedit_pageseg_mode: PSM.SPARSE_TEXT_OSD,
    tessjs_create_box: "1",
    // tessjs_create_osd: "1",
    // tessjs_create_unlv: "1",
  })
  console.log(4)
  console.log("XXX")

  const result = await worker.recognize(imagePath)
  await worker.terminate()
  return result
}

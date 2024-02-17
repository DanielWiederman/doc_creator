import { useEffect, useState } from 'react'
import './App.less'
import { useTesseract } from './components/useTesseract'
import { useImageProccesor } from './components/ImageUploader'
import { useTextDecoding } from './components/useDocDecoding'

function App() {
  const [file, setFile] = useState<File | null>(null)
  const [showOriginalImg, setShowOriginalImg] = useState(false)
  const [showProccesedImage, setShowProccesedImage] = useState(false)
  const { processedImage, uploadedImage } = useImageProccesor(file)
  const { words, loadingText } = useTesseract(processedImage as File, ["eng"])
  const { names, passportNumber, idNumber, docDates } = useTextDecoding(words)
  useEffect(() => {
    console.log(words)
  }, [words])

  if (loadingText) {
    return <>loading image</>
  }

  return (
    <>

      <h4>
        {file?.name}
      </h4>

      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />



      <div style={{ display: "flex" }}>

        <div style={{ width: "50%" }}>
          <button onClick={() => setShowOriginalImg(!showOriginalImg)}>
            {showOriginalImg ? "hide original image" : "show original image"}
          </button>

          {showOriginalImg && uploadedImage && (
            <div style={{ width: "100%" }}>
              <h2>Original Image</h2>
              <img src={uploadedImage as string} alt="Original" style={{ width: "auto", maxHeight: 250 }} />
            </div>
          )}
        </div>

        <div style={{ width: "50%" }}>
          <button onClick={() => setShowProccesedImage(!showProccesedImage)}>
            {showProccesedImage ? "hide proccesed image" : "show proccesed image"}
          </button>
          {showProccesedImage && processedImage && (
            <div style={{ width: "100%" }}>
              <h2>Processed Image</h2>
              <img src={processedImage as string} alt="Processed" style={{ width: "auto", maxHeight: 250 }} />
            </div>
          )}
        </div>

      </div>

      <div className="text-contain">
        <div className="text-is">
          text is:
        </div>
        <div>
          <div>
            {names.join(" ")}
          </div>
          <div>
            {idNumber}
          </div>
          <div>
            {passportNumber}
          </div>
          {docDates.map(date => <div>{date.toString()}</div>)}
        </div>
        <div className="text-value">
          {words.map(word => word.text).join(" ")}
        </div>
      </div>

    </>
  )
}

export default App

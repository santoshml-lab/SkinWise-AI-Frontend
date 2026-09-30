import { useState } from "react";
import {
  Camera,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Upload,
  ScanFace,
  ChevronRight,
} from "lucide-react";

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
const [result, setResult] = useState(null);
const [error, setError] = useState("");

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFile(event.dataTransfer.files?.[0]);
  };
    const analyzeSkin = async () => {
    if (!selectedFile) return;

    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/analyze-skin`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Skin analysis failed.");
      }

      const taskId = data.task?.data?.task_id;

      if (!taskId) {
        throw new Error("Task ID was not returned by the backend.");
      }

      let finalResult = null;

      for (let i = 0; i < 30; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const resultResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/skin-result/${taskId}`
        );

        const resultData = await resultResponse.json();

        if (!resultResponse.ok) {
          throw new Error(
            resultData.detail || "Could not fetch skin result."
          );
        }

        if (resultData.data?.task_status === "success") {
          finalResult = resultData;
          break;
        }
      }

      if (!finalResult) {
        throw new Error("Analysis is taking too long. Please try again.");
      }

      setResult(finalResult);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one"></div>
      <div className="ambient ambient-two"></div>

      <header className="navbar">
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={18} />
          </div>

          <div>
            <div className="brand-name">SkinWise</div>
            <div className="brand-ai">AI</div>
          </div>
        </div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#how">How it works</a>
          <a href="#insights">Insights</a>
        </nav>

        <button className="nav-button">
          Get Started
          <ArrowRight size={16} />
        </button>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              AI-POWERED SKIN ANALYSIS
            </div>

            <h1>
              Your skin.
              <br />
              <span>Understood.</span>
            </h1>

            <p className="hero-text">
              Discover personalized skin insights powered by AI.
              Understand your skin and build a smarter skincare routine.
            </p>

            <div className="hero-points">
              <div>
                <ShieldCheck size={18} />
                <span>Private & secure</span>
              </div>

              <div>
                <ScanFace size={18} />
                <span>AI skin analysis</span>
              </div>
            </div>
          </div>

          <div className="upload-card">
            <div className="card-glow"></div>

            <div className="upload-card-header">
              <div>
                <p className="mini-label">STEP 01</p>
                <h2>Analyze your skin</h2>
              </div>

              <div className="camera-icon">
                <Camera size={20} />
              </div>
            </div>

            <label
              className={`drop-zone ${dragActive ? "drag-active" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                hidden
              />

              <div className="upload-icon">
                <Upload size={24} />
              </div>

              {selectedFile ? (
                <>
                  <h3>{selectedFile.name}</h3>
                  <p>Image selected successfully</p>
                </>
              ) : (
                <>
                  <h3>Upload your photo</h3>
                  <p>
                    Drag & drop your photo here
                    <br />
                    or <span>browse from your device</span>
                  </p>
                </>
              )}

              <div className="upload-format">
                JPG / PNG · Clear face photo recommended
              </div>
            </label>

            <button
  className="analyze-button"
  onClick={analyzeSkin}
  disabled={!selectedFile || analyzing}
>
  <Sparkles size={18} />

  {analyzing ? "Analyzing..." : "Analyze My Skin"}

  <ChevronRight size={18} />
</button>
              
              
            
              
              

            <p className="privacy-note">
              <ShieldCheck size={14} />
              Your photo is processed securely.
            </p>
            {analyzing && (
  <p
    style={{
      marginTop: "14px",
      textAlign: "center",
      fontWeight: "600",
    }}
  >
    🔍 Analyzing your skin...
  </p>
)}

{error && (
  <p
    style={{
      marginTop: "14px",
      textAlign: "center",
      color: "#b42318",
      fontWeight: "600",
    }}
  >
    {error}
  </p>
)}
          </div>
        </section>

        <section id="how" className="feature-strip">
          <div className="feature">
            <div className="feature-number">01</div>
            <div>
              <h3>Upload</h3>
              <p>Take or choose a clear face photo.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-number">02</div>
            <div>
              <h3>Analyze</h3>
              <p>AI evaluates multiple skin characteristics.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-number">03</div>
            <div>
              <h3>Understand</h3>
              <p>Get personalized insights and guidance.</p>
            </div>
          </div>
        </section>

        <section id="insights" className="preview-section">
          <div className="preview-heading">
            <p className="mini-label">WHAT YOU'LL DISCOVER</p>
            <h2>More than just a skin score.</h2>
          </div>

          <div className="preview-grid">
            <div className="preview-card large">
              <Sparkles size={20} />
              <h3>Personalized insights</h3>
              <p>
                Turn skin-analysis data into simple, understandable
                recommendations.
              </p>
            </div>

            <div className="preview-card">
              <ScanFace size={20} />
              <h3>Multiple signals</h3>
              <p>
                Explore texture, moisture, oiliness, pores and more.
              </p>
            </div>

            <div className="preview-card">
              <ShieldCheck size={20} />
              <h3>Privacy first</h3>
              <p>
                Designed with a secure image-processing experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand">
          <div className="brand-mark">
            <Sparkles size={16} />
          </div>

          <div>
            <div className="brand-name">SkinWise</div>
            <div className="brand-ai">AI</div>
          </div>
        </div>

        <p>AI-powered skincare intelligence.</p>
      </footer>
    </div>
  );
}

export default App;

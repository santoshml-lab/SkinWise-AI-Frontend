import { useState } from "react";
import {
  Camera,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Upload,
  ScanFace,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  X,
} from "lucide-react";
import productCatalog from "./data/productCatalog";


   
   

  
      

function App() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setInsights(null);
    setSelectedCategory(null);
    setError("");
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
    setInsights(null);

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

      for (let i = 0; i < 18; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10000));

        const resultResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/skin-result/${taskId}`
        );

        const resultData = await resultResponse.json();

        if (!resultResponse.ok) {
          throw new Error(
            resultData.detail || "Could not fetch skin result."
          );
        }

        const taskStatus = resultData?.data?.task_status;

        console.log("YouCam task status:", taskStatus);

        if (taskStatus === "success") {
          finalResult = resultData;
          break;
        }

        if (taskStatus === "error") {
          throw new Error(
            resultData?.data?.error_message ||
              resultData?.data?.error ||
              "YouCam skin analysis failed."
          );
        }
      }

      if (!finalResult) {
        throw new Error("Analysis is taking too long. Please try again.");
      }

      setResult(finalResult);

      const output = finalResult?.data?.results?.output || [];

      const scores = output
        .filter((item) =>
          [
            "all",
            "acne",
            "moisture",
            "oiliness",
            "pore",
            "texture",
            "redness",
            "wrinkle",
            "age_spot",
            "radiance",
            "firmness",
          ].includes(item.type)
        )
        .map((item) => ({
          type: item.type,
          ...(item.score !== undefined
            ? { score: item.score }
            : { ui_score: item.ui_score }),
        }));

      setInsightsLoading(true);

      try {
        const insightResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/personalized-insights`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              scores,
            }),
          }
        );

        const insightData = await insightResponse.json();

        if (!insightResponse.ok) {
          throw new Error(
            insightData.detail || "Could not generate AI insights."
          );
        }

        setInsights(insightData.insights);
      } catch (insightError) {
        console.error("AI insights error:", insightError);

        setError(
          insightError.message ||
            "Could not generate personalized insights."
        );
      } finally {
        setInsightsLoading(false);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  };

  const getMetric = (type) => {
    return (
      result?.data?.results?.output?.find(
        (item) => item.type === type
      ) || null
    );
  };

  const overallScore = getMetric("all");
  const skinAge = getMetric("skin_age");

  const metrics = [
    { type: "acne", label: "Acne" },
    { type: "moisture", label: "Moisture" },
    { type: "oiliness", label: "Oiliness" },
    { type: "pore", label: "Pores" },
    { type: "texture", label: "Texture" },
    { type: "redness", label: "Redness" },
    { type: "wrinkle", label: "Wrinkles" },
    { type: "age_spot", label: "Age Spots" },
    { type: "radiance", label: "Radiance" },
    { type: "firmness", label: "Firmness" },
  ];

  const resetAnalysis = () => {
    setSelectedFile(null);
    setResult(null);
    setInsights(null);
    setSelectedCategory(null);
    setError("");
    setAnalyzing(false);
    setInsightsLoading(false);
  };

  const openProduct = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
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

        <button
          className="nav-button"
          onClick={() =>
            document
              .getElementById("analyzer")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Get Started
          <ArrowRight size={16} />
        </button>
      </header>

      <main id="home">
        {!result ? (
          <>
            <section className="hero" id="analyzer">
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

    {/* Hero Image */}
    <div className="hero-visual">
      <div className="hero-image-card">
        <img
          src="/hero-skin.jpg"
          alt="AI-powered skincare analysis"
        />

        <div className="hero-ai-badge">
          <Sparkles size={15} />
          <span>AI Skin Insight</span>
        </div>

        <div className="hero-analysis-card">
          <div className="hero-analysis-icon">
            <ScanFace size={17} />
          </div>

          <div>
            <strong>Skin analysis ready</strong>
            <span>Personalized insights</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Upload / Analyzer Card */}
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
      className={`drop-zone ${
        dragActive ? "drag-active" : ""
      }`}
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

      {analyzing
        ? "Analyzing..."
        : "Analyze My Skin"}

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
              
                
                  

            
                  
                  

            <section id="how" className="how-section">
  <div className="how-heading">
    <p className="mini-label">HOW IT WORKS</p>

    <h2>
      From photo to
      <br />
      <span>personalized guidance.</span>
    </h2>

    <p>
      SkinWise AI turns a simple photo into clear,
      personalized skincare guidance in four simple steps.
    </p>
  </div>

  <div className="how-grid">
    <article className="how-card">
      <div className="how-number">01</div>

      <div className="how-icon">
        <Upload size={22} />
      </div>

      <h3>Upload Photo</h3>

      <p>
        Upload a clear face photo from your device.
      </p>
    </article>

    <article className="how-card">
      <div className="how-number">02</div>

      <div className="how-icon">
        <ScanFace size={22} />
      </div>

      <h3>AI Analysis</h3>

      <p>
        YouCam AI analyzes multiple skin characteristics.
      </p>
    </article>

    <article className="how-card">
      <div className="how-number">03</div>

      <div className="how-icon">
        <Sparkles size={22} />
      </div>

      <h3>Get Insights</h3>

      <p>
        Receive simple, personalized skincare guidance.
      </p>
    </article>

    <article className="how-card">
      <div className="how-number">04</div>

      <div className="how-icon">
        <ShieldCheck size={22} />
      </div>

      <h3>Follow Your Routine</h3>

      <p>
        Explore a simple morning and evening routine.
      </p>
    </article>
  </div>
</section>
              
                
              
      

            <section id="insights" className="benefits-section">
  <div className="benefits-heading">
    <p className="mini-label">WHY SKINWISE AI</p>

    <h2>
      More than just
      <br />
      <span>a skin score.</span>
    </h2>

    <p>
      SkinWise AI helps turn skin-analysis data into
      simple, understandable skincare guidance.
    </p>
  </div>

  <div className="benefits-grid">
    <article className="benefit-card benefit-large">
      <div className="benefit-icon">
        <ShieldCheck size={22} />
      </div>

      <div>
        <p className="benefit-label">01 · PRIVACY</p>
        <h3>Privacy first</h3>
        <p>
          Your photo is processed securely so you can
          explore your skin insights with confidence.
        </p>
      </div>
    </article>

    <article className="benefit-card">
      <div className="benefit-icon">
        <Sparkles size={22} />
      </div>

      <p className="benefit-label">02 · INTELLIGENCE</p>

      <h3>AI-powered insights</h3>

      <p>
        Turn structured skin-analysis results into
        clear, easy-to-understand guidance.
      </p>
    </article>

    <article className="benefit-card">
      <div className="benefit-icon">
        <ScanFace size={22} />
      </div>

      <p className="benefit-label">03 · PERSONALIZED</p>

      <h3>Made for your skin journey</h3>

      <p>
        Explore focus areas, cosmetic categories and
        simple routines based on your analysis.
      </p>
    </article>

    <article className="benefit-card">
      <div className="benefit-icon">
        <ArrowRight size={22} />
      </div>

      <p className="benefit-label">04 · ACTIONABLE</p>

      <h3>From insight to action</h3>

      <p>
        Move from analysis to practical skincare steps
        without overwhelming complexity.
      </p>
    </article>
  </div>
</section>
              
          </>
        ) : (
          <section className="results-section">
            <div className="results-header">
              <div>
                <p className="mini-label">YOUR AI ANALYSIS</p>
                <h1>Your Skin Insights</h1>
                <p>
                  Your YouCam-powered skin analysis is complete.
                </p>
              </div>

              <button
                className="nav-button"
                onClick={resetAnalysis}
              >
                <RotateCcw size={16} />
                Analyze Again
              </button>
            </div>

            <div className="score-grid">
              <div className="score-card main-score">
                <p className="mini-label">OVERALL SKIN SCORE</p>

                <div className="big-score">
                  {overallScore?.score ?? "--"}
                  <span>/100</span>
                </div>

                <p>
                  Overall analysis score based on the detected
                  skin characteristics.
                </p>
              </div>

              <div className="score-card">
                <p className="mini-label">AI-ESTIMATED SKIN AGE</p>

                <div className="age-score">
                  {skinAge?.score ?? "--"}
                  <span> yrs</span>
                </div>

                <p>
                  This is an AI analysis estimate, not a medical
                  or biological age measurement.
                </p>
              </div>
            </div>

            <div className="metrics-section">
              <div className="metrics-heading">
                <p className="mini-label">SKIN CHARACTERISTICS</p>
                <h2>Detailed analysis</h2>
              </div>

              <div className="metrics-grid">
                {metrics.map((metric) => {
                  const item = getMetric(metric.type);
                  const score = item?.ui_score;

                  return (
                    <div className="metric-card" key={metric.type}>
                      <div className="metric-top">
                        <h3>{metric.label}</h3>

                        <span className="metric-score">
                          {score ?? "--"}
                        </span>
                      </div>

                      <div className="metric-bar">
                        <div
                          className="metric-bar-fill"
                          style={{
                            width: `${Math.min(
                              Math.max(score || 0, 0),
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <p>
                        AI analysis score for{" "}
                        {metric.label.toLowerCase()}.
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {insightsLoading && (
              <section className="ai-insights-section">
                <div className="ai-insights-loading">
                  <Sparkles size={22} />

                  <div>
                    <h3>
                      Creating your personalized insights...
                    </h3>

                    <p>
                      SkinWise AI is turning your analysis into
                      simple skincare guidance.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {insights && (
              <section className="ai-insights-section">
                <div className="ai-insights-heading">
                  <p className="mini-label">POWERED BY AI</p>

                  <h2>Your Personalized Skincare Guide</h2>

                  <p>
                    Guidance generated from your YouCam
                    skin-analysis results.
                  </p>
                </div>

                <div className="profile-card">
                  <div className="profile-icon">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <h3>AI Skin Profile</h3>
                    <p>{insights.profile_summary}</p>
                  </div>
                </div>

                <div className="insight-grid">
                  <div className="insight-card">
                    <div className="insight-card-title">
                      <ScanFace size={20} />
                      <h3>Focus Areas</h3>
                    </div>

                    <div className="tag-list">
                      {insights.focus_areas?.map(
                        (area, index) => (
                          <span
                            className="insight-tag"
                            key={index}
                          >
                            {area}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="insight-card">
                    <div className="insight-card-title">
                      <Sparkles size={20} />
                      <h3>Product Categories</h3>
                    </div>

                    <div className="tag-list">
                      {insights.product_categories?.map(
                        (category, index) => (
                          <span
                            className="insight-tag"
                            key={index}
                          >
                            {category}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* =================================================
                    SKINWISE SHOP
                ================================================= */}

                <div className="shop-section">
                  <div className="section-label">
                    SKINWISE SHOP
                  </div>

                  <div className="shop-heading">
                    <div>
                      <h2>
                        Recommended Product Categories
                      </h2>

                      <p>
                        Explore cosmetic product categories
                        based on your SkinWise AI guidance.
                      </p>
                    </div>
                  </div>

                  <div className="product-category-grid">
                    {insights.product_categories?.map(
                      (category, index) => (
                        <article
                          className="product-category-card"
                          key={category}
                        >
                          <div className="product-category-number">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="product-category-content">
                            <h3>{category}</h3>

                            <p>
                              Explore cosmetic products within
                              this SkinWise AI category.
                            </p>

                            <button
                              type="button"
                              className="category-button"
                              onClick={() =>
                                setSelectedCategory(category)
                              }
                            >
                              Explore Category
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                </div>

                {/* =================================================
                    PRODUCT MODAL
                ================================================= */}

                {selectedCategory && (
                  <div
                    className="product-modal-overlay"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <div
                      className="product-modal"
                      onClick={(event) =>
                        event.stopPropagation()
                      }
                    >
                      <button
                        type="button"
                        className="product-modal-close"
                        onClick={() =>
                          setSelectedCategory(null)
                        }
                        aria-label="Close product modal"
                      >
                        <X size={20} />
                      </button>

                      <div className="product-modal-header">
                        <p className="mini-label">
                          SKINWISE SHOP
                        </p>

                        <h2>{selectedCategory}</h2>

                        <p>
                          Explore cosmetic product options
                          within this SkinWise AI category.
                        </p>
                      </div>

                      <div className="real-product-list">
                        {(
                          productCatalog[selectedCategory] || []
                        ).map((product) => (
                          <article
                            className="real-product-card"
                            key={product.name}
                          >
                            <div className="real-product-top">
                              <div>
                                <span className="product-brand">
                                  {product.brand}
                                </span>

                                <h3>{product.name}</h3>
                              </div>

                              <div className="product-category-pill">
                                {product.category}
                              </div>
                            </div>

                            <p className="real-product-description">
                              {product.description}
                            </p>

                            <button
                              type="button"
                              className="view-product-button"
                              onClick={() =>
                                openProduct(product.url)
                              }
                            >
                              View Product
                              <ExternalLink size={16} />
                            </button>
                          </article>
                        ))}
                      </div>

                      <div className="product-modal-footer">
                        <ShieldCheck size={17} />

                        <p>
                          Product availability, pricing and
                          formulations may change. Review the
                          product page before purchasing and
                          patch-test new cosmetic products.
                        </p>
                      </div>

                      <button
                        type="button"
                        className="close-product-button"
                        onClick={() =>
                          setSelectedCategory(null)
                        }
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* =================================================
                    MORNING + EVENING ROUTINES
                ================================================= */}

                <div className="routine-grid">
                  <div className="routine-card morning">
                    <div className="routine-header">
                      <span className="routine-number">AM</span>

                      <div>
                        <p className="mini-label">MORNING</p>
                        <h3>Morning Routine</h3>
                      </div>
                    </div>

                    <div className="routine-list">
                      {insights.morning_routine?.map(
                        (step, index) => (
                          <div
                            className="routine-step"
                            key={index}
                          >
                            <span>{index + 1}</span>
                            <p>{step}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="routine-card evening">
                    <div className="routine-header">
                      <span className="routine-number">PM</span>

                      <div>
                        <p className="mini-label">EVENING</p>
                        <h3>Evening Routine</h3>
                      </div>
                    </div>

                    <div className="routine-list">
                      {insights.evening_routine?.map(
                        (step, index) => (
                          <div
                            className="routine-step"
                            key={index}
                          >
                            <span>{index + 1}</span>
                            <p>{step}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="ai-safety-note">
                  <ShieldCheck size={19} />

                  <div>
                    <h3>SkinWise AI Note</h3>
                    <p>{insights.note}</p>
                  </div>
                </div>
              </section>
            )}

            <div className="result-note">
              <ShieldCheck size={20} />

              <div>
                <h3>SkinWise AI Insight</h3>

                <p>
                  These results are AI-generated skin-analysis
                  insights intended for cosmetic and skincare
                  guidance. They are not a medical diagnosis.
                </p>
              </div>
            </div>

            <button
              className="analyze-button result-button"
              onClick={resetAnalysis}
            >
              <RotateCcw size={18} />
              Analyze Another Photo
              <ChevronRight size={18} />
            </button>
          </section>
        )}
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

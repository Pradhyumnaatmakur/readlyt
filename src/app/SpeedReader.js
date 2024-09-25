import React, { useState, useEffect, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faPlay,
  faXmark,
  faExpand,
  faRotateLeft,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

const SpeedReader = () => {
  const [text, setText] = useState(() => {
    const savedText = localStorage.getItem("speedReaderText");
    return savedText || "";
  });
  const [wpm, setWpm] = useState(() => {
    const savedWpm = localStorage.getItem("speedReaderWpm");
    return savedWpm ? parseInt(savedWpm) : 200;
  });
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [showProgress, setShowProgress] = useState(true);
  const [showCenterButton, setShowCenterButton] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    const savedFontSize = localStorage.getItem("speedReaderFontSize");
    return savedFontSize || "medium";
  });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fileInputRef = useRef(null);

  const normalizeText = (text) => {
    return text.trim().replace(/\s+/g, " ");
  };

  const getNextWord = (text, startIndex) => {
    const trimmedText = text.slice(startIndex).trim();
    const nextSpace = trimmedText.indexOf(" ");
    if (nextSpace === -1) {
      return [trimmedText, text.length];
    }
    return [trimmedText.slice(0, nextSpace), startIndex + nextSpace + 1];
  };

  const words = normalizeText(text);
  const interval = 60000 / wpm;

  const handleStart = () => {
    if (words.length > 0) {
      setStarted(true);
      setIndex(0);
      setIsPaused(false);
    }
  };

  const handleEnd = () => {
    setStarted(false);
    setIndex(0);
    setCurrentWord("");
  };

  const handlePause = useCallback(
    (e) => {
      e.stopPropagation();
      setIsPaused((prev) => !prev);
      setShowProgress(true);
      setShowCenterButton(true);

      if (isPaused) {
        setShowCenterButton(false);
      }
    },
    [isPaused]
  );

  const handleReset = (e) => {
    e.stopPropagation();
    setIndex(0);
    const [firstWord] = getNextWord(words, 0);
    setCurrentWord(firstWord);
    setIsPaused(true);
    setShowProgress(true);
    setShowCenterButton(true);
  };

  const handleKeyPress = useCallback(
    (event) => {
      if (started && event.code === "Space") {
        event.preventDefault();
        handlePause(event);
      } else if (event.code === "Escape") {
        handleEnd();
      }
    },
    [handlePause, started]
  );

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (started && !isPaused) {
      if (index < words.length) {
        const [word, nextIndex] = getNextWord(words, index);
        setCurrentWord(word);
        const timer = setTimeout(() => {
          setIndex(nextIndex);
        }, interval);
        return () => clearTimeout(timer);
      } else {
        handleEnd();
      }
    }
  }, [started, index, interval, words, isPaused]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("speedReaderText", text);
    localStorage.setItem("speedReaderWpm", wpm.toString());
    localStorage.setItem("speedReaderFontSize", fontSize);
  }, [text, wpm, fontSize]);

  const progress = (index / words.length) * 100;
  const wordCount = words.split(" ").length;
  const readingTimeMinutes = wordCount / wpm;
  const readingTimeFormatted =
    readingTimeMinutes < 1
      ? `${Math.round(readingTimeMinutes * 60)} seconds`
      : `${Math.floor(readingTimeMinutes)} minutes ${Math.round(
          (readingTimeMinutes % 1) * 60
        )} seconds`;

  const fontSizes = {
    small: "text-[8vw] sm:text-[6vw] md:text-[4vw] lg:text-[3vw]",
    medium: "text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[4vw]",
    big: "text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6vw]",
    xl: "text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[8vw]",
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const fileType = file.type;

    if (fileType === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target.result);
      };
      reader.readAsText(file);
    } else if (fileType === "application/pdf") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const pdf = await pdfjsLib.getDocument(e.target.result).promise;
        let fullText = "";
        for (let i = 0; i < pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          fullText += pageText + " ";
        }
        setText(fullText);
      };
      reader.readAsArrayBuffer(file);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center p-2 sm:p-4 font-sans"
      style={isPaused ? { backdropFilter: "blur(10px)" } : {}}
      onClick={handlePause}
    >
      {!started ? (
        <div className="w-full max-w-2xl flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <textarea
            className="p-2 sm:p-4 border rounded w-full h-48 sm:h-64 bg-neutral-800 text-neutral-200 resize-none"
            placeholder="Enter your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <div className="w-full flex flex-col space-y-2 sm:space-y-4 items-center">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="flex items-center space-x-2 p-2 border border-neutral-700 rounded text-neutral-200">
                <label>WPM:</label>
                <input
                  className="p-1 w-16 sm:w-20 bg-neutral-800 text-neutral-200 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500"
                  type="number"
                  value={wpm}
                  onChange={(e) =>
                    setWpm(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                />
              </div>
              <div className="p-2 border border-neutral-700 rounded text-neutral-200">
                <span>Word Count: {wordCount}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="p-2 border border-neutral-700 rounded text-neutral-200">
                <span>Reading Time: {readingTimeFormatted}</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border border-neutral-700 rounded text-neutral-200">
                <label>Font Size:</label>
                <select
                  className="p-1 bg-neutral-800 text-neutral-200 border border-neutral-700 rounded focus:outline-none focus:border-neutral-500"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="big">Big</option>
                  <option value="xl">XL</option>
                </select>
              </div>
            </div>
            <button
              className="px-4 sm:px-6 py-2 sm:py-3 bg-neutral-200 text-neutral-900 font-bold rounded hover:bg-neutral-900 hover:text-neutral-200 transition-colors duration-300 text-base sm:text-lg flex items-center"
              onClick={handleUploadClick}
            >
              <FontAwesomeIcon icon={faUpload} className="mr-2" />
              Upload File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <button
            className="px-4 sm:px-6 py-2 sm:py-3 bg-neutral-200 text-neutral-900 font-bold rounded hover:bg-neutral-900 hover:text-neutral-200 transition-colors duration-300 text-base sm:text-lg"
            onClick={handleStart}
          >
            Start
          </button>
        </div>
      ) : (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-900"
          style={isPaused ? { backdropFilter: "blur(10px)" } : {}}
          onClick={handlePause}
        >
          <div className="text-center">
            <span
              className={`${fontSizes[fontSize]} transition-all duration-150 ease-in-out text-neutral-200 font-sans px-2 sm:px-4 py-1 sm:py-2 rounded-lg`}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 0 10px rgba(255, 255, 255, 0.1)",
              }}
            >
              {currentWord}
            </span>
          </div>

          <div className="absolute top-2 right-2 flex space-x-2 sm:space-x-4">
            <FontAwesomeIcon
              icon={faRotateLeft}
              size="lg"
              className="text-neutral-200 hover:text-neutral-400 transition-colors duration-300 cursor-pointer"
              aria-label="Reset"
              onClick={handleReset}
            />
            <FontAwesomeIcon
              icon={faExpand}
              size="lg"
              className="text-neutral-200 hover:text-neutral-400 transition-colors duration-300 cursor-pointer"
              aria-label="Toggle Full Screen"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullScreen();
              }}
            />
            <FontAwesomeIcon
              icon={faXmark}
              size="lg"
              className="text-neutral-200 hover:text-neutral-400 transition-colors duration-300 cursor-pointer"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                handleEnd();
              }}
            />
          </div>

          <FontAwesomeIcon
            icon={isPaused ? faPlay : faPause}
            size="4x"
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-neutral-200 transition-opacity duration-300 ${
              showCenterButton || isPaused ? "opacity-100" : "opacity-0"
            }`}
            aria-label={isPaused ? "Play" : "Pause"}
            onClick={handlePause}
          />

          {showProgress && (
            <div className="fixed bottom-0 left-0 w-full h-1 sm:h-[2vh] bg-neutral-700">
              <div
                className="h-full bg-neutral-200 transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpeedReader;

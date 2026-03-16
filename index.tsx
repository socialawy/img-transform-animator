
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai"; // Enabled for API integration

// API key is handled by the environment as per guidelines
// const API_KEY = process.env.API_KEY;

// Helper function to escape HTML characters for SVG text content
const escapeHtml = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
};

const DEFAULT_ASCII_CHAR_RAMP_STRING = '@%#*+=-:. ';
const DEFAULT_ASCII_CHAR_ARRAY = ['@', '%', '#', '*', '+', '=', '-', ':', '.', ' '];


const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
    const [transformedImage, setTransformedImage] = useState<string | null>(null);
    const [rawAsciiText, setRawAsciiText] = useState<string | null>(null);
    const [conversionType, setConversionType] = useState<string>('pixelate');
    const [pixelBlockSize, setPixelBlockSize] = useState<number>(10);
    const [asciiCharCellSize, setAsciiCharCellSize] = useState<number>(10);
    const [asciiCharRamp, setAsciiCharRamp] = useState<string>(DEFAULT_ASCII_CHAR_RAMP_STRING);
    const [asciiContrast, setAsciiContrast] = useState<number>(0);
    const [asciiEnableColor, setAsciiEnableColor] = useState<boolean>(false);
    const [animationTemplate, setAnimationTemplate] = useState<string>('none');
    const [exportFormat, setExportFormat] = useState<string>('png');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [aiClient, setAiClient] = useState<GoogleGenAI | null>(null);

    useEffect(() => {
      try {
        if (process.env.API_KEY) {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          setAiClient(ai);
        } else {
          console.warn("API_KEY not found in environment variables. AI features will be limited.");
        }
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI client:", e);
        setError("Failed to initialize AI Client. Some features might be unavailable.");
      }
    }, []);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setTransformedImage(null);
        setRawAsciiText(null);
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setOriginalImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImage(reader.result as string);
            };
            reader.onerror = () => {
                setError("Failed to read the image file.");
                setOriginalImage(null);
                setOriginalImageFile(null);
            }
            reader.readAsDataURL(file);
        } else {
            setOriginalImage(null);
            setOriginalImageFile(null);
        }
    };

    const performPixelation = (imgSrc: string, blockSize: number): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error("Could not get canvas context."));
                    return;
                }

                ctx.drawImage(img, 0, 0);

                for (let y = 0; y < img.height; y += blockSize) {
                    for (let x = 0; x < img.width; x += blockSize) {
                        const currentBlockWidth = Math.min(blockSize, img.width - x);
                        const currentBlockHeight = Math.min(blockSize, img.height - y);
                        
                        try {
                            const imageData = ctx.getImageData(x, y, currentBlockWidth, currentBlockHeight);
                            const data = imageData.data;
                            let r = 0, g = 0, b = 0, a = 0, count = 0;

                            for (let i = 0; i < data.length; i += 4) {
                                r += data[i];
                                g += data[i+1];
                                b += data[i+2];
                                a += data[i+3];
                                count++;
                            }

                            if (count > 0) {
                                ctx.fillStyle = `rgba(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)}, ${Math.round(a / count) / 255})`;
                            } else {
                                ctx.fillStyle = 'rgba(0,0,0,0)';
                            }
                             ctx.fillRect(x, y, currentBlockWidth, currentBlockHeight);

                        } catch (e) {
                            console.error("Error processing block for pixelation:", e);
                        }
                    }
                }
                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => {
                reject(new Error("Failed to load image for pixelation."));
            };
            img.src = imgSrc;
        });
    };

    const performAsciiArt = (
        imgSrc: string, 
        charCellSize: number,
        customCharRampString: string,
        contrastValue: number,
        enableColor: boolean
    ): Promise<{ svgDataUrl: string, rawText: string }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            let rampToUse = [...DEFAULT_ASCII_CHAR_ARRAY]; 
            if (customCharRampString && customCharRampString.trim().length > 0) {
                const userRamp = customCharRampString.split('');
                if (userRamp.length > 0) {
                    rampToUse = userRamp;
                }
            }

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error("Could not get canvas context for ASCII art."));
                    return;
                }
                ctx.drawImage(img, 0, 0);

                const numCharsAcross = Math.floor(img.width / charCellSize);
                const numCharsDown = Math.floor(img.height / charCellSize);
                const asciiRowsForRawText: string[] = [];
                
                const fontSize = 10; // SVG font size
                const svgCharRenderWidth = fontSize * 0.6; 
                const svgCharRenderHeight = fontSize; 

                const svgWidth = numCharsAcross * svgCharRenderWidth;
                const svgHeight = numCharsDown * svgCharRenderHeight;

                let svgTextContentElements = '';

                for (let yIdx = 0; yIdx < numCharsDown; yIdx++) {
                    let currentRowForRawText = '';
                    for (let xIdx = 0; xIdx < numCharsAcross; xIdx++) {
                        const startX = xIdx * charCellSize;
                        const startY = yIdx * charCellSize;
                        let avgR = 0, avgG = 0, avgB = 0;
                        
                        try {
                            const imageData = ctx.getImageData(startX, startY, charCellSize, charCellSize);
                            const data = imageData.data;
                            let rSum = 0, gSum = 0, bSum = 0, count = 0;

                            for (let i = 0; i < data.length; i += 4) {
                                rSum += data[i];
                                gSum += data[i+1];
                                bSum += data[i+2];
                                count++;
                            }

                            if (count === 0) {
                                currentRowForRawText += ' ';
                                if (enableColor) {
                                     const svgX = xIdx * svgCharRenderWidth;
                                     const svgY = (yIdx * svgCharRenderHeight) + (svgCharRenderHeight * 0.8);
                                     svgTextContentElements += `<text x="${svgX}" y="${svgY}" fill="rgb(0,0,0)" class="ascii-char"> </text>\n`; // Use background or transparent? For now, black on dark.
                                }
                                continue;
                            }

                            avgR = rSum / count;
                            avgG = gSum / count;
                            avgB = bSum / count;
                            let brightness = (avgR + avgG + avgB) / 3; 

                            const contrastFactor = (100.0 + contrastValue) / 100.0;
                            let adjustedBrightness = ((brightness - 127.5) * contrastFactor) + 127.5;
                            adjustedBrightness = Math.max(0, Math.min(255, adjustedBrightness)); 

                            const rampLength = rampToUse.length;
                            const charIndex = rampLength > 0 ?
                                Math.min(rampLength - 1, Math.floor((adjustedBrightness / 255) * rampLength))
                                : 0;
                            
                            const charToRender = rampLength > 0 ? rampToUse[charIndex] : ' ';
                            currentRowForRawText += charToRender;

                            if (enableColor) {
                                const charColor = `rgb(${Math.round(avgR)}, ${Math.round(avgG)}, ${Math.round(avgB)})`;
                                const svgX = xIdx * svgCharRenderWidth;
                                const svgY = (yIdx * svgCharRenderHeight) + (svgCharRenderHeight * 0.8);
                                svgTextContentElements += `<text x="${svgX}" y="${svgY}" fill="${charColor}" class="ascii-char">${escapeHtml(charToRender)}</text>\n`;
                            }

                        } catch (e) {
                            console.error("Error processing block for ASCII:", e);
                            currentRowForRawText += '?'; 
                             if (enableColor) {
                                const svgX = xIdx * svgCharRenderWidth;
                                const svgY = (yIdx * svgCharRenderHeight) + (svgCharRenderHeight * 0.8);
                                svgTextContentElements += `<text x="${svgX}" y="${svgY}" fill="rgb(255,0,0)" class="ascii-char">?</text>\n`; // Error char in red
                            }
                        }
                    }
                    asciiRowsForRawText.push(currentRowForRawText);
                    if (!enableColor) {
                        svgTextContentElements += `<text x="0" y="${(yIdx * svgCharRenderHeight) + (svgCharRenderHeight * 0.8)}" class="ascii-char">${escapeHtml(currentRowForRawText)}</text>\n`;
                    }
                }

                const rawText = asciiRowsForRawText.join('\n');
                
                const svgStyle = enableColor ? 
                    `<style> .ascii-char { font-family: 'Courier New', Courier, monospace; font-size: ${fontSize}px; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; } </style>`
                    :
                    `<style> .ascii-char { font-family: 'Courier New', Courier, monospace; font-size: ${fontSize}px; fill: #f0f0f0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;} </style>`;

                const svgString = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
                        ${svgStyle}
                        <rect width="100%" height="100%" fill="#1a1a1a"/>
                        ${svgTextContentElements}
                    </svg>
                `.trim();
                
                const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
                
                resolve({ svgDataUrl, rawText });
            };
            img.onerror = () => {
                reject(new Error("Failed to load image for ASCII conversion."));
            };
            img.src = imgSrc;
        });
    };

    const extractImageData = (dataUrl: string): { mimeType: string, data: string } | null => {
        const parts = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
        if (parts && parts.length === 3) {
            return { mimeType: parts[1], data: parts[2] };
        }
        console.error("Invalid data URL format for image extraction.");
        return null;
    };

    const createSvgFromText = (text: string, width: number = 400, height: number = 300): string => {
        const escapedText = escapeHtml(text);
        const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                <rect width="100%" height="100%" fill="#1a1a1a"/>
                <foreignObject width="100%" height="100%">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="
                        color: #f0f0f0; 
                        font-family: sans-serif; 
                        font-size: 14px; 
                        padding: 15px; 
                        height: 100%; 
                        box-sizing: border-box; 
                        overflow-y: auto; 
                        white-space: pre-wrap; 
                        word-wrap: break-word;
                        border: 1px solid #333;
                        border-radius: 4px;
                    ">
                        ${escapedText.replace(/\n/g, '<br />')}
                    </div>
                </foreignObject>
            </svg>
        `.trim();
        return `data:image/svg+xml;base64,${btoa(svgContent)}`;
    };


    const processImage = useCallback(async () => {
        if (!originalImageFile || !originalImage) {
            setError("Please upload an image first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setTransformedImage(null);
        setRawAsciiText(null);

        try {
            console.log(`Processing image with type: ${conversionType}, animation: ${animationTemplate}`);
            let resultDataUrl: string | null = null;

            if (conversionType === 'pixelate') {
                resultDataUrl = await performPixelation(originalImage, pixelBlockSize);
            } else if (conversionType === 'ascii') {
                const asciiResult = await performAsciiArt(originalImage, asciiCharCellSize, asciiCharRamp, asciiContrast, asciiEnableColor);
                resultDataUrl = asciiResult.svgDataUrl;
                setRawAsciiText(asciiResult.rawText);
            } else if (conversionType === 'accurate_render') {
                if (!aiClient) {
                    setError("AI Client not initialized. Check API Key configuration (handled externally).");
                    setIsLoading(false);
                    return;
                }
                if (!originalImage) {
                    setError("Original image data not available for AI processing.");
                    setIsLoading(false);
                    return;
                }

                const imageData = extractImageData(originalImage);
                if (!imageData) {
                    setError("Failed to extract image data for AI processing.");
                    setIsLoading(false);
                    return;
                }

                const imagePart = {
                    inlineData: {
                        mimeType: imageData.mimeType,
                        data: imageData.data,
                    },
                };
                const textPart = {
                    text: "Describe this image in detail, focusing on its key elements, style, composition, and color palette. Provide insights that would be useful for an artist looking to replicate or stylize this image."
                };

                const response: GenerateContentResponse = await aiClient.models.generateContent({
                    model: 'gemini-2.5-flash-preview-04-17',
                    contents: { parts: [imagePart, textPart] },
                });
                
                const aiResponseText = response.text;
                if (aiResponseText) {
                    resultDataUrl = createSvgFromText(aiResponseText);
                } else {
                    setError("AI did not return a text description.");
                }
            } else {
                 // Fallback for unhandled conversion types
                 await new Promise(resolve => setTimeout(resolve, 500)); // Simulate work
                 setError(`Conversion type "${conversionType}" is not yet implemented.`);
                 resultDataUrl = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22150%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20width%3D%22200%22%20height%3D%22150%22%20fill%3D%22%23ccc%22%20/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22monospace%22%20font-size%3D%2210px%22%20fill%3D%22%23000%22%3ENot%20Implemented%3C/text%3E%3C/svg%3E";
            }
            
            setTransformedImage(resultDataUrl);

            if (animationTemplate !== 'none' && resultDataUrl) {
                console.log(`Applying animation: ${animationTemplate}`);
                // Animation logic will go here later
            }

        } catch (e: any) {
            console.error("Processing error:", e);
            let message = 'Unknown error';
            if (e.message) {
                message = e.message;
            } else if (typeof e === 'string') {
                message = e;
            }
            setError(`Failed to process image: ${message}`);
        } finally {
            setIsLoading(false);
        }
    }, [originalImageFile, originalImage, conversionType, animationTemplate, pixelBlockSize, asciiCharCellSize, asciiCharRamp, asciiContrast, asciiEnableColor, aiClient]);

    const handleExport = () => {
        if (!transformedImage && !(conversionType === 'ascii' && rawAsciiText)) {
            setError("No transformed image or ASCII text to export.");
            return;
        }
        setError(null);
        
        setTimeout(() => {
            const link = document.createElement('a');
            let fileName = `transformed_image`;
            let href = transformedImage;

            if (conversionType === 'ascii' && exportFormat === 'txt') {
                 if (!rawAsciiText) {
                    setError("ASCII text not available for export.");
                    return;
                 }
                 fileName = `ascii_art.txt`;
                 const blob = new Blob([rawAsciiText], { type: 'text/plain;charset=utf-8' });
                 href = URL.createObjectURL(blob);
            } else if (conversionType === 'ascii' && exportFormat === 'svg') {
                fileName = `ascii_art.svg`;
                // href is already transformedImage (SVG data URL) for ASCII art
            } else if (exportFormat === 'svg' && transformedImage && transformedImage.startsWith('data:image/svg+xml')) {
                 fileName = `ai_description.svg`;
                 // href is already transformedImage (SVG data URL) for AI description
            }
             else if (transformedImage) {
                 fileName = `transformed_image.${exportFormat}`;
                 // href is already transformedImage for pixelation (PNG)
            } else {
                setError("Cannot determine export content.");
                return;
            }

            if (!href) {
                setError("Export href is not available.");
                return;
            }
            link.href = href;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            if (href.startsWith('blob:')) {
                URL.revokeObjectURL(href);
            }
        }, 100); 
    };

    useEffect(() => {
        if (conversionType !== 'ascii' && (exportFormat === 'txt')) { // SVG can be from AI
            setExportFormat('png'); 
        }
        if (conversionType === 'pixelate' && exportFormat !== 'png' && exportFormat !== 'jpeg' && exportFormat !== 'webp') {
            setExportFormat('png');
        }
         if (conversionType === 'accurate_render' && exportFormat !== 'svg' && exportFormat !== 'png' /* for potential future non-SVG AI output */) {
            setExportFormat('svg');
        }
    }, [conversionType, exportFormat]);

    return (
        <>
            <header>
                <h1>🖼️ Image Transformer & Animator</h1>
            </header>
            <main className="main-content">
                <section className="app-section" aria-labelledby="upload-heading">
                    <h2 id="upload-heading">1. Upload Image</h2>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/jpeg, image/png, image/bmp, image/webp, image/svg+xml"
                        onChange={handleImageUpload}
                        aria-label="Upload an image"
                    />
                     {error && <p className="error-message" role="alert">{error}</p>}
                </section>

                <section className="app-section" aria-labelledby="conversion-heading">
                    <h2 id="conversion-heading">2. Select Conversion Type</h2>
                    <div className="controls-grid">
                        <div className="control-group">
                            <label htmlFor="conversionType">Conversion:</label>
                            <select
                                id="conversionType"
                                value={conversionType}
                                onChange={(e) => setConversionType(e.target.value)}
                                aria-label="Select conversion type"
                            >
                                <option value="pixelate">Pixelation</option>
                                <option value="ascii">ASCII Art</option>
                                <option value="accurate_render">Accurate Rendering (AI)</option>
                            </select>
                        </div>
                        {conversionType === 'pixelate' && (
                            <div className="control-group">
                                <label htmlFor="pixelBlockSize">Pixel Block Size: {pixelBlockSize}px</label>
                                <input
                                    type="range"
                                    id="pixelBlockSize"
                                    min="2"
                                    max="50"
                                    value={pixelBlockSize}
                                    onChange={(e) => setPixelBlockSize(parseInt(e.target.value, 10))}
                                    aria-label="Adjust pixel block size"
                                />
                            </div>
                        )}
                        {conversionType === 'ascii' && (
                            <>
                                <div className="control-group">
                                    <label htmlFor="asciiCharCellSize">Char Cell Size: {asciiCharCellSize}px</label>
                                    <input
                                        type="range"
                                        id="asciiCharCellSize"
                                        min="2"
                                        max="20" 
                                        value={asciiCharCellSize}
                                        onChange={(e) => setAsciiCharCellSize(parseInt(e.target.value, 10))}
                                        aria-label="Adjust ASCII character cell size"
                                    />
                                </div>
                                <div className="control-group">
                                    <label htmlFor="asciiCharRamp">Character Ramp (Dark to Light):</label>
                                    <input
                                        type="text"
                                        id="asciiCharRamp"
                                        value={asciiCharRamp}
                                        onChange={(e) => setAsciiCharRamp(e.target.value)}
                                        placeholder="e.g. @%#*+=-:. "
                                        aria-label="Custom ASCII character ramp"
                                    />
                                </div>
                                <div className="control-group">
                                    <label htmlFor="asciiContrast">Contrast Adjustment: {asciiContrast}</label>
                                    <input
                                        type="range"
                                        id="asciiContrast"
                                        min="-100"
                                        max="100"
                                        value={asciiContrast}
                                        onChange={(e) => setAsciiContrast(parseInt(e.target.value, 10))}
                                        aria-label="Adjust ASCII contrast"
                                    />
                                </div>
                                <div className="control-group">
                                    <label htmlFor="asciiEnableColor" className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            id="asciiEnableColor"
                                            checked={asciiEnableColor}
                                            onChange={(e) => setAsciiEnableColor(e.target.checked)}
                                            aria-label="Enable color for ASCII art"
                                        />
                                        Enable Color
                                    </label>
                                </div>
                            </>
                        )}
                         {conversionType === 'accurate_render' && !aiClient && (
                            <div className="control-group">
                                <p className="warning-message">AI client not available. Check API Key.</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="app-section" aria-labelledby="animation-heading">
                    <h2 id="animation-heading">3. Apply Animation (Optional)</h2>
                     <div className="controls-grid">
                        <div className="control-group">
                            <label htmlFor="animationTemplate">Animation:</label>
                            <select
                                id="animationTemplate"
                                value={animationTemplate}
                                onChange={(e) => setAnimationTemplate(e.target.value)}
                                aria-label="Select animation template"
                            >
                                <option value="none">None</option>
                                <option value="glitch">Glitching</option>
                                <option value="morph">Morphing</option>
                                <option value="overlay">Dynamic Overlays</option>
                                <option value="flicker">Retro Flicker</option>
                                <option value="neon_glow">Neon Glow</option>
                            </select>
                        </div>
                    </div>
                </section>

                 <div className="app-section process-button-section">
                    <button onClick={processImage} disabled={isLoading || !originalImageFile} aria-label="Process the uploaded image">
                        {isLoading ? 'Processing...' : 'Transform Image'}
                    </button>
                 </div>


                <section className="app-section preview-section" aria-labelledby="preview-heading">
                    <h2 id="preview-heading">Preview</h2>
                    {isLoading && <div className="loader" aria-label="Loading preview"></div>}
                    <div className="preview-area">
                        <div className="image-placeholder" aria-label="Original image preview">
                            {originalImage ? <img src={originalImage} alt="Original" /> : 'Original Image'}
                        </div>
                        <div className="image-placeholder" aria-label="Transformed image preview">
                            {transformedImage ? 
                                <img 
                                    src={transformedImage} 
                                    alt="Transformed" 
                                    style={conversionType === 'ascii' ? { imageRendering: 'pixelated', objectFit: 'contain', width: '100%', height: '100%' } : {objectFit: 'contain', width: '100%', height: '100%'}} 
                                />
                                : 'Transformed Image'}
                        </div>
                    </div>
                </section>

                <section className="app-section export-section" aria-labelledby="export-heading">
                    <h2 id="export-heading">4. Export</h2>
                    <div className="controls-grid">
                         <div className="control-group">
                            <label htmlFor="exportFormat">Format:</label>
                            <select
                                id="exportFormat"
                                value={exportFormat}
                                onChange={(e) => setExportFormat(e.target.value)}
                                aria-label="Select export format"
                                disabled={!transformedImage && !(conversionType === 'ascii' && rawAsciiText)}
                            >
                                <option value="png">PNG</option>
                                <option value="jpeg">JPG</option>
                                <option value="webp">WebP</option> 
                                <option value="gif">GIF</option> 
                                {conversionType === 'ascii' && <option value="txt">TXT (ASCII)</option>}
                                {(conversionType === 'ascii' || conversionType === 'accurate_render') && <option value="svg">SVG</option>}
                            </select>
                        </div>
                        <button onClick={handleExport} disabled={isLoading || (!transformedImage && !(conversionType === 'ascii' && rawAsciiText))} aria-label="Export the transformed image">
                            {isLoading ? 'Exporting...' : 'Export Image'}
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
};

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<React.StrictMode><App /></React.StrictMode>);
} else {
    console.error('Failed to find the root element');
}

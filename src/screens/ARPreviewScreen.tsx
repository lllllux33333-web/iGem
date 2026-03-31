import React, { useEffect, useRef, useState } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

// Exponential Moving Average helper
class EMA {
  alpha: number;
  value: number | null;

  constructor(alpha: number) {
    this.alpha = alpha;
    this.value = null;
  }

  update(newValue: number) {
    if (this.value === null) {
      this.value = newValue;
    } else {
      this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
    }
    return this.value;
  }

  reset() {
    this.value = null;
  }
}

export default function ARPreviewScreen({ model, onCheckout, onRegenerate }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [ringPosition, setRingPosition] = useState<{ x: number, y: number } | null>(null);
  const [isTrackingReady, setIsTrackingReady] = useState(false);
  const [trackingScore, setTrackingScore] = useState<number>(0);

  // Use refs for EMA to persist across renders without triggering re-renders
  const emaX = useRef(new EMA(0.3)); // Lower alpha = smoother but more lag
  const emaY = useRef(new EMA(0.3));

  useEffect(() => {
    let stream: MediaStream | null = null;
    let detector: handPoseDetection.HandDetector | null = null;
    let animationFrameId: number;

    async function startCameraAndTracking() {
      try {
        // 1. Start Camera
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for video to be ready
          await new Promise((resolve) => {
            if (!videoRef.current) return;
            videoRef.current.onloadedmetadata = () => {
              resolve(true);
            };
          });
        }

        // 2. Load Hand Pose Model
        await tf.ready();
        const modelType = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig: handPoseDetection.MediaPipeHandsTfjsModelConfig = {
          runtime: 'tfjs',
          modelType: 'lite',
          maxHands: 1,
        };
        detector = await handPoseDetection.createDetector(modelType, detectorConfig);
        setIsTrackingReady(true);

        // 3. Start Tracking Loop
        let isDetecting = false;
        async function detectFrame() {
          if (videoRef.current && detector && videoRef.current.readyState >= 2 && !isDetecting) {
            isDetecting = true;
            try {
              const video = videoRef.current;
              const videoWidth = video.videoWidth;
              const videoHeight = video.videoHeight;
              
              if (videoWidth > 0 && videoHeight > 0) {
                const hands = await detector.estimateHands(video);
                
                if (hands.length > 0) {
                  const hand = hands[0];
                  setTrackingScore(hand.score || 0);

                  // Ring finger MCP is 13, PIP is 14. We place the ring between them.
                  const mcp = hand.keypoints.find(kp => kp.name === 'ring_finger_mcp') || hand.keypoints[13]; 
                  const pip = hand.keypoints.find(kp => kp.name === 'ring_finger_pip') || hand.keypoints[14];
                  
                  if (mcp && pip) {
                    const targetX = (mcp.x + pip.x) / 2;
                    const targetY = (mcp.y + pip.y) / 2;

                    // Calculate position based on object-cover scaling
                    const rectWidth = video.clientWidth;
                    const rectHeight = video.clientHeight;
                    
                    const scale = Math.max(rectWidth / videoWidth, rectHeight / videoHeight);
                    const xOffset = (rectWidth - videoWidth * scale) / 2;
                    const yOffset = (rectHeight - videoHeight * scale) / 2;

                    const screenX = targetX * scale + xOffset;
                    const screenY = targetY * scale + yOffset;

                    // Since video is mirrored via CSS, we mirror the X coordinate
                    const mirroredX = rectWidth - screenX;

                    if (!isNaN(mirroredX) && !isNaN(screenY)) {
                      // Apply EMA smoothing
                      const smoothedX = emaX.current.update(mirroredX);
                      const smoothedY = emaY.current.update(screenY);
                      
                      if (smoothedX !== null && smoothedY !== null) {
                        setRingPosition({ x: smoothedX, y: smoothedY });
                      }
                    }
                  }
                } else {
                  setRingPosition(null);
                  setTrackingScore(0);
                  emaX.current.reset();
                  emaY.current.reset();
                }
              }
            } catch (err) {
              console.error("Tracking error:", err);
            }
            isDetecting = false;
          }
          animationFrameId = requestAnimationFrame(detectFrame);
        }

        detectFrame();

      } catch (err) {
        console.error("Error accessing camera or loading model:", err);
        setError("Could not initialize AR tracking. Please allow camera permissions.");
      }
    }

    startCameraAndTracking();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (detector) {
        detector.dispose();
      }
    };
  }, []);

  // Determine tracking quality color
  let trackingColor = 'bg-yellow-400';
  let trackingText = 'Show your hand';
  if (isTrackingReady) {
    if (trackingScore > 0.8) {
      trackingColor = 'bg-green-500';
      trackingText = 'Excellent Tracking';
    } else if (trackingScore > 0.5) {
      trackingColor = 'bg-green-300';
      trackingText = 'Good Tracking';
    } else if (ringPosition) {
      trackingColor = 'bg-orange-400';
      trackingText = 'Poor Tracking';
    }
  } else {
    trackingText = 'Initializing AR...';
  }

  return (
    <div className="h-full flex flex-col relative bg-black overflow-hidden">
      {/* Real Camera View */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center bg-gray-900">
          <AlertCircle size={48} className="text-red-400 mb-4" />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          style={{ transform: 'scaleX(-1)' }}
        />
      )}
      
      {/* AR Overlay UI */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        <div className="flex flex-col items-center pointer-events-auto gap-2">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${trackingColor} ${isTrackingReady && ringPosition ? 'animate-pulse' : ''}`} />
            {trackingText}
          </div>
          {ringPosition && (
            <div className="w-32 h-1 bg-black/40 rounded-full overflow-hidden">
              <div 
                className={`h-full ${trackingColor} transition-all duration-300`} 
                style={{ width: `${trackingScore * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Dynamic Jewelry Overlay */}
        <div 
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center pointer-events-none transition-all duration-75 ease-out ${ringPosition ? '' : 'top-1/2 left-1/2'}`}
          style={ringPosition ? { 
            left: `${ringPosition.x}px`, 
            top: `${ringPosition.y}px` 
          } : {}}
        >
          {!ringPosition && (
            <div className="absolute inset-0 border-2 border-dashed border-white/30 rounded-full animate-[spin_10s_linear_infinite]" />
          )}
          <img 
            src={model?.image || "https://images.unsplash.com/photo-1605100804763-247f66156ce4?auto=format&fit=crop&q=80&w=200"} 
            alt="Jewelry" 
            className={`w-20 h-20 object-cover rounded-full mix-blend-screen shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all ${!ringPosition ? 'opacity-50 animate-pulse' : 'opacity-100'}`}
          />
          {!ringPosition && (
            <div className="absolute -bottom-8 whitespace-nowrap text-white text-xs bg-black/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
              Place hand in view to try on
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-2xl pointer-events-auto mt-auto">
          <h3 className="font-serif text-xl mb-2 text-center">Do you like this fit?</h3>
          <p className="text-sm text-gray-500 text-center mb-6">High-precision AR fit verification</p>
          
          <div className="flex gap-4">
            <button 
              onClick={onRegenerate}
              className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-700 font-medium flex flex-col items-center gap-1"
            >
              <X size={20} />
              <span className="text-xs">Regenerate</span>
            </button>
            <button 
              onClick={onCheckout}
              className="flex-1 py-4 rounded-2xl bg-[#3A2E2A] text-white font-medium flex flex-col items-center gap-1 shadow-lg"
            >
              <Check size={20} />
              <span className="text-xs">Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';

let landmarkerInstance = null;
let initPromise = null;
let isInitializing = false;

// Exponential moving average buffer for jitter-free 60fps AR tracking
const faceStateCache = new Map();

/**
 * Initialize MediaPipe FaceLandmarker
 * Prioritizes local wasm & models for instant offline startup, with CDN fallback.
 */
export async function initFaceLandmarker() {
  if (landmarkerInstance) return landmarkerInstance;
  if (initPromise) return initPromise;

  isInitializing = true;
  initPromise = (async () => {
    // 1. Try local wasm first
    let vision = null;
    try {
      vision = await FilesetResolver.forVisionTasks('/mediapipe/wasm');
    } catch (e1) {
      console.warn('Local wasm resolver failed, falling back to CDN:', e1);
      vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm'
      );
    }

    // 2. Try loading model (local first, then Google Storage CDN)
    const modelPaths = [
      '/mediapipe/models/face_landmarker.task',
      'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
    ];

    let createdInstance = null;
    let lastError = null;

    for (const modelPath of modelPaths) {
      try {
        // Try GPU delegate first
        createdInstance = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: modelPath,
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numFaces: 3,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFaceBlendshapes: false
        });
        if (createdInstance) break;
      } catch (gpuErr) {
        console.warn(`GPU delegate failed with ${modelPath}, trying CPU fallback:`, gpuErr);
        try {
          createdInstance = await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: modelPath,
              delegate: 'CPU'
            },
            runningMode: 'VIDEO',
            numFaces: 3,
            minFaceDetectionConfidence: 0.5,
            minFacePresenceConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          if (createdInstance) break;
        } catch (cpuErr) {
          lastError = cpuErr;
        }
      }
    }

    if (!createdInstance) {
      isInitializing = false;
      initPromise = null;
      throw lastError || new Error('Failed to initialize FaceLandmarker');
    }

    landmarkerInstance = createdInstance;
    isInitializing = false;
    return landmarkerInstance;
  })();

  return initPromise;
}

/**
 * Check if the landmarker is ready
 */
export function isLandmarkerReady() {
  return !!landmarkerInstance;
}

/**
 * Detect facial landmarks for a video frame and compute head pose geometry
 * @param {HTMLVideoElement} videoElement
 * @param {number} timestampMs
 * @param {number} targetWidth
 * @param {number} targetHeight
 * @returns {Array<FacePose>|null}
 */
export function detectFacePoses(videoElement, timestampMs, targetWidth, targetHeight) {
  if (!landmarkerInstance || !videoElement || videoElement.readyState < 2) {
    return null;
  }

  try {
    const results = landmarkerInstance.detectForVideo(videoElement, timestampMs);
    if (!results || !results.faceLandmarks || results.faceLandmarks.length === 0) {
      return [];
    }

    const w = targetWidth || videoElement.videoWidth || 640;
    const h = targetHeight || videoElement.videoHeight || 480;

    return results.faceLandmarks.map((rawLandmarks, faceIndex) => {
      // Landmark indices in MediaPipe Face Mesh:
      // 10: Forehead top / hairline
      // 151: Mid forehead
      // 9: Glabella (between eyebrows)
      // 168: Nose bridge top
      // 6: Nose bridge mid
      // 4: Nose tip
      // 1: Sub-nasale / tip
      // 152: Chin bottom
      // 33: Left eye outer corner
      // 263: Right eye outer corner
      // 133: Left eye inner corner
      // 362: Right eye inner corner
      // 234: Left cheekbone
      // 454: Right cheekbone
      // 116: Left cheek center
      // 345: Right cheek center

      const pt = (idx) => {
        const p = rawLandmarks[idx];
        return p ? { x: p.x * w, y: p.y * h, z: p.z * w } : { x: 0, y: 0, z: 0 };
      };

      const eyeLeft = pt(33);
      const eyeRight = pt(263);
      const forehead = pt(10);
      const midForehead = pt(151);
      const glabella = pt(9);
      const noseBridge = pt(168);
      const noseTip = pt(4);
      const subnasale = pt(1);
      const chin = pt(152);
      const leftCheek = pt(234);
      const rightCheek = pt(454);
      const leftCheekMid = pt(116);
      const rightCheekMid = pt(345);

      // True cheek apples below eyes (NOT outer ear tragus 234/454)
      const p117 = pt(117);
      const p50 = pt(50);
      const p346 = pt(346);
      const p280 = pt(280);
      const leftCheekApple = {
        x: p117.x * 0.6 + p50.x * 0.4,
        y: p117.y * 0.6 + p50.y * 0.4
      };
      const rightCheekApple = {
        x: p346.x * 0.6 + p280.x * 0.4,
        y: p346.y * 0.6 + p280.y * 0.4
      };

      // Eye vector and roll angle
      const edx = eyeRight.x - eyeLeft.x;
      const edy = eyeRight.y - eyeLeft.y;
      const eyeDist = Math.hypot(edx, edy) || 1;
      const rawAngle = Math.atan2(edy, edx);

      // Up vector (perpendicular to eye line pointing towards top of head)
      // When level (angle = 0): edx > 0, edy = 0. Up vector should be (0, -1).
      const upX = Math.sin(rawAngle);
      const upY = -Math.cos(rawAngle);

      // Face height vector
      const faceHeight = Math.hypot(chin.x - forehead.x, chin.y - forehead.y) || eyeDist * 1.6;

      // Temporal smoothing (EMA) to prevent high-frequency jitter
      const cacheKey = `face_${faceIndex}`;
      let cached = faceStateCache.get(cacheKey);
      const alpha = 0.68; // Smoothing factor (0.68 responsive yet silky smooth)

      if (!cached) {
        cached = {
          angle: rawAngle,
          eyeDist,
          faceHeight,
          forehead: { ...forehead },
          midForehead: { ...midForehead },
          noseTip: { ...noseTip },
          leftCheek: { ...leftCheek },
          rightCheek: { ...rightCheek },
          leftCheekApple: { ...leftCheekApple },
          rightCheekApple: { ...rightCheekApple },
          leftCheekMid: { ...leftCheekMid },
          rightCheekMid: { ...rightCheekMid },
          noseBridge: { ...noseBridge },
          upX,
          upY
        };
      } else {
        // Handle angle wrap-around
        let diff = rawAngle - cached.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        cached.angle += diff * alpha;

        cached.eyeDist += (eyeDist - cached.eyeDist) * alpha;
        cached.faceHeight += (faceHeight - cached.faceHeight) * alpha;
        cached.upX += (upX - cached.upX) * alpha;
        cached.upY += (upY - cached.upY) * alpha;

        const smoothPt = (target, source) => {
          target.x += (source.x - target.x) * alpha;
          target.y += (source.y - target.y) * alpha;
        };

        smoothPt(cached.forehead, forehead);
        smoothPt(cached.midForehead, midForehead);
        smoothPt(cached.noseTip, noseTip);
        smoothPt(cached.leftCheek, leftCheek);
        smoothPt(cached.rightCheek, rightCheek);
        smoothPt(cached.leftCheekApple, leftCheekApple);
        smoothPt(cached.rightCheekApple, rightCheekApple);
        smoothPt(cached.leftCheekMid, leftCheekMid);
        smoothPt(cached.rightCheekMid, rightCheekMid);
        smoothPt(cached.noseBridge, noseBridge);
      }
      faceStateCache.set(cacheKey, cached);

      // Natural crown of hair and hovering halo positions above hair
      const headTop = {
        x: cached.forehead.x + cached.upX * (cached.eyeDist * 0.72),
        y: cached.forehead.y + cached.upY * (cached.eyeDist * 0.72)
      };
      const hoverCrown = {
        x: cached.forehead.x + cached.upX * (cached.eyeDist * 1.05),
        y: cached.forehead.y + cached.upY * (cached.eyeDist * 1.05)
      };

      return {
        rawLandmarks,
        width: w,
        height: h,
        angle: cached.angle,
        eyeDist: cached.eyeDist,
        faceHeight: cached.faceHeight,
        upVector: { x: cached.upX, y: cached.upY },
        forehead: cached.forehead,
        midForehead: cached.midForehead,
        headTop,
        hoverCrown,
        glabella,
        noseTip: cached.noseTip,
        subnasale,
        leftCheek: cached.leftCheek,
        rightCheek: cached.rightCheek,
        leftCheekApple: cached.leftCheekApple,
        rightCheekApple: cached.rightCheekApple,
        leftCheekMid: cached.leftCheekMid,
        rightCheekMid: cached.rightCheekMid,
        noseBridge: cached.noseBridge,
        chin
      };
    });
  } catch (err) {
    console.error('Error in detectFacePoses:', err);
    return [];
  }
}

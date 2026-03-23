const DEFAULT_LEGACY = {
    enabled: false,
    modelUrl: "",
    modelFormat: "glb",
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
};

const DEFAULT_CALIBRATION = {
    anchorMode: "NOSE_BRIDGE",
    scaleMode: "FACE_WIDTH",
    fitRatio: 0.82,
    offsetIpdX: 0,
    offsetIpdY: 0,
    offsetIpdZ: 0,
    yawBias: 0,
    pitchBias: 0,
    rollBias: 0,
    depthRatio: 0,
};

function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toText(value, fallback) {
    if (typeof value !== "string") return fallback;
    const trimmed = value.trim();
    return trimmed.length ? trimmed : fallback;
}

function toBoolean(value, fallback) {
    if (typeof value === "boolean") return value;
    return fallback;
}

export function mapVirtualTryOnConfig(raw) {
    const source = raw ?? {};

    return {
        enabled: toBoolean(source.enabled, DEFAULT_LEGACY.enabled),
        modelUrl: toText(source.modelUrl, DEFAULT_LEGACY.modelUrl),
        modelFormat: toText(source.modelFormat, DEFAULT_LEGACY.modelFormat),
        scale: toNumber(source.scale, DEFAULT_LEGACY.scale),
        offsetX: toNumber(source.offsetX, DEFAULT_LEGACY.offsetX),
        offsetY: toNumber(source.offsetY, DEFAULT_LEGACY.offsetY),
        offsetZ: toNumber(source.offsetZ, DEFAULT_LEGACY.offsetZ),
        rotationX: toNumber(source.rotationX, DEFAULT_LEGACY.rotationX),
        rotationY: toNumber(source.rotationY, DEFAULT_LEGACY.rotationY),
        rotationZ: toNumber(source.rotationZ, DEFAULT_LEGACY.rotationZ),
        anchorMode: toText(source.anchorMode, DEFAULT_CALIBRATION.anchorMode),
        scaleMode: toText(source.scaleMode, DEFAULT_CALIBRATION.scaleMode),
        fitRatio: toNumber(source.fitRatio, DEFAULT_CALIBRATION.fitRatio),
        offsetIpdX: toNumber(source.offsetIpdX, DEFAULT_CALIBRATION.offsetIpdX),
        offsetIpdY: toNumber(source.offsetIpdY, DEFAULT_CALIBRATION.offsetIpdY),
        offsetIpdZ: toNumber(source.offsetIpdZ, DEFAULT_CALIBRATION.offsetIpdZ),
        yawBias: toNumber(source.yawBias, DEFAULT_CALIBRATION.yawBias),
        pitchBias: toNumber(source.pitchBias, DEFAULT_CALIBRATION.pitchBias),
        rollBias: toNumber(source.rollBias, DEFAULT_CALIBRATION.rollBias),
        depthRatio: toNumber(source.depthRatio, DEFAULT_CALIBRATION.depthRatio),
    };
}

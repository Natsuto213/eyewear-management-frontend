function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function firstNumber(...values) {
    for (const value of values) {
        const parsed = toNumber(value);
        if (parsed !== null) return parsed;
    }
    return null;
}

export function extractFrameMetrics(product) {
    const source = product ?? {};

    const lensWidth = firstNumber(
        source.frameLensWidth,
        source.lensWidth,
        source.Lens_Width
    );

    const bridgeWidth = firstNumber(
        source.frameBridgeWidth,
        source.bridgeWidth,
        source.Bridge_Width
    );

    const templeLength = firstNumber(
        source.frameTempleLength,
        source.templeLength,
        source.Temple_Length
    );

    return {
        lensWidth,
        bridgeWidth,
        templeLength,
    };
}

export function measureTextWidth(text: string | number | boolean, font: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
        context.font = font;
        return context.measureText(text.toString()).width;
    }
    return 0;
}

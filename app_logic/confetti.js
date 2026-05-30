import confetti from "canvas-confetti";

export function doConfettiInRectangle(rectangleHTMLName, numParticles, spread, velocity) {
    const rectangleObject = document.querySelector(rectangleHTMLName)

    const rectDims = rectangleObject.getBoundingClientRect()

    const leftEdgeX = rectDims.left / window.innerWidth
    const rightEdgeX = rectDims.right / window.innerWidth

    const centerY = (rectDims.top + (rectDims.height / 2)) / window.innerHeight

    confetti({
        particleCount: numParticles,
        spread: spread,
        startVelocity: velocity,
        angle: 0,
        origin: {
            x: leftEdgeX,
            y: centerY
        }
    })

    confetti({
        particleCount: numParticles,
        spread: spread,
        startVelocity: velocity,
        angle: 180,
        origin: {
            x: rightEdgeX,
            y: centerY
        }
    })

}
// Resolves when the preloader starts lifting — the hero waits on it to play its entrance.
let resolve
export const introDone = new Promise((r) => (resolve = r))
export const finishIntro = () => resolve()

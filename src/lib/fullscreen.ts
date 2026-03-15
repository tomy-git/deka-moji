export function canUseFullscreen(element: HTMLElement | null): boolean {
  return Boolean(
    element &&
      document.fullscreenEnabled &&
      typeof element.requestFullscreen === "function"
  );
}

export async function enterFullscreen(element: HTMLElement): Promise<boolean> {
  if (!canUseFullscreen(element)) {
    return false;
  }

  try {
    await element.requestFullscreen();
    return true;
  } catch {
    return false;
  }
}

export async function exitFullscreen(): Promise<void> {
  if (!document.fullscreenElement) {
    return;
  }

  try {
    await document.exitFullscreen();
  } catch {
    return;
  }
}


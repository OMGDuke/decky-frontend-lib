import { useState, useEffect } from 'react';

declare global {
  var FocusNavController: any;
}

/**
 * Returns state indicating the visibility of quick access menu.
 *
 * @remarks 
 * During development it is possible to open the quick access menu without giving it
 * focus in some cases. In such cases, the quick access menu state is invisible.
 * 
 * This seems to be impossible to replicate when running the deck normally. Even in
 * the edge cases it always seems to have a focus.
 * 
 * @returns `true` if quick access menu is visible (focused) and `false` otherwise.
 * 
 * @example
 * import { VFC, useEffect } from "react";
 * import { useQuickAccessVisible } from "decky-frontend-lib";
 *
 * export const PluginPanelView: VFC<{}> = ({ }) => {
 *   const isVisible = useQuickAccessVisible();
 *
 *   useEffect(() => {
 *     if (!isVisible) {
 *       return;
 *     }
 *
 *     const interval = setInterval(() => console.log("Hello world!"), 1000);
 *     return () => {
 *       clearInterval(interval);
 *     }
 *   }, [isVisible])
 *
 *   return (
 *     <div>
 *       {isVisible ? "VISIBLE" : "INVISIBLE"}
 *     </div>
 *   );
 * };
 */
export function useQuickAccessVisible(): boolean {
  // Assuming that the component is rendered in QAM already, so true by default...
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const quickAccessWindow: Window | null = FocusNavController?.GetGamepadNavTreeByID("QuickAccess-NA")?.m_Root?.m_element?.ownerDocument.defaultView ?? null;
    if (quickAccessWindow === null) {
      console.error("Could not get window of QuickAccess menu!");
      return;
    }

    const onBlur = () => setIsVisible(false);
    const onFocus = () => setIsVisible(true);

    quickAccessWindow.addEventListener("blur", onBlur);
    quickAccessWindow.addEventListener("focus", onFocus);
    return () => {
      quickAccessWindow.removeEventListener("blur", onBlur);
      quickAccessWindow.removeEventListener("focus", onFocus);
    };
  }, []);

  return isVisible;
}

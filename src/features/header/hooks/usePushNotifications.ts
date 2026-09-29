import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabase-client.service";
import { useUserAuth } from "../../auth/hooks/useUserAuth";

const PUBLIC_VAPID_KEY = "BET51WGO3yb-Uyf2_Vwih5T5OnaNDyfDj70R8iz9EIuDIXEd9wttdk8i7HNXTSulYlYCDY5cSuUuTWyYLUP17e0";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const usePushNotifications = () => {
  const { session } = useUserAuth();
  const userId = session?.user?.id;
  
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      
      navigator.serviceWorker.register("/sw.js").then(swReg => {
        return swReg.pushManager.getSubscription();
      }).then(sub => {
        setIsSubscribed(sub !== null);
      }).catch(err => console.error("Service worker register error:", err));
    }
  }, []);

  const subscribeToPush = async () => {
    if (!isSupported || !userId) return;
    setIsPushing(true);

    try {
      const permissionResult = await Notification.requestPermission();
      if (permissionResult !== "granted") {
        setIsPushing(false);
        return;
      }

      const swReg = await navigator.serviceWorker.ready;
      let subscription = await swReg.pushManager.getSubscription();

      if (!subscription) {
        subscription = await swReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });
      }

      const subJSON = subscription.toJSON();
      
      const { error } = await supabase.from("user_push_subscriptions").upsert({
         user_id: userId,
         endpoint: subJSON.endpoint,
         p256dh: subJSON.keys?.p256dh,
         auth: subJSON.keys?.auth,
         user_agent: navigator.userAgent
      }, { onConflict: "endpoint" });
      
      if (error) {
         console.error("DB error saving sub:", error);
         throw error;
      }

      setIsSubscribed(true);
    } catch (err) {
      console.error("Error subscribing to push:", err);
    } finally {
      setIsPushing(false);
    }
  };

  return { isSupported, isSubscribed, isPushing, subscribeToPush };
};

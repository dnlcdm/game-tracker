// public/sw.js
const SW_VERSION = "2.1-premium"; // Versão atualizada

self.addEventListener("push", function (event) {
  event.waitUntil(
    (async () => {
      let title = "Notificação Padrão";
      let body = "Você tem atualizações no app.";
      let url = "/backlog";
      let image = undefined;
      let actions = [];
      let tag = undefined;
      let requireInteraction = false;

      try {
        if (event.data) {
          const text = event.data.text();
          try {
            const data = JSON.parse(text);
            title = data.title || title;
            body = data.message || text;
            url = data.url || url;
            image = data.image; 
            actions = data.actions || []; 
            tag = data.tag; 
            requireInteraction = data.requireInteraction === true;
          } catch (e) {
            body = text;
          }
        }

        const options = {
          body: body,
          icon: "/pwa/pwa-192x192.png", 
          badge: "/pwa/badge-monochrome.png",
          vibrate: [100, 50, 100, 50, 100],
          data: { url: url }
        };

        if (image) options.image = image;
        if (tag) options.tag = tag;
        if (actions && actions.length > 0) options.actions = actions;
        if (requireInteraction) options.requireInteraction = requireInteraction;

        await self.registration.showNotification(title, options);
      } catch (err) {
        console.error(`[SW ${SW_VERSION}] Falha silenciosa na notificação:`, err);
      }
    })()
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  
  event.waitUntil(
    (async () => {
      const baseUrl = self.location.origin;
      let finalUrl = event.notification.data.url;

      if (event.action) {
        if (event.action === "close" || event.action === "dismiss") return;
        
        finalUrl = event.action; 
      }

      const targetUrl = new URL(finalUrl, baseUrl).href;

      const clientList = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      
      if (clientList.length > 0) {
        let client = clientList.find(c => c.url === targetUrl); 
        if (!client) {
            client = clientList[0]; 
        }
        
        if ("focus" in client) await client.focus();
        
        if (client.url !== targetUrl && "navigate" in client) {
            await client.navigate(targetUrl);
        }
        return;
      }
      
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })()
  );
});
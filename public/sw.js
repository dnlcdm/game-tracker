// public/sw.js

self.addEventListener("push", function (event) {
  event.waitUntil(
    (async () => {
      let title = "Notificação (Fallback)";
      let body = "Você tem atualizações no app.";
      let url = "/backlog";

      try {
        if (event.data) {
          const text = event.data.text();
          try {
            const data = JSON.parse(text);
            title = data.title || title;
            body = data.message || text;
            url = data.url || url;
          } catch (e) {
            body = text;
          }
        }

        await self.registration.showNotification(title, {
          body: body,
          icon: "/pwa/pwa-192x192.png",
          badge: "/pwa/pwa-192x192.png",
          vibrate: [100, 50, 100, 50, 100],
          data: { url: url }
        });
      } catch (err) {
        await self.registration.showNotification("Erro Crítico no SW", {
          body: String(err.message || err)
        });
      }
    })()
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      const baseUrl = self.location.origin;
      const targetUrl = new URL(event.notification.data.url, baseUrl).href;

      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

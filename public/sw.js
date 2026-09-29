// public/sw.js

self.addEventListener("push", function (event) {
  if (event.data) {
    var data = null;
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "Nova Notificação", message: event.data.text() };
    }

    const options = {
      body: data.message,
      icon: "/pwa/pwa-192x192.png", 
      badge: "/pwa/pwa-192x192.png", 
      vibrate: [100, 50, 100, 50, 100],
      data: {
        url: data.url || "/"
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
      const urlToOpen = event.notification.data.url;
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

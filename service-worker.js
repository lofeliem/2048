// const CACHE_NAME = "2048-cache-v1";
// const urlsToCache = [
//   "/",
//   "/index.html",
//   "/index.js",
//   "/style.css",
//   "/manifest.json",
//   "/icons/icon-192.png",
//   "/icons/icon-512.png"
// ];

// // 安装时缓存静态资源
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// // 拦截 fetch 请求返回缓存
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

// // 更新时清理旧缓存
// self.addEventListener("activate", (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((name) => {
//           if (name !== CACHE_NAME) {
//             return caches.delete(name);
//           }
//         })
//       );
//     })
//   );
// });

const TARGET = "https://english-daily-7f3.pages.dev/api/cron";

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(fetch(TARGET, { method: "POST" }).then((r) => r.text()).then((t) => console.log("cron:", t)));
  },
  async fetch() {
    return new Response("English Daily reminder clock: wakes " + TARGET + " every hour.");
  },
};

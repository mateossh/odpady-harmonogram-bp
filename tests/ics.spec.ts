import { test, expect } from "@playwright/test";

test.describe("ics", () => {
  test("GET /schedule.ics returns valid ICS file", async ({ request }) => {
    const response = await request.get("http://localhost:4321/schedule.ics");

    await test.step("verify response headers", async () => {
      expect(response.ok(), "is http status 200").toBeTruthy();
      expect(response.headers()["content-type"], "has proper content-type").toContain(
        "text/calendar",
      );
      expect(response.headers()["content-disposition"], "has proper content-disposition").toContain(
        'filename="schedule.ics"',
      );
    });

    await test.step("ics file has content", async () => {
      const content = await response.text();

      expect(content, "starts with `BEGIN:VCALENDAR`").toMatch(/^BEGIN\:VCALENDAR/);

      // NOTE: allow trailing line ending
      expect(content, "ends with `END:VCALENDAR`").toMatch(/END:VCALENDAR\r?\n?$/);
    });
  });
});

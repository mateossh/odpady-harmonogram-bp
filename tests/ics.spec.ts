import { test, expect } from "@playwright/test";

test.describe("ics", () => {
  test("GET /schedule.ics returns ICS with expected headers and structure", async ({ request }) => {
    const response = await request.get("/schedule.ics");

    await test.step("verify response headers", async () => {
      expect(response, "is http status 200").toBeOK();
      expect(response.headers()["content-type"], "has proper content-type").toContain(
        "text/calendar",
      );
      expect(response.headers()["content-disposition"], "has proper content-disposition").toContain(
        'filename="schedule.ics"',
      );
    });

    await test.step("ics file has content", async () => {
      const content = await response.text();

      expect(content, "starts with `BEGIN:VCALENDAR`").toMatch(/^BEGIN:VCALENDAR/);

      // NOTE: allow trailing line ending
      expect(content, "ends with `END:VCALENDAR`").toMatch(/END:VCALENDAR\r?\n?$/);
    });
  });
});

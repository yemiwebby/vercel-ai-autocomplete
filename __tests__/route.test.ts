import { POST } from "../src/app/api/autocomplete/route";
import { NextRequest } from "next/server";

vi.mock("../src/lib/autocomplete", () => ({
  generateAutocomplete: vi.fn(() => Promise.resolve("mocked autocomplete response")),
}));

function mockRequest(body: { prompt?: string }): NextRequest {
  return { json: async () => body } as NextRequest;
}

describe("POST /api/autocomplete", () => {
  it("returns a suggestion for valid prompt", async () => {
    const req = mockRequest({ prompt: "react us" });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.completion).toContain("mocked autocomplete response");
  });

  it("returns 400 for missing prompt", async () => {
    const req = mockRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

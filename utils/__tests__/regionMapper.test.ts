import { groupByRegion } from "@/utils/regionMapper";

describe("groupByRegion", () => {
  it("groups known provinces by mapped regions", () => {
    const result = groupByRegion(["Chiang Mai", "Bangkok", "Krabi"]);

    expect(result).toEqual({
      North: ["Chiang Mai"],
      Central: ["Bangkok"],
      South: ["Krabi"],
    });
  });

  it("puts unknown provinces in Other", () => {
    const result = groupByRegion(["Atlantis"]);
    expect(result).toEqual({ Other: ["Atlantis"] });
  });

  it("returns empty object for empty list", () => {
    expect(groupByRegion([])).toEqual({});
  });
});

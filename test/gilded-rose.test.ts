import { Item, updateQuality, qualityStepObject } from "../src/gilded-rose";

const CONCERT_QUALITY_STEPS: qualityStepObject = {
  "1..5": 3,
  "6..10": 2,
  "11..Infinity": 1,
};

describe("Gilded Rose", function () {
  describe("Majority of Items", function () {
    test("should degrade quality of item twice as fast, after sellIn date passed", function () {
      const items = [new Item("+5 Dexterity Vest", 0, 4)];
      updateQuality(items);
      expect(items[0].sellIn).toBe(-1);
      expect(items[0].quality).toBe(2);
    });

    it("Quality of item is never negative", function () {
      const items = [new Item("+5 Dexterity Vest", 10, 0)];
      updateQuality(items);
      expect(items[0].sellIn).toBe(9);
      expect(items[0].quality).toBe(0);
    });

    it("Quality of item is never more than 50", function () {
      const items = [
        new Item("Backstage passes to a TAFKAL80ETC concert", 5, 48, CONCERT_QUALITY_STEPS, true),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(4);
      expect(items[0].quality).toBe(50);
    });
  });

  describe("Aged Brie", function () {
    it("increases in Quality the older it gets", function () {
      const items = [new Item("Aged Brie", 20, 0, undefined, true)];
      updateQuality(items);
      expect(items[0].sellIn).toBe(19);
      expect(items[0].quality).toBe(1);
    });
  });

  describe("Sulfurus (Legendary Item)", function () {
    it("never has to be sold or decreases in Quality", function () {
      const items = [
        new Item(
          "Sulfuras, Hand of Ragnaros",
          0,
          80,
          undefined,
          undefined,
          true
        ),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(0);
      expect(items[0].quality).toBe(80);
    });
  });

  describe("Backstage passes", function () {
    it("increases in Quality as its SellIn value approaches", function () {
      const items = [
        new Item(
          "Backstage passes to a TAFKAL80ETC concert",
          15,
          20,
          undefined,
          true
        ),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(14);
      expect(items[0].quality).toBe(21);
    });

    it("increases in Quality by 2 when there are 10 days or less", function () {
      const items = [
        new Item(
          "Backstage passes to a TAFKAL80ETC concert",
          10,
          2,
          CONCERT_QUALITY_STEPS,
          true
        ),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(9);
      expect(items[0].quality).toBe(4);
    });

    it("increases in Quality by 3 when there are 5 days or less", function () {
      const items = [
        new Item(
          "Backstage passes to a TAFKAL80ETC concert",
          5,
          7,
          CONCERT_QUALITY_STEPS,
          true
        ),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(4);
      expect(items[0].quality).toBe(10);
    });

    it("drops to 0 Quality after the concert", function () {
      const items = [
        new Item(
          "Backstage passes to a TAFKAL80ETC concert",
          0,
          40,
          CONCERT_QUALITY_STEPS,
          true,
          undefined,
          0
        ),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(-1);
      expect(items[0].quality).toBe(0);
    });
  });

  describe("Conjured Item", function () {
    it("degrades in Quality twice as fast as normal items", function () {
      const items = [new Item("Conjured Mana Cake", 3, 6, 2)];
      updateQuality(items);
      expect(items[0].sellIn).toBe(2);
      expect(items[0].quality).toBe(4);
    });
  });
});

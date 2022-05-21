import { Item, updateQuality, qualityStepObject } from "../src/gilded-rose";

const CONCERT_QUALITY_STEPS: qualityStepObject = {
  "1..5": 3,
  "6..10": 2,
  "11..Infinity": 1,
};

describe("Gilded Rose", function () {
  describe("Majority of Items", function () {
    test("should degrade quality of item twice as fast, after sellIn date passed", function () {
      const items = [
        new Item({ name: "+5 Dexterity Vest", sellIn: 0, quality: 4 }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(-1);
      expect(items[0].quality).toBe(2);
    });

    it("Quality of item is never negative", function () {
      const items = [
        new Item({ name: "+5 Dexterity Vest", sellIn: 10, quality: 0 }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(9);
      expect(items[0].quality).toBe(0);
    });

    it("Quality of item is never more than 50", function () {
      const items = [
        new Item({
          name: "Backstage passes to a TAFKAL80ETC concert",
          sellIn: 5,
          quality: 48,
          qualityStep: CONCERT_QUALITY_STEPS,
          appreciateOnAging: true,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(4);
      expect(items[0].quality).toBe(50);
    });
  });

  describe("Aged Brie", function () {
    it("increases in Quality the older it gets", function () {
      const items = [
        new Item({
          name: "Aged Brie",
          sellIn: 20,
          quality: 0,
          qualityStep: undefined,
          appreciateOnAging: true,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(19);
      expect(items[0].quality).toBe(1);
    });
  });

  describe("Sulfurus (Legendary Item)", function () {
    it("never has to be sold or decreases in Quality", function () {
      const items = [
        new Item({
          name: "Sulfuras, Hand of Ragnaros",
          sellIn: 0,
          quality: 80,
          qualityStep: undefined,
          appreciateOnAging: undefined,
          legendary: true,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(0);
      expect(items[0].quality).toBe(80);
    });
  });

  describe("Backstage passes", function () {
    it("increases in Quality as its SellIn value approaches", function () {
      const items = [
        new Item({
          name: "Backstage passes to a TAFKAL80ETC concert",
          sellIn: 15,
          quality: 20,
          qualityStep: undefined,
          appreciateOnAging: true,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(14);
      expect(items[0].quality).toBe(21);
    });

    it("increases in Quality by 2 when there are 10 days or less", function () {
      const items = [
        new Item({
          name: "Backstage passes to a TAFKAL80ETC concert",
          sellIn: 10,
          quality: 2,
          qualityStep: CONCERT_QUALITY_STEPS,
          appreciateOnAging: true,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(9);
      expect(items[0].quality).toBe(4);
    });

    it("increases in Quality by 3 when there are 5 days or less", function () {
      const items = [
        new Item({
          name: "Backstage passes to a TAFKAL80ETC concert",
          sellIn: 5,
          quality: 7,
          qualityStep: CONCERT_QUALITY_STEPS,
          appreciateOnAging: true,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(4);
      expect(items[0].quality).toBe(10);
    });

    it("drops to 0 Quality after the concert", function () {
      const items = [
        new Item({
          name: "Backstage passes to a TAFKAL80ETC concert",
          sellIn: 0,
          quality: 40,
          qualityStep: CONCERT_QUALITY_STEPS,
          appreciateOnAging: true,
          legendary: undefined,
          qualityOnExpiry: 0,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(-1);
      expect(items[0].quality).toBe(0);
    });
  });

  describe("Conjured Item", function () {
    it("degrades in Quality twice as fast as normal items", function () {
      const items = [
        new Item({
          name: "Conjured Mana Cake",
          sellIn: 3,
          quality: 6,
          qualityStep: 2,
        }),
      ];
      updateQuality(items);
      expect(items[0].sellIn).toBe(2);
      expect(items[0].quality).toBe(4);
    });
  });
});

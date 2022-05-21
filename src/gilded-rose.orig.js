function Item(name, sellIn, quality) {
  this.name = name;
  this.sellIn = sellIn;
  this.quality = quality;
}

const DEFAULT_QUALITY_STEP = 1;
const SELL_IN_STEP = 1;
const MIN_QUALITY = 0;
const MAX_QUALITY = 50;
const NEGATIVE_MODIFIER = -1;
const EXPIRY_MODIFIER = 2;
const TO = "..";

const ITEM_TYPES = {
  "Sulfuras, Hand of Ragnaros": {
    legendary: true,
  },
  "Aged Brie": {
    appreciateOnAging: true,
  },
  "Backstage passes to a TAFKAL80ETC concert": {
    appreciateOnAging: true,
    expiry_quality: 0,
    qualitySteps: {
      [`1${TO}5`]: 3,
      [`6${TO}10`]: 2,
      [`11${TO}Infinity`]: 1,
    },
  },
  "Conjured Mana Cake": {
    qualitySteps: {
      [`-Infinity${TO}Infinity`]: 2,
    },
  },
  "Misconfigured demon": {
    qualitySteps: {
      [`Hell${TO}Highwater`]: 2,
    },
  },
};

function updateQuality(items) {
  items.forEach((item) => {
    const itype = ITEM_TYPES[item.name] || {};

    if (itype.legendary) {
      return;
    }

    let newQuality;
    let qualityStep = DEFAULT_QUALITY_STEP;

    if (itype.qualitySteps) {
      const sellInRange = Object.keys(itype.qualitySteps).find(
        (sellInRange) => {
          let [min, max] = sellInRange.split(TO).map(Number);
          if (isNaN(min) || isNaN(max)) {
            console.log(
              `${sellInRange} does not split neatly to numbers! Skipping this.`
            );
            return;
          }
          return min <= item.sellIn && item.sellIn <= max;
        }
      );
      if (sellInRange) {
        qualityStep = itype.qualitySteps[sellInRange];
      }
    }

    if (!itype.appreciateOnAging) {
      qualityStep = qualityStep * NEGATIVE_MODIFIER;
    }

    if (item.sellIn <= 0 && itype.expiry_quality !== undefined) {
      newQuality = itype.expiry_quality;
    } else if (item.sellIn <= 0) {
      newQuality = item.quality + qualityStep * EXPIRY_MODIFIER;
    } else {
      newQuality = item.quality + qualityStep;
    }

    if (newQuality > MAX_QUALITY) {
      newQuality = MAX_QUALITY;
    }
    if (newQuality < MIN_QUALITY) {
      newQuality = MIN_QUALITY;
    }
    console.log(item.quality, newQuality);
    item.quality = newQuality;
    item.sellIn -= SELL_IN_STEP;
  });
}

module.exports = {
  Item,
  updateQuality,
};

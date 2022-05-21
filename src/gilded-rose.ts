interface qualityStepObject {
  [key: string]: number;
}

class Item {
  name: string;
  sellIn: number;
  quality: number;
  defaultQualityStep = 1;
  qualityStep: number | qualityStepObject = 1;
  qualityStepOnExpiry: number = 2;
  minQuality: number = 0;
  maxQuality: number = 50;
  appreciateOnAging: boolean = false;
  legendary: boolean = false;
  qualityOnExpiry?: number;

  constructor(
    name: string,
    sellIn: number,
    quality: number,
    qualityStep?: number | qualityStepObject,
    appreciateOnAging?: boolean,
    legendary?: boolean,
    qualityOnExpiry?: number
  ) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
    if (qualityStep) {
      this.qualityStep = qualityStep;
    }
    if (appreciateOnAging) {
      this.appreciateOnAging = appreciateOnAging;
    }
    if (legendary) {
      this.legendary = legendary;
    }
    if (qualityOnExpiry !== undefined) {
        this.qualityOnExpiry = qualityOnExpiry;
    }
  }

  ageByADay() {
    if (this.legendary) return;
    this.sellIn = this.sellIn - 1;
    this.updateQuality();
  }
  expired(): boolean {
    return this.sellIn <= 0;
  }

  updateQuality() {
    let quality: number;
    let qualityStep = this.defaultQualityStep;
    if (typeof this.qualityStep === "object") {
      let sellInRange = Object.keys(this.qualityStep).find((sellInRange) => {
        const [min, max] = sellInRange.split("..").map(Number);
        return min <= this.sellIn && this.sellIn <= max;
      });
      if (sellInRange) {
        qualityStep = this.qualityStep[sellInRange];
      }
    } else {
      qualityStep = this.qualityStep;
    }
    if (this.expired() && this.qualityOnExpiry !== undefined) {
      this.quality = this.qualityOnExpiry;
      return;
    }
    if (this.expired()) {
      qualityStep = this.qualityStepOnExpiry;
    }
    if (this.appreciateOnAging) {
      qualityStep = qualityStep * -1;
    }
    quality = this.quality - qualityStep;
    if (quality > this.maxQuality) {
      quality = this.maxQuality;
    }
    if (quality < this.minQuality) {
      quality = this.minQuality;
    }
    this.quality = quality;
  }
}

const updateQuality = (items: Item[]) => {
  items.forEach((item) => {
    item.ageByADay();
  });
};

export { updateQuality, Item, qualityStepObject };

import { IconSet } from "./IconSet";

const variants = {
  "16/solid": "16/solid",
  "20/solid": "20/solid",
  "24/solid": "24/solid",
  "24/outline": "24/outline",
  default: "24/outline",
};

export class Heroicons extends IconSet<typeof variants> {
  constructor() {
    super("heroicons", variants, "24/outline");
  }

  loadTags() {
    return [];
  }
}

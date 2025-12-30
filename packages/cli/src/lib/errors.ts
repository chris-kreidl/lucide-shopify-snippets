export class IconNotFoundError extends Error {
  icon: string;

  constructor(icon: string) {
    super(`Icon "${icon}" not found`);

    this.name = "IconNotFoundError";
    this.icon = icon;
  }
}

export class InvalidTagMapStructureError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "InvalidTagMapStructureError";
  }
}

export class UnknownIconSetError extends Error {
  constructor(set: string) {
    super(`Unknown icon set: ${set}`);

    this.name = "UnknownIconSetError";
  }
}

export class UnknownIconVariantError extends Error {
  constructor(variant: string) {
    super(`Unknown variant: ${variant}`);

    this.name = "UnknownIconVariantError";
  }
}

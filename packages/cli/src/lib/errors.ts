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

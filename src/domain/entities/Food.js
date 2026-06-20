// src/domain/entities/Food.js

export class Food {
  constructor({ id, name, description, price, image_url, category, created_at }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = image_url;
    this.category = category;
    this.createdAt = created_at;
  }

  getFormattedPrice() {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(this.price);
  }
}

// src/domain/entities/User.js

export class User {
  constructor({ id, email, role, full_name, created_at }) {
    this.id = id;
    this.email = email;
    this.role = role || 'customer';
    this.fullName = full_name || '';
    this.createdAt = created_at;
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isCustomer() {
    return this.role === 'customer';
  }
}

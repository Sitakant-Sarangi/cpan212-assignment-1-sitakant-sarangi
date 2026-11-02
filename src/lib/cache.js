export class Cache {
  constructor(ttlSeconds) {
    this.ttlSeconds = ttlSeconds;
    this.entries = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry || entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      this.misses += 1;
      return undefined;
    }

    this.hits += 1;
    return entry.value;
  }

  set(key, value) {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + this.ttlSeconds * 1000,
    });
  }

  getStats() {
    const now = Date.now();
    for (const [key, entry] of this.entries) {
      if (entry.expiresAt <= now) {
        this.entries.delete(key);
      }
    }

    return {
      entries: this.entries.size,
      hits: this.hits,
      misses: this.misses,
      ttlSeconds: this.ttlSeconds,
    };
  }
}

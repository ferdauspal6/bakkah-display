export function datatableComponent() {
  return {
    search: '',
    page: 1,
    perPage: 10,
    get filtered() {
      if (!this.search) return this.data
      const q = this.search.toLowerCase()
      return this.data.filter((row) =>
        Object.values(row).some((v) =>
          String(v).toLowerCase().includes(q)
        )
      )
    },
    get pages() {
      return Math.ceil(this.filtered.length / this.perPage)
    },
    get paginated() {
      const start = (this.page - 1) * this.perPage
      return this.filtered.slice(start, start + this.perPage)
    },
    prevPage() {
      if (this.page > 1) this.page--
    },
    nextPage() {
      if (this.page < this.pages) this.page++
    },
  }
}

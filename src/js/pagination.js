export default class CustomPagination {
    constructor(data, itemsPerPage) {
        this.currentPage = 1;
        this.maxPageCount = Math.ceil(data / itemsPerPage)
        this.data = data;
        this.itemsPerPage = itemsPerPage;
    }
    nextPage() {
        if (this.currentPage < this.maxPageCount) ++this.currentPage;
    }
    getItems() {
        return this.data.splice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage)
    }
    resetPagination(data, itemsPerPage) {
        this.currentPage = 1;
        this.maxPageCount = Math.ceil(data / itemsPerPage)
        this.data = data;
        this.itemsPerPage = itemsPerPage;
    }
}



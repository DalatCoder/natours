class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // Filter tours
    const queryObj = { ...this.queryString };
    const excludes = ['page', 'sort', 'limit', 'fields'];
    excludes.forEach(el => delete queryObj[el]); // xoa bo 1 so filter ra khoi query

    // Advanced Filter
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    // Xay dung 1 query object trong mongoose
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // Sorting
    if (this.queryString.sort) {
      // Truong hop sap xep theo nhieu dieu kien query.sort('dk1 dk2 dk3')
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Sap xep giam dan theo thoi gian dien ra tour
      // -createdAt de sap xep giam dan theo truong createdAt
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limit() {
    // Field limiting
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Loai bo truong __v ra khoi response
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

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

    // Advanced filter
    // [gte] -> $gte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

    // Gan gia tri vao query object, sau do chain cac method va await ket qua 1 lan
    this.query = this.query.find(JSON.parse(queryStr));

    // Chaining query object
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      // Truong hop sap xep theo nhieu dieu kien query.sort('dk1 dk2 dk3')
      // 'price,name,rating' -> sort('price name rating')
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      // Mac dinh sap xep giam dan theo thoi gian dien ra tour
      // -createdAt de sap xep giam dan theo truong createdAt
      this.query = this.query.sort('-createdAt');
    }

    // Chaining query object
    return this;
  }

  limit() {
    if (this.queryString.fields) {
      // Chi hien thi 1 so fields
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // Loai bo truong __v ra khoi response
      this.query = this.query.select('-__v');
    }

    // Chaining query object
    return this;
  }

  paginate() {
    // Pagination
    const page = this.queryString.page * 1 || 1; // mac dinh page 1
    const limit = this.queryString.limit * 1 || 10; // 1 page 10 phan tu
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // Chaining query object
    return this;
  }
}

module.exports = APIFeatures;

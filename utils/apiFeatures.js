/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */


class APIFeatures {
  constructor(query, queryString) {
    // query => Tour.find()
    // queryString => { price: { gte: '500' }, sort: '-price' }
    this.query = query;
    this.queryString = queryString;
  }

  filter(){
    // /api/v1/tours?price[gte]=500&difficulty=easy&sort=price
    // this.queryString: { difficulty: 'easy', price: { gte: '500' }, sort: 'price' }
    // { difficulty: 'easy', price: { $gte: '500' } }
    const queryObject = {...this.queryString};
    const excludeFields = ['page','sort','limit','fields'];
    excludeFields.forEach(e => delete queryObject[e]);
    //advanced filtering for mongoose to put $ before gte and so on
    let querStr = JSON.stringify(queryObject);
    querStr = querStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(querStr));

    return this;

  }

 sort(){
    // /api/v1/tours?sort=-price,ratingsAverage
    if(this.queryString.sort){
      const sortBy = this.queryString.split(',').join(" ");
      this.query = this.query.sort(sortBy);
    }
    else{
      this.query = this.query.sort('-createdAt')
    }
    return this
 }

 limitFields(){
  // /api/v1/tours?fields=name,duration,price
  if(this.queryString.fields){
    const fields = this.queryString.fields.split(',').join(' ');
    this.query = this.query.select(fields)
  }
    else {
      this.query = this.query.select('-__v')
    }
    return this;
 }

 paginate(){
  const page = this.queryString.page * 1 || 1;
  const limit = this.queryString.limit * 1 || 100;
  const skip = (page - 1) * limit ;

  this.query = this.query.skip(skip).limit(limit);

  return this;
 }
}

module.exports = APIFeatures

/*
  /api/v1/tours?difficulty=easy&price[gte]=200&sort=-price,ratingsAverage&fields=name,price&page=3&limit=10
  req.query
{
  "difficulty": "easy",
  "price": {
    "gte": "200"
  },
  "sort": "-price,ratingsAverage",
  "fields": "name,price",
  "page": "3",
  "limit": "10"
}
*/
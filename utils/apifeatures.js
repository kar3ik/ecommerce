class ApiFeatures {
    constructor(query,queryStr){
        // query = product.find  queryStr = keyword
        this.query = query;
        this.queryStr = queryStr

    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:"i",
            }
        }:{}
        
        // changing querystr to query
        // this.product.find = keyword
        this.query = this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCopy = {...this.queryStr}

        // removing some filter
        const removeField =["keyword","page","limit"];
        removeField.forEach(key=>delete queryCopy[key])


        // filter for price
        // gt->greater then &&  lt->>less then && gte->greater or equal && lte->less or equal
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gt|lt|lte)\b/g,key=> `$${key}`)


        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }


    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1
        const skip = resultPerPage * (currentPage-1)
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
    

}

module.exports = ApiFeatures
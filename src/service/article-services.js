class ArticleServices {
    static createArticle(data) {
        let article = {}
        article.title = data.title
        article.introduction = data.introduction
        article.content = data.content
        article.articleType = data.articleType
        article.isPublish = data.isPublish
        // 处理封面
        if (data.coverImgObj) {
            // 封面图片url
            article.coverImgUrl = data.coverImgObj.url || ''
            // 封面图片id
            article.coverImgid = data.coverImgObj.id || ''
        }
        // 处理插图
        if (data.illustrationArrs) {
            // 文章内的插图的url中间以:分隔
            let illustrationsUrl = ''
            // 文章内的插图的id以:分隔
            let illustrationsid = ''
            // 遍历数据拼接字符串
            for (let i = 0; i < data.illustrationArrs.length; i++) {
                illustrationsUrl += data.illustrationArrs[i].response.data.url + ':'
                illustrationsid += data.illustrationArrs[i].response.data.id + ':'
            }
            illustrationsUrl = illustrationsUrl.substring(0, illustrationsUrl.length - 1)
            illustrationsid = illustrationsid.substring(0, illustrationsid.length - 1)
            article.illustrationsUrl = illustrationsUrl
            article.illustrationsid = illustrationsid
        }
        return article
    }

    // 处理搜索文章的查询条件
    static articleQueryObj(obj) {
        let queryObj = {}
        if (JSON.stringify(obj) !== "{}") {
            queryObj.title = obj.title 
            queryObj.introduction = obj.introduction
            queryObj.content = obj.content
            queryObj.articleType = obj.articleType
            queryObj.createTimeStart = obj.createTimeStart
            queryObj.createTimeEnd = obj.createTimeEnd
            queryObj.updateTimeStart = obj.updateTimeStart
            queryObj.updateTimeEnd = obj.updateTimeEnd
        }
        return queryObj
    }
}

export default ArticleServices
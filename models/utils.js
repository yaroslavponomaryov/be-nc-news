exports.arrangeCommentsAndArticles = (allComments, allArticles) => {
    const referenceObject = {}
    allArticles.forEach((article)=> {
        referenceObject[article.article_id] = 0;
        allComments.forEach((comment) => {
            if (comment.article_id === article.article_id) {
                referenceObject[article.article_id]++
            }
        });

    });
    return referenceObject
};
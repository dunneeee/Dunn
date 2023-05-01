class MyArr {
    static splitPage(list, page = 1, limit = 10) {
        let start = (page - 1) * limit;
        let end = start + limit;
        return list.slice(start, end);
    }
}

export default MyArr;
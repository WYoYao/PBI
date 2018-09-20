


var id = 1;

var res = [{                //类型：Object  必有字段  备注：无
    "name": "分项名称",                //类型：String  必有字段  备注：分项名称
    "id": "123456",                //类型：String  必有字段  备注：无
    "localId": "VOEi123456",                //类型：String  必有字段  备注：本地编码
    "parentLocalId": true,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
    "area": 125,                //类型：Number  必有字段  备注：面积
    content: _.range(5).map((item, index) => {

        return ((id, index) => {
            var parent = id;
            id += index.toString();

            return {
                "name": "分项名称",                //类型：String  必有字段  备注：分项名称
                "id": id,                //类型：String  必有字段  备注：无
                "localId": id,                //类型：String  必有字段  备注：本地编码
                "parentLocalId": parent,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                "area": 125,                //类型：Number  必有字段  备注：面积
                content: _.range(5).map((item, index) => {

                    return ((id, index) => {
                        var parent = id;
                        id += index.toString();

                        return {
                            "name": "分项名称",                //类型：String  必有字段  备注：分项名称
                            "id": id,                //类型：String  必有字段  备注：无
                            "localId": id,                //类型：String  必有字段  备注：本地编码
                            "parentLocalId": parent,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                            "area": 125,                //类型：Number  必有字段  备注：面积
                            content: _.range(5).map((item, index) => {

                                return ((id, index) => {
                                    var parent = id;
                                    id += index.toString();

                                    return {
                                        "name": "分项名称",                //类型：String  必有字段  备注：分项名称
                                        "id": id,                //类型：String  必有字段  备注：无
                                        "localId": id,                //类型：String  必有字段  备注：本地编码
                                        "parentLocalId": parent,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                                        "area": 125,                //类型：Number  必有字段  备注：面积
                                        content: _.range(5).map((item, index) => {

                                            return ((id, index) => {
                                                var parent = id;
                                                id += index.toString();

                                                return {
                                                    "name": "分项名称",                //类型：String  必有字段  备注：分项名称
                                                    "id": id,                //类型：String  必有字段  备注：无
                                                    "localId": id,                //类型：String  必有字段  备注：本地编码
                                                    "parentLocalId": parent,                //类型：Boolean  必有字段  备注：父级节点本地编码，若为根节点，则此值为-1
                                                    "area": 125,                //类型：Number  必有字段  备注：面积
                                                };
                                            })(id, index)

                                        })
                                    };
                                })(id, index)

                            })
                        };
                    })(id, index)
                })
            };
        })(id, index)
    })
}].reduce(function (con, item) {

    con.push(item);

    if (_.isArray(item.content)) {
        item.content.reduce(arguments.callee, con);
    }

    delete item.content;

    return con;
}, [])

console.log(res);
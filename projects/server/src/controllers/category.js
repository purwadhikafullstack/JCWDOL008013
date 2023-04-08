const CategoryModel = require("../model/category");

module.exports = {
    getCategoryData: async (req, res) => {
        try {
        let data = await CategoryModel.findAll();
        return res.status(200).send(data);
        } catch (error) {
        console.log(error);
        return res.status(500).send(error);
        }
    },
    createUpdateCategory: async(req, res)=>{
        try {
            if(req.path === "/post"){
                const [data, created] = await CategoryModel.upsert(req.body)
                return res.status(200).send(data);
            }
            
            return res.status(200).send('wow')
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    removeCategory: async(req,res)=>{
        try {
            let data = await CategoryModel.destroy({
                where: {
                    // criteria
                }
            })
            return res.status(200).send(data)
        } catch (error) {
            return res.status(500).send(error)
        }
    },
};

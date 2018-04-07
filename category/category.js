const mongoose = require('mongoose');

const Profile = mongoose.model('Profile');
const Category = mongoose.model('Category');

exports.getCategories = (req, res, next) => {
    // find all categories for a profile
    Category.find({_pid: req.params.pid})
    .exec()
    .then(categories => {
        res.send(categories);
    })
    .catch(err => {
        res.status(404).json({ error: err })
    })
}

exports.createCategory = (req, res, next) => {    
    const category = new Category({
        _pid: req.params.pid,
        _id: new mongoose.Types.ObjectId(),
    });

    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    for (let i = 0; i < keys.length; i += 1) {
        category[keys[i]] = values[i];
    }

    Category.collection.insertOne(category);
    
    Profile.update(
        { _id: req.params.pid },
        { $addToSet: { categories: category}}
    )
    .exec()
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(404).json({error: err})
    })
    
}

exports.createCategories = (req, res, next) => {
    const newCategories = req.body.map((newData, index) => {
        const category = new Category({
            _pid: req.params.pid,
            _id: new mongoose.Types.ObjectId(),
        })

        const keys = Object.keys(req.body[index]);
        const values = Object.values(req.body[index]);
        for (let i = 0; i < keys.length; i += 1) {
            category[keys[i]] = values[i]
        }
        return category;
    })

    Category.collection.insertMany(newCategories)
    Profile.update(
        { _id: req.params.pid },
        { $addToSet: { categories: newCategories}}
    )
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        res.status(404).json({error: err});
    })
}

exports.updateCategory = (req, res, next) => {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);

    const updateOperations = {}
    for (let i = 0; i < keys.length; i += 1) {
        updateOperations[keys[i]] = values[i];
    }

    Category.update(
        { _id: req.params.id },
        { $set: updateOperations }
    )
    .exec()
    .then( result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(404).json({ error: err})
    })
}

exports.checkDefault = (req, res, next) => {
    Category.findById({_id: req.params.id})
    .exec()
    .then(result => {
        if(result.default) {
            Category.update(
                { _id: req.params.id },
                { $set: { isVisible: false } }
            )
            .exec()
            .then(updateResult => {
                res.status(200).json({ updateResult })
            })
            .catch(err => {
                res.status(404).json({ error: err })
            })
        } else {
            next();
        }
    })
    .catch(err => {
        res.status(404).json({error: err});
    }) 
}

exports.deleteCategory = (req, res, next) => { 
    Category.remove({_id: req.params.id})
    .exec()
    .then((result) => {
        console.log(result);
        next();
    })
    .catch( err => {
        res.status(404).json({ error: err })
    })
}

exports.deleteProfileCategory = (req, res, next) => {
    Profile.update(
        {},
        { $pull: { categories: req.params.id.toString() }}
    )
    .exec()
    .then(result => {
        res.status(200).json({ result })
    })
    .catch(err => {
        res.status(404).json({ Error: err });
    })
}

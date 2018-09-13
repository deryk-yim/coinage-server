const mongoose = require('mongoose');
const Import = mongoose.model('Import');
const Profile = mongoose.model('Profile');

exports.getImports = (req, res) => {
    Import.find({
        _pid: req.params.pid
    }).exec()
        .then((imports) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(imports);
        })
        .catch((err => {
            res.status(404).json({
                error: err
            })
        }))
};

exports.createImport = (req, res) => {    
    const importRecord = new Import({
        _pid: req.params.pid,
        _id: new mongoose.Types.ObjectId(),
    });

    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    for (let i = 0; i < keys.length; i += 1) {
        importRecord[keys[i]] = values[i];
    }

    Import.collection.insertOne(importRecord);
    
    Profile.update(
        { _id: req.params.pid },
        { $addToSet: { imports: importRecord}}
    )
    .exec()
    .then(result => {
        res.status(201).json(result);
    })
    .catch(err => {
        res.status(404).json({error: err})
    })
}



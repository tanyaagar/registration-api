const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true
    },
    email: {
        type: String,
        lowercase:true,
        required : true
    },
    studentNumber: {
        type: String,
        required : true
    },

    universityNumber: {
        type: String,
        required : true
    },

    branch: {
        type: String,
        required : true
    },

    mobileNumber: {
        type: String,
        required : true
    }
});
module.exports = mongoose.model('Student', studentSchema);
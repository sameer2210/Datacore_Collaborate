import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return v.length >= 2;
            },
            message: props => `Name must be at least 2 characters long!`
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^(\+[1-9]\d{1,14}|\+[1-9]\d{0,2}\s\d{1,14}|\d{10,14})$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    date: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/.test(v);
            },
            message: props => `${props.value} is not a valid date in dd/mm/yyyy format!`
        }
    },
    time: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(v);
            },
            message: (props) => `${props.value} is not a valid time in HH:MM (24-hour) format!`,
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comment: {
        type: String,
        trim: true
    },
    completedAt: {
        type: Date,
    }
});

const Call = mongoose.model('Call', callSchema);

export default Call;

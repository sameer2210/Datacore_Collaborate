import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
        trim: true,
        minlength: [2, "Name must be at least 2 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: false,
        trim: true,
        validate: {
            validator: function (v) {
                return /^(\+\d{1,3}[- ]?)?\d{10,14}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    password: {
        type: String,
        required: false,
    },
    profileImage: {
        type: String,
        required: false,
        trim: true
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: false
    },
    role: {
        type: String,
        enum: ["admin", "member", "viewer", "super_admin"],
        default: 'admin',
        required: false
    },
    isDummy: {
        type: Boolean,
        default: false
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    softDelete: {
        type: Boolean,
        default: false
    },
    invited: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
            unique: true
        },
        status: {
            type: String,
            enum: ['pending', 'accepted'],
        },
        invitedDate: {
            type: Date,
        }
    },
    lastActive: {
        type: Date
    }

}, { timestamps: true });

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        if (!passwordRegex.test(this.password)) {
            throw new Error('Password must be at least 8 characters long and contain at least 1 special character, 1 number, 1 lowercase letter, and 1 uppercase letter');
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
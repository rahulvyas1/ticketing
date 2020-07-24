import mongoose from 'mongoose'

// An interface that describes the properties
// that are required to create a new User
interface userAttrs {
    id: string;
    email: string;
}

// An interface that describes the properties
// that a user document has
interface UserDoc extends mongoose.Document {
    email: string;
}

// An interface that describes the properties
// that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: userAttrs): UserDoc;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret.__v
            delete ret._id
        }

    }
})


userSchema.statics.build = (attrs: userAttrs) => {
    return new User({
        email: attrs.email,
        _id: attrs.id
    })
}



const User = mongoose.model<UserDoc, UserModel>('User', userSchema)


export { User }
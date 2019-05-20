const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    //TODO check if user is logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );

    console.log(item);
    return item;
  },

  updateItem(parent, args, ctx, info) {
    //get copy of item
    const updates = { ...args };
    //remove ID
    delete updates.id;
    // run update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    //find item
    const item = await ctx.db.query.item({ where }, `{id title}`);
    //TODO check permissions

    //Delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    //Lowercase email
    const errors = [];
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    if (args.password === "") errors.push(new Error("Password cannot be empty"));
    if (args.name === "") errors.push(new Error("Name cannot be empty"));
    if (args.email === "") errors.push(new Error("Email cannot be empty"));
    if (errors.length > 0) {
        throw errors;
    }
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    //create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set jwt token in cookie

    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });

    // now we return user

    return user;
  }
};

module.exports = Mutations;

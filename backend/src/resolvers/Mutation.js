const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");
const { transport, makeANiceEmail } = require("../mail");
const { hasPermission } = require("../utils");

const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    const hasPermission = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMCREATE"].includes(permission)
    );
    if (!hasPermission) {
      throw new Error("Not allowed");
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          //create relationship between item and user
          user: {
            connect: {
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    );

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
    const item = await ctx.db.query.item({ where }, `{id title user {id}}`);

    //check if owner
    const ownsItem = item.user.id === ctx.request.userId;
    //check if admin or itemdelete
    const hasPermission = ctx.request.user.permissions.some(permission =>
      ["ADMIN", "ITEMDELETE"].includes(permission)
    );
    if (!ownsItem && !hasPermission){
        throw new Error('Not allowed');
    }
    //Delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // check if any users to define admin

    const currentUsers = await ctx.db.query.users({}, info);
    if (currentUsers.length === 0) {
      permissions = ["ADMIN"];
    } else {
      permissions = ["USER"];
    }

    //Lowercase email
    const errors = [];
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: permissions }
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
  },

  async signin(parent, { email, password }, ctx, info) {
    // check if there's user with email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error("Incorrect email/password combination");
    }
    //check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Incorrect email/password combination");
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // Set cookie with token
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });
    // Return user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie("token");
    return { message: "Logged Out" };
  },

  async requestReset(parent, { email }, ctx, info) {
    //check if there's real user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error("No such user found");
    }
    //set token and expiry on user
    const resetToken = (await promisify(randomBytes)(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });
    //email to user
    //TODO error handling
    const mailRes = await transport.sendMail({
      from: "rmorales82@outlook.com",
      to: user.email,
      subject: "Your password reset link",
      html: makeANiceEmail(`Your password reset link: \n\n

        <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click to reset your password</a>`)
    });

    return { message: "Please check your email" };
  },

  async resetPassword(
    parent,
    { resetToken, password, confirmPassword },
    ctx,
    info
  ) {
    //check if passwords match
    if (!(password === confirmPassword)) {
      throw new Error("Passwords don't match");
    }
    //check if there's a legit reset token
    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gte: Date.now() }
    });
    if (!user) {
      throw new Error("Invalid/Expired Token");
    }
    // hash new passowrd
    const newPassword = await bcrypt.hash(password, 10);
    //save new password and remove reset tokens
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { id: user.id },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    // generate jwt
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    //set cookie
    ctx.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 //1 year cookie
    });

    // return user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    //check logged in
    if (!ctx.request.userId) {
      throw new Error("Please Log in");
    }
    //query current user
    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: ctx.request.userId
        }
      },
      info
    );
    //check permissions
    hasPermission(currentUser, ["ADMIN", "PERMISSIONUPDATE"]);
    //update permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      },
      info
    );
  }
};

module.exports = Mutations;

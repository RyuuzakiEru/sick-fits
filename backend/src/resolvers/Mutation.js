const mutations = {
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
  }
};

module.exports = mutations;
